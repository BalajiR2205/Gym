import type { Plan } from "@/app/generated/prisma/client";

export const PLAN_DURATIONS: Record<Plan, number> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  SEMI_ANNUAL: 6,
  ANNUAL: 12,
};

export function computeExpiryDate(joinedAt: Date, plan: Plan): Date {
  const months = PLAN_DURATIONS[plan];
  if (!months) {
    throw new Error(`Unknown plan: ${plan}`);
  }
  const result = new Date(joinedAt);
  if (isNaN(result.getTime())) {
    throw new Error("Invalid joinedAt date");
  }
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() < day) {
    result.setDate(0);
  }
  return result;
}

