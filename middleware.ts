import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, MEMBER_COOKIE_NAME } from "@/lib/auth/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect legacy /admin/login to new /login/admin
  if (pathname === "/admin/login") {
    const loginAdminUrl = request.nextUrl.clone();
    loginAdminUrl.pathname = "/login/admin";
    return NextResponse.redirect(loginAdminUrl);
  }

  // 2. Protect Admin routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!adminToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login/admin";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Member routes (/member/* or /member)
  if (pathname === "/member" || pathname.startsWith("/member/")) {
    const memberToken = request.cookies.get(MEMBER_COOKIE_NAME)?.value;

    if (!memberToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login/member";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member", "/member/:path*"],
};
