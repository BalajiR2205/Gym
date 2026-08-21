import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { parsePlan, parseStatus, serializeMember } from "@/lib/api/serialize";
import { requireManagementStaff } from "@/lib/auth/staff";
import { generatePersonalQrSecret } from "@/lib/checkin/validation";
import { prisma } from "@/lib/prisma";
import type { MemberStatus, Plan } from "@/app/generated/prisma/client";

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
        full_name?: { contains: string; mode: "insensitive" };
        phone?: { contains: string };
        email?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (status) {
      where.status = parseStatus(status);
    }

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
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
      full_name,
      phone,
      email,
      photo_url,
      plan,
      joined_at,
      expires_at,
      status,
    } = body as {
      full_name?: string;
      phone?: string;
      email?: string | null;
      photo_url?: string | null;
      plan?: string;
      joined_at?: string;
      expires_at?: string;
      status?: string;
    };

    if (!full_name || !phone || !plan || !joined_at || !expires_at) {
      return NextResponse.json(
        {
          error:
            "full_name, phone, plan, joined_at, and expires_at are required",
        },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        full_name,
        phone,
        email: email ?? null,
        photo_url: photo_url ?? null,
        plan: parsePlan(plan) as Plan,
        joined_at: new Date(joined_at),
        expires_at: new Date(expires_at),
        status: status ? parseStatus(status) : "ACTIVE",
        personal_qr_secret: generatePersonalQrSecret(),
      },
    });

    return NextResponse.json({ member: serializeMember(member) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
