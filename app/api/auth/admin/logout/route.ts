import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({
    success: true,
    redirect: "/login/admin",
  });
}

export async function GET(request: Request) {
  await clearAdminSession();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login/admin`);
}
