import { NextResponse } from "next/server";
import { clearAdminSession, clearMemberSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await Promise.all([clearAdminSession(), clearMemberSession()]);
  return NextResponse.json({
    success: true,
    redirect: "/login",
  });
}

export async function GET(request: Request) {
  await Promise.all([clearAdminSession(), clearMemberSession()]);
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`);
}
