import { NextResponse } from "next/server";
import crypto from "crypto";
import { errorResponse } from "@/lib/api/errors";
import { requireManagementStaff } from "@/lib/auth/staff";
import { signPersonalQrPayload } from "@/lib/checkin/validation";
import { generateQrDataUrl } from "@/lib/qr/generate";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireManagementStaff();
    const { id } = context.params;
    const { searchParams } = new URL(request.url);
    const rotate = searchParams.get("rotate") === "true";

    let member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (rotate) {
      member = await prisma.member.update({
        where: { id },
        data: {
          personal_qr_secret: crypto.randomBytes(32).toString("hex"),
        },
      });
    }

    const payload = signPersonalQrPayload(member.id, member.personal_qr_secret);
    const qr_image_data_url = await generateQrDataUrl(payload);

    return NextResponse.json({
      member_id: member.id,
      qr_payload: payload,
      qr_image_data_url,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
