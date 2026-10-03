import { NextResponse } from "next/server";
import { verifyMemberOtp } from "@/lib/auth/member";
import { setMemberSessionCookie } from "@/lib/auth/session";
import { serializeMember } from "@/lib/api/serialize";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { memberId, otp } = body as {
      memberId?: string;
      otp?: string;
    };

    if (!memberId || !otp) {
      return NextResponse.json(
        { error: "Member ID and verification code are required." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await verifyMemberOtp(memberId, otp, ip);

    if (!result.success || !result.token || !result.member) {
      return NextResponse.json(
        { error: result.error || "Invalid verification code." },
        { status: result.status || 401 }
      );
    }

    // Set secure HttpOnly session cookie
    await setMemberSessionCookie(result.token);

    return NextResponse.json({
      success: true,
      redirect: "/member",
      member: serializeMember(result.member),
    });
  } catch (error) {
    console.error("[Verify OTP API Error]:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
