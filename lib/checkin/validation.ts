import crypto from "crypto";
import type { Member } from "@/app/generated/prisma/client";
import { ApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

const COOLDOWN_HOURS = 4;

export function generatePersonalQrSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function signPersonalQrPayload(
  memberId: string,
  secret: string
): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(memberId)
    .digest("base64url");
  const payload = `${memberId}.${signature}`;
  return Buffer.from(payload).toString("base64url");
}

export function verifyPersonalQrPayload(qrPayload: string): string {
  let decoded: string;
  try {
    decoded = Buffer.from(qrPayload, "base64url").toString("utf8");
  } catch {
    throw new ApiError(400, "Invalid QR code", "INVALID_QR");
  }

  const dotIndex = decoded.indexOf(".");
  if (dotIndex === -1) {
    throw new ApiError(400, "Invalid QR code format", "INVALID_QR");
  }

  const memberId = decoded.slice(0, dotIndex);
  const signature = decoded.slice(dotIndex + 1);

  if (!memberId || !signature) {
    throw new ApiError(400, "Invalid QR code format", "INVALID_QR");
  }

  return memberId;
}

export async function verifyPersonalQrAndGetMember(
  qrPayload: string
): Promise<Member> {
  let decoded: string;
  try {
    decoded = Buffer.from(qrPayload, "base64url").toString("utf8");
  } catch {
    throw new ApiError(400, "Invalid QR code", "INVALID_QR");
  }

  const dotIndex = decoded.indexOf(".");
  if (dotIndex === -1) {
    throw new ApiError(400, "Invalid QR code format", "INVALID_QR");
  }

  const memberId = decoded.slice(0, dotIndex);
  const signature = decoded.slice(dotIndex + 1);

  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) {
    throw new ApiError(404, "Member not found", "MEMBER_NOT_FOUND");
  }

  const expected = crypto
    .createHmac("sha256", member.personal_qr_secret)
    .update(memberId)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    throw new ApiError(400, "Invalid QR signature", "INVALID_QR_SIGNATURE");
  }

  return member;
}

export function isMembershipExpired(member: Member): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expires = new Date(member.expires_at);
  expires.setHours(0, 0, 0, 0);
  return member.status === "EXPIRED" || expires < today;
}

export async function assertMemberCanCheckIn(member: Member): Promise<void> {
  if (member.status === "FROZEN") {
    throw new ApiError(
      403,
      "Membership is frozen. Please contact the front desk.",
      "MEMBERSHIP_FROZEN"
    );
  }

  if (isMembershipExpired(member)) {
    throw new ApiError(
      403,
      "Membership expired, please renew",
      "MEMBERSHIP_EXPIRED"
    );
  }

  const cooldownStart = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000);
  const recent = await prisma.attendance.findFirst({
    where: {
      member_id: member.id,
      checked_in_at: { gt: cooldownStart },
    },
    orderBy: { checked_in_at: "desc" },
  });

  if (recent) {
    throw new ApiError(
      409,
      `Already checked in within the last ${COOLDOWN_HOURS} hours`,
      "CHECKIN_COOLDOWN"
    );
  }
}

export { COOLDOWN_HOURS };
