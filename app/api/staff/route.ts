import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { requireAdminStaff } from "@/lib/auth/staff";
import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/service";
import type { StaffRole } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminStaff();
    const staff = await prisma.staff.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        auth_user_id: true,
        full_name: true,
        role: true,
        created_at: true,
      },
    });

    let emailMap = new Map<string, string>();
    try {
      const supabase = createServiceClient();
      const { data: usersData } = await supabase.auth.admin.listUsers();
      if (usersData?.users) {
        emailMap = new Map(
          usersData.users.filter((u) => u.email).map((u) => [u.id, u.email as string])
        );
      }
    } catch {
      // If supabase service client is unavailable, continue with null email
    }

    return NextResponse.json({
      staff: staff.map((s) => ({
        id: s.id,
        auth_user_id: s.auth_user_id,
        email: emailMap.get(s.auth_user_id) ?? null,
        full_name: s.full_name,
        role: s.role,
        created_at: s.created_at.toISOString(),
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminStaff();
    const body = await request.json();

    const { email, password, full_name, role } = body as {
      email?: string;
      password?: string;
      full_name?: string;
      role?: StaffRole;
    };

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "email, password, full_name, and role are required" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "FRONT_DESK", "TRAINER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, FRONT_DESK, or TRAINER" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? "Failed to create auth user" },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        auth_user_id: authData.user.id,
        full_name,
        role,
      },
      select: {
        id: true,
        auth_user_id: true,
        full_name: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json(
      {
        staff: {
          ...staff,
          email: authData.user.email ?? email,
          created_at: staff.created_at.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
