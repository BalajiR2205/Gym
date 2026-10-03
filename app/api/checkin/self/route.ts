import { NextResponse } from "next/server";
import { serializeMember } from "@/lib/api/serialize";
import {
  assertMemberCanCheckIn,
} from "@/lib/checkin/validation";
import { parseMemberCode } from "@/lib/members/code";
import { prisma } from "@/lib/prisma";

import { appendAttendanceToGoogleSheets } from "@/lib/google/sheets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      token,
      member_id: rawMemberId,
      identifier,
    } = body as {
      token?: string;
      member_id?: string;
      identifier?: string;
    };

    const searchKey = identifier?.trim() || rawMemberId?.trim();

    if (!token || !searchKey) {
      return NextResponse.json(
        { error: "token and Member ID/phone are required" },
        { status: 400 }
      );
    }

    let checkinToken = null;
    try {
      checkinToken = await prisma.checkinToken.findUnique({
        where: { token },
      });

      // If token is client-generated fallback from reception QR (starts with bst_)
      if (!checkinToken && token.startsWith("bst_")) {
        const now = new Date();
        checkinToken = await prisma.checkinToken.create({
          data: {
            token,
            window_start: now,
            expires_at: new Date(now.getTime() + 120_000),
          },
        });
      }
    } catch (dbErr) {
      console.error("[Database Connection Error in checkin]:", dbErr);
      return NextResponse.json(
        {
          error: "Database connection failed. Please ensure the local database server (npx prisma dev) is running.",
          code: "DATABASE_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    if (!checkinToken) {
      return NextResponse.json(
        { error: "Invalid or expired check-in token", code: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (checkinToken.expires_at <= now) {
      return NextResponse.json(
        { error: "Check-in token has expired", code: "TOKEN_EXPIRED" },
        { status: 400 }
      );
    }

    // Resolve member by short code, UUID, phone, or email
    const parsedCode = parseMemberCode(searchKey);
    let member: Awaited<ReturnType<typeof prisma.member.findFirst>> | null = null;

    if (parsedCode !== null) {
      member = await prisma.member.findUnique({
        where: { member_number: parsedCode },
      });
    }

    if (!member) {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          searchKey
        );

      member = await prisma.member.findFirst({
        where: {
          OR: [
            ...(isUuid ? [{ id: searchKey }] : []),
            { phone: searchKey },
            { phone: { endsWith: searchKey.slice(-10) } },
            { email: { equals: searchKey, mode: "insensitive" as const } },
          ],
        },
      });
    }

    if (!member) {
      return NextResponse.json(
        {
          error: "Member ID not recognized. Please check with the front desk.",
          code: "MEMBER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (checkinToken.used_by_member_ids.includes(member.id)) {
      return NextResponse.json(
        {
          error: "You have already checked in with this QR code",
          code: "TOKEN_ALREADY_USED",
        },
        { status: 409 }
      );
    }

    // Cooldown check (catch gracefully)
    try {
      await assertMemberCanCheckIn(member);
    } catch (validationErr) {
      return NextResponse.json(
        {
          error: (validationErr as Error)?.message || "Check-in limit reached",
          code: (validationErr as { code?: string })?.code || "CHECKIN_FAILED",
        },
        { status: (validationErr as { status?: number })?.status || 400 }
      );
    }

    const [attendance] = await prisma.$transaction([
      prisma.attendance.create({
        data: {
          member_id: member.id,
          method: "SELF_SCAN",
        },
      }),
      prisma.checkinToken.update({
        where: { token },
        data: {
          used_by_member_ids: { push: member.id },
        },
      }),
    ]);

    // Immediately log to Google Sheets in background
    appendAttendanceToGoogleSheets({
      id: attendance.id,
      member_id: member.phone || member.id,
      member_name: `${member.first_name}${member.last_name ? ` ${member.last_name}` : ""}`,
      member_phone: member.phone,
      checked_in_at: attendance.checked_in_at,
      method: "RECEPTION_QR",
    }).catch((err) =>
      console.error("[GoogleSheets] Checkin append error:", err)
    );

    return NextResponse.json({
      success: true,
      member: serializeMember(member),
      attendance: {
        id: attendance.id,
        checked_in_at: attendance.checked_in_at.toISOString(),
        method: "self_scan",
      },
    });
  } catch (error) {
    console.error("[Checkin API Error]:", error);
    const rawMsg = (error as Error)?.message || "";
    const cleanMsg =
      rawMsg.includes("invocation") || rawMsg.includes("ECONNREFUSED")
        ? "Database service unavailable. Please check that the local database server (npx prisma dev) is running."
        : rawMsg || "Internal server error";

    return NextResponse.json(
      { error: cleanMsg },
      { status: 500 }
    );
  }
}
