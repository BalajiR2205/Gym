import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMethod } from "@/lib/api/serialize";
import { requireManagementStaff } from "@/lib/auth/staff";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    await requireManagementStaff();
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("member_id")?.trim();
    const from = searchParams.get("from")?.trim();
    const to = searchParams.get("to")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    const where: {
      member_id?: string;
      checked_in_at?: { gte?: Date; lte?: Date };
    } = {};

    if (memberId) where.member_id = memberId;
    if (from || to) {
      where.checked_in_at = {};
      if (from) where.checked_in_at.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.checked_in_at.lte = toDate;
      }
    }

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          member: {
            select: { id: true, full_name: true, phone: true },
          },
          staff: {
            select: { id: true, full_name: true },
          },
        },
        orderBy: { checked_in_at: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.attendance.count({ where }),
    ]);

    return NextResponse.json({
      attendance: records.map((a) => ({
        id: a.id,
        member_id: a.member_id,
        member_name: a.member.full_name,
        member_phone: a.member.phone,
        checked_in_at: a.checked_in_at.toISOString(),
        method: serializeMethod(a.method),
        marked_by: a.marked_by,
        marked_by_name: a.staff?.full_name ?? null,
      })),
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
