import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMember } from "@/lib/api/serialize";
import {
  assertMemberCanCheckIn,
} from "@/lib/checkin/validation";
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

    const checkinToken = await prisma.checkinToken.findUnique({
      where: { token },
    });

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

    // Resolve member by UUID, phone, or email
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        searchKey
      );

    let member = await prisma.member.findFirst({
      where: {
        OR: [
          ...(isUuid ? [{ id: searchKey }] : []),
          { phone: searchKey },
          { phone: { endsWith: searchKey.slice(-10) } },
          { email: { equals: searchKey, mode: "insensitive" as const } },
        ],
      },
    });

    // If not found in DB, auto-create a member profile for this Unique ID
    if (!member) {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);

      member = await prisma.member.create({
        data: {
          full_name: `Member (${searchKey})`,
          phone: searchKey,
          plan: "MONTHLY_1",
          joined_at: today,
          expires_at: nextYear,
          status: "ACTIVE",
          personal_qr_secret: Math.random().toString(36).substring(2, 15),
        },
      });
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
    } catch (validationErr: any) {
      return NextResponse.json(
        {
          error: validationErr.message || "Check-in limit reached",
          code: validationErr.code || "CHECKIN_FAILED",
        },
        { status: validationErr.status || 400 }
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
      member_name: member.full_name,
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
  } catch (error: any) {
    console.error("[Checkin API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
