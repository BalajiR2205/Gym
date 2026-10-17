import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import {
  generateRotatingTokenValue,
  getCheckinUrl,
  getTokenWindow,
} from "@/lib/checkin/tokens";
import { generateQrDataUrl } from "@/lib/qr/generate";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const reqOrigin = host ? `${proto}://${host}` : undefined;

    const now = new Date();
    const minBuffer = new Date(now.getTime() + 15_000); // Token must have at least 15s life left

    const existing = await prisma.checkinToken.findFirst({
      where: {
        window_start: { lte: now },
        expires_at: { gt: minBuffer },
      },
      orderBy: { window_start: "desc" },
    });

    let tokenRecord = existing;

    if (!tokenRecord) {
      const { windowStart, expiresAt } = getTokenWindow(now);
      const token = generateRotatingTokenValue();
      tokenRecord = await prisma.checkinToken.create({
        data: {
          token,
          window_start: windowStart,
          expires_at: expiresAt,
        },
      });
    }

    const checkinUrl = getCheckinUrl(tokenRecord.token, reqOrigin);
    const qr_image_data_url = await generateQrDataUrl(checkinUrl);

    return NextResponse.json({
      token: tokenRecord.token,
      qr_image_data_url,
      expires_at: tokenRecord.expires_at.toISOString(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
