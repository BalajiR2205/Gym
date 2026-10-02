import type { StaffRole } from "@/app/generated/prisma/client";
import { ApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const CHECKIN_ROLES: StaffRole[] = ["ADMIN", "FRONT_DESK"];
const MANAGEMENT_ROLES: StaffRole[] = ["ADMIN", "FRONT_DESK"];

export type StaffSession = {
  userId: string;
  staff: {
    id: string;
    auth_user_id: string;
    full_name: string | null;
    role: StaffRole;
  };
};

export async function getStaffSession(): Promise<StaffSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const staff = await prisma.staff.findUnique({
    where: { auth_user_id: user.id },
  });

  if (!staff) return null;

  return {
    userId: user.id,
    staff: {
      id: staff.id,
      auth_user_id: staff.auth_user_id,
      full_name: staff.full_name,
      role: staff.role,
    },
  };
}

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) {
    throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
  }
  return session;
}

export async function requireCheckinStaff(): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (!CHECKIN_ROLES.includes(session.staff.role)) {
    throw new ApiError(403, "Insufficient permissions", "FORBIDDEN");
  }
  return session;
}

export async function requireManagementStaff(): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (!MANAGEMENT_ROLES.includes(session.staff.role)) {
    throw new ApiError(403, "Insufficient permissions", "FORBIDDEN");
  }
  return session;
}

export async function requireAdminStaff(): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (session.staff.role !== "ADMIN") {
    throw new ApiError(403, "Insufficient permissions", "FORBIDDEN");
  }
  return session;
}

export async function requireSyncAuth(
  request: Request
): Promise<StaffSession | "cron"> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return "cron";
  }
  return requireManagementStaff();
}
