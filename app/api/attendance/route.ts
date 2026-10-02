import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMethod } from "@/lib/api/serialize";
import { requireManagementStaff } from "@/lib/auth/staff";
import { parseMemberCode } from "@/lib/members/code";
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
      member?: { OR?: Array<Record<string, unknown>> };
      checked_in_at?: { gte?: Date; lte?: Date };
    } = {};

    if (memberId) {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          memberId
        );
      if (isUuid) {
        where.member_id = memberId;
      } else {
        const parsedCode = parseMemberCode(memberId);
        const memberOr: Array<Record<string, unknown>> = [
          { phone: { contains: memberId } },
          { first_name: { contains: memberId, mode: "insensitive" } },
          { last_name: { contains: memberId, mode: "insensitive" } },
        ];
        if (parsedCode !== null) {
          memberOr.push({ member_number: parsedCode });
        }
        where.member = { OR: memberOr };
      }
    }
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
            select: { id: true, first_name: true, last_name: true, phone: true },
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
        member_name: `${a.member.first_name} ${a.member.last_name}`.trim(),
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
