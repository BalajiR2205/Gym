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
      first_name?: string;
      last_name?: string;
      phone?: string;
      email?: string | null;
      photo_url?: string | null;
      plan?: Plan;
      joined_at?: Date;
      expires_at?: Date;
      date_of_birth?: Date | null;
      status?: ReturnType<typeof parseStatus>;
    } = {};

    if (body.first_name !== undefined) data.first_name = body.first_name;
    if (body.last_name !== undefined) data.last_name = body.last_name;
    if (body.full_name !== undefined) {
      const parts = body.full_name.split(" ");
      data.first_name = parts[0] || "";
      data.last_name = parts.slice(1).join(" ") || "";
    }
    if (body.phone !== undefined) data.phone = body.phone.trim();
    if (body.email !== undefined)
      data.email = body.email?.trim() ? body.email.trim() : null;
    if (body.photo_url !== undefined) data.photo_url = body.photo_url;
    if (body.plan !== undefined) data.plan = parsePlan(body.plan);
    if (body.joined_at !== undefined) data.joined_at = new Date(body.joined_at);
    if (body.expires_at !== undefined)
      data.expires_at = new Date(body.expires_at);
    if (body.date_of_birth !== undefined)
      data.date_of_birth = body.date_of_birth?.trim() ? new Date(body.date_of_birth.trim()) : null;
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
