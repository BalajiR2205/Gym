import { NextResponse } from "next/server";
import { clearMemberSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearMemberSession();
  return NextResponse.json({
    success: true,
    redirect: "/login/member",
  });
}

export async function GET(request: Request) {
  await clearMemberSession();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login/member`);
}
