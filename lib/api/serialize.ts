import type {
  CheckinMethod,
  MemberStatus,
  Plan,
  StaffRole,
} from "@/app/generated/prisma/client";

export function serializePlan(plan: Plan): string {
  return plan.toLowerCase();
}

export function serializeStatus(status: MemberStatus): string {
  return status.toLowerCase();
}

export function serializeMethod(method: CheckinMethod): string {
  return method.toLowerCase();
}

export function serializeStaffRole(role: StaffRole): string {
  return role.toLowerCase();
}

export function parsePlan(value: string): Plan {
  const map: Record<string, Plan> = {
    monthly: "MONTHLY",
    quarterly: "QUARTERLY",
    annual: "ANNUAL",
  };
  const plan = map[value.toLowerCase()];
  if (!plan) throw new Error(`Invalid plan: ${value}`);
  return plan;
}

export function parseStatus(value: string): MemberStatus {
  const map: Record<string, MemberStatus> = {
    active: "ACTIVE",
    expired: "EXPIRED",
    frozen: "FROZEN",
  };
  const status = map[value.toLowerCase()];
  if (!status) throw new Error(`Invalid status: ${value}`);
  return status;
}

export function serializeMember(member: {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  photo_url: string | null;
  plan: Plan;
  joined_at: Date;
  expires_at: Date;
  status: MemberStatus;
  auth_user_id: string | null;
  created_at: Date;
  updated_at: Date;
}) {
  return {
    id: member.id,
    full_name: member.full_name,
    phone: member.phone,
    email: member.email,
    photo_url: member.photo_url,
    plan: serializePlan(member.plan),
    joined_at: member.joined_at.toISOString().slice(0, 10),
    expires_at: member.expires_at.toISOString().slice(0, 10),
    status: serializeStatus(member.status),
    auth_user_id: member.auth_user_id,
    created_at: member.created_at.toISOString(),
    updated_at: member.updated_at.toISOString(),
  };
}
