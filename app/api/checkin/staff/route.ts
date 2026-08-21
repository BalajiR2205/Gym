import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMember, serializeMethod } from "@/lib/api/serialize";
import { requireCheckinStaff } from "@/lib/auth/staff";
import {
  assertMemberCanCheckIn,
  verifyPersonalQrAndGetMember,
} from "@/lib/checkin/validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await requireCheckinStaff();
    const body = await request.json();
    const { qr_payload: qrPayload } = body as { qr_payload?: string };

    if (!qrPayload) {
      return NextResponse.json(
        { error: "qr_payload is required" },
        { status: 400 }
      );
    }

    const member = await verifyPersonalQrAndGetMember(qrPayload);
    await assertMemberCanCheckIn(member);

    const attendance = await prisma.attendance.create({
      data: {
        member_id: member.id,
        method: "STAFF_SCAN",
        marked_by: session.staff.id,
      },
    });

    return NextResponse.json({
      success: true,
      member: serializeMember(member),
      attendance: {
        id: attendance.id,
        checked_in_at: attendance.checked_in_at.toISOString(),
        method: serializeMethod(attendance.method),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
