import { NextResponse } from "next/server";
import { validateAdminCredentials, createAdminSession } from "@/lib/auth/admin";
import { setAdminSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, recordRateLimitAttempt, clearRateLimit } from "@/lib/auth/rateLimit";
import { RATE_LIMIT_ADMIN_LOGIN } from "@/lib/auth/constants";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 400 }
      );
    }

    // Extract client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimitKey = `admin_login_ip:${ip}`;
    const rateLimit = await checkRateLimit(
      rateLimitKey,
      RATE_LIMIT_ADMIN_LOGIN.maxAttempts,
      RATE_LIMIT_ADMIN_LOGIN.windowMs
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please wait 15 minutes before trying again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // Validate credentials server-side against environment variables
    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      await recordRateLimitAttempt(rateLimitKey);
      // Return generic error; never reveal if username or password was wrong
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    await clearRateLimit(rateLimitKey).catch(() => {});

    // Create secure database session
    const { token } = await createAdminSession(username);

    // Set secure HttpOnly cookie
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      redirect: "/admin/members",
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
