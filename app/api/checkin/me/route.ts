import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMember } from "@/lib/api/serialize";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const member = await prisma.member.findFirst({
      where: { auth_user_id: user.id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member profile linked to this account" },
        { status: 404 }
      );
    }

    return NextResponse.json({ member: serializeMember(member) });
  } catch (error) {
    return errorResponse(error);
  }
}
