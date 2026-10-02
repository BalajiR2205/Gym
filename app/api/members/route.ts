import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { parsePlan, parseStatus, serializeMember } from "@/lib/api/serialize";
import { requireManagementStaff } from "@/lib/auth/staff";
import { generatePersonalQrSecret } from "@/lib/checkin/validation";
import { parseMemberCode } from "@/lib/members/code";
import { computeExpiryDate } from "@/lib/members/plan";
import { prisma } from "@/lib/prisma";
import type { MemberStatus } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  try {
    await requireManagementStaff();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    const where: {
      status?: MemberStatus;
      OR?: Array<{
        first_name?: { contains: string; mode: "insensitive" };
        last_name?: { contains: string; mode: "insensitive" };
        phone?: { contains: string };
        email?: { contains: string; mode: "insensitive" };
        member_number?: number;
      }>;
    } = {};

    if (status) {
      where.status = parseStatus(status);
    }

    if (search) {
      const parsedSearchCode = parseMemberCode(search);
      where.OR = [
        { first_name: { contains: search, mode: "insensitive" } },
        { last_name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        ...(parsedSearchCode !== null ? [{ member_number: parsedSearchCode }] : []),
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      members: members.map(serializeMember),
      pagination: {
        page,
        page_size: PAGE_SIZE,
        total,
        total_pages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireManagementStaff();
    const body = await request.json();

    const {
      first_name,
      last_name,
      phone,
      email,
      photo_url,
      plan,
      joined_at,
      expires_at,
      date_of_birth,
      status,
    } = body as {
      first_name?: string;
      last_name?: string;
      phone?: string;
      email?: string | null;
      photo_url?: string | null;
      plan?: string;
      joined_at?: string;
      expires_at?: string;
      date_of_birth?: string | null;
      status?: string;
    };

    if (!first_name || !phone || !plan) {
      return NextResponse.json(
        {
          error: "first_name, phone, and plan are required",
        },
        { status: 400 }
      );
    }

    const joinedDate = joined_at ? new Date(joined_at) : new Date();
    const parsedPlan = parsePlan(plan);
    const sanitizedEmail = email?.trim() ? email.trim() : null;
    const sanitizedDob = date_of_birth?.trim() ? new Date(date_of_birth.trim()) : null;
    const expiryDate = expires_at ? new Date(expires_at) : computeExpiryDate(joinedDate, parsedPlan);

    const member = await prisma.member.create({
      data: {
        first_name: first_name.trim(),
        last_name: (last_name ?? "").trim(),
        phone: phone.trim(),
        email: sanitizedEmail,
        photo_url: photo_url ?? null,
        plan: parsedPlan,
        joined_at: joinedDate,
        expires_at: expiryDate,
        date_of_birth: sanitizedDob,
        status: status ? parseStatus(status) : "ACTIVE",
        personal_qr_secret: generatePersonalQrSecret(),
      },
    });

    return NextResponse.json(
      { member: serializeMember(member) },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
