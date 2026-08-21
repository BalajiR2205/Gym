import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { parsePlan, parseStatus, serializeMember } from "@/lib/api/serialize";
import { requireManagementStaff } from "@/lib/auth/staff";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireManagementStaff();
    const { id } = context.params;

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member: serializeMember(member) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireManagementStaff();
    const { id } = context.params;
    const body = await request.json();

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const data: {
      full_name?: string;
      phone?: string;
      email?: string | null;
      photo_url?: string | null;
      plan?: Plan;
      joined_at?: Date;
      expires_at?: Date;
      status?: ReturnType<typeof parseStatus>;
    } = {};

    if (body.full_name !== undefined) data.full_name = body.full_name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.email !== undefined) data.email = body.email;
    if (body.photo_url !== undefined) data.photo_url = body.photo_url;
    if (body.plan !== undefined) data.plan = parsePlan(body.plan);
    if (body.joined_at !== undefined) data.joined_at = new Date(body.joined_at);
    if (body.expires_at !== undefined)
      data.expires_at = new Date(body.expires_at);
    if (body.status !== undefined) data.status = parseStatus(body.status);

    const member = await prisma.member.update({
      where: { id },
      data,
    });

    return NextResponse.json({ member: serializeMember(member) });
  } catch (error) {
    return errorResponse(error);
  }
}
