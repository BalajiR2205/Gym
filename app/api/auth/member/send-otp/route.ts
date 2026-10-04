import { NextResponse } from "next/server";
import { requestMemberOtp } from "@/lib/auth/member";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { memberId } = body as { memberId?: string };

    if (!memberId || typeof memberId !== "string" || !memberId.trim()) {
      return NextResponse.json(
        { error: "Please enter your Email or phone number." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await requestMemberOtp(memberId, ip);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          cooldownSeconds: result.cooldownSeconds,
        },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      maskedEmail: result.maskedEmail,
      cooldownSeconds: result.cooldownSeconds || 60,
    });
  } catch (error) {
    console.error("[Send OTP API Error]:", error);
    return NextResponse.json(
      { error: "Unable to process OTP request. Please try again." },
      { status: 500 }
    );
  }
}
