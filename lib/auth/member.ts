import { prisma } from "@/lib/prisma";
import {
  generateOtp,
  hashOtp,
  generateSessionToken,
  hashToken,
  timingSafeMatch,
  maskEmail,
} from "@/lib/auth/crypto";
import {
  OTP_TTL_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  MEMBER_SESSION_TTL_MS,
  RATE_LIMIT_OTP_SEND,
  RATE_LIMIT_OTP_VERIFY,
} from "@/lib/auth/constants";
import { checkRateLimit, recordRateLimitAttempt } from "@/lib/auth/rateLimit";
import { sendOtpEmail } from "@/lib/auth/email";
import { findMemberByIdentifier } from "@/lib/members/lookup";
import type { Member, MemberSession } from "@/app/generated/prisma/client";

export const GENERIC_OTP_SENT_MESSAGE =
  "If the account is eligible, an OTP has been sent to the registered email.";

/**
 * Handles requesting a login OTP for a gym member.
 * Enforces privacy (no member existence enumeration) and 60s cooldown.
 */
export async function requestMemberOtp(
  identifier: string,
  ip = "127.0.0.1"
): Promise<{
  success: boolean;
  message: string;
  maskedEmail?: string;
  cooldownSeconds?: number;
  error?: string;
  status?: number;
}> {
  if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
    return {
      success: false,
      error: "Please enter your Member ID or registered phone number.",
      status: 400,
      message: "",
    };
  }

  // 1. Rate limiting per IP and identifier
  const ipRateLimit = await checkRateLimit(
    `otp_send_ip:${ip}`,
    RATE_LIMIT_OTP_SEND.maxAttempts,
    RATE_LIMIT_OTP_SEND.windowMs
  );

  if (!ipRateLimit.allowed) {
    return {
      success: false,
      error: "Too many OTP requests. Please wait a few minutes before trying again.",
      status: 429,
      message: "",
    };
  }

  await recordRateLimitAttempt(`otp_send_ip:${ip}`);

  // 2. Member lookup
  const member = await findMemberByIdentifier(identifier.trim());

  // Privacy protection: If member is not found or has no email address,
  // return the generic success response to prevent member enumeration!
  if (!member || !member.email || !member.email.includes("@")) {
    return {
      success: true,
      message: GENERIC_OTP_SENT_MESSAGE,
    };
  }

  // 3. Enforce 60-second resend cooldown for this member
  const recentOtp = await prisma.loginOtp.findFirst({
    where: {
      member_id: member.id,
      created_at: {
        gte: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS),
      },
    },
    orderBy: { created_at: "desc" },
  });

  if (recentOtp) {
    const elapsedMs = Date.now() - recentOtp.created_at.getTime();
    const remainingSeconds = Math.max(1, Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsedMs) / 1000));
    return {
      success: false,
      error: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
      cooldownSeconds: remainingSeconds,
      status: 429,
      message: "",
    };
  }

  // 4. Generate cryptographically secure OTP
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  // 5. Invalidate previous unused active OTPs for this member
  await prisma.loginOtp.updateMany({
    where: {
      member_id: member.id,
      used_at: null,
      expires_at: { gt: now },
    },
    data: {
      used_at: now,
    },
  }).catch(() => {});

  // 6. Save new OTP hash in DB
  const otpRecord = await prisma.loginOtp.create({
    data: {
      member_id: member.id,
      otp_hash: otpHash,
      purpose: "MEMBER_LOGIN",
      expires_at: expiresAt,
      max_attempts: OTP_MAX_ATTEMPTS,
      attempt_count: 0,
      last_sent_at: now,
    },
  });

  // 7. Dispatch Email
  const sendResult = await sendOtpEmail(member.email, otp, member.first_name);

  if (!sendResult.success) {
    // If email delivery fails, remove the created OTP record so user can retry immediately
    await prisma.loginOtp.delete({ where: { id: otpRecord.id } }).catch(() => {});
    return {
      success: false,
      error: sendResult.error || "We couldn't send the verification code. Please try again.",
      status: 500,
      message: "",
    };
  }

  return {
    success: true,
    message: GENERIC_OTP_SENT_MESSAGE,
    maskedEmail: maskEmail(member.email),
    cooldownSeconds: 60,
  };
}

/**
 * Handles verifying a member's submitted OTP.
 */
export async function verifyMemberOtp(
  identifier: string,
  otp: string,
  ip = "127.0.0.1"
): Promise<{
  success: boolean;
  member?: Member;
  token?: string;
  error?: string;
  status?: number;
}> {
  if (!identifier || !otp) {
    return {
      success: false,
      error: "Member ID and verification code are required.",
      status: 400,
    };
  }

  // 1. Rate limiting on verification attempts
  const verifyRateLimit = await checkRateLimit(
    `otp_verify_ip:${ip}`,
    RATE_LIMIT_OTP_VERIFY.maxAttempts,
    RATE_LIMIT_OTP_VERIFY.windowMs
  );

  if (!verifyRateLimit.allowed) {
    return {
      success: false,
      error: "Too many failed attempts. Please wait 15 minutes before trying again.",
      status: 429,
    };
  }

  // 2. Member lookup
  const member = await findMemberByIdentifier(identifier.trim());
  if (!member) {
    await recordRateLimitAttempt(`otp_verify_ip:${ip}`);
    return {
      success: false,
      error: "Invalid verification code or Member ID.",
      status: 401,
    };
  }

  // 3. Find active unexpired OTP
  const now = new Date();
  const otpRecord = await prisma.loginOtp.findFirst({
    where: {
      member_id: member.id,
      used_at: null,
      expires_at: { gt: now },
    },
    orderBy: { created_at: "desc" },
  });

  if (!otpRecord) {
    await recordRateLimitAttempt(`otp_verify_ip:${ip}`);
    return {
      success: false,
      error: "Verification code has expired or was not requested. Please request a new code.",
      status: 401,
    };
  }

  // 4. Check maximum attempts
  if (otpRecord.attempt_count >= otpRecord.max_attempts) {
    await prisma.loginOtp.update({
      where: { id: otpRecord.id },
      data: { used_at: now },
    });
    return {
      success: false,
      error: "Maximum verification attempts exceeded. Please request a new code.",
      status: 401,
    };
  }

  // 5. Compare OTP hashes
  const inputHash = hashOtp(otp.trim());
  const isMatch = timingSafeMatch(inputHash, otpRecord.otp_hash);

  if (!isMatch) {
    await recordRateLimitAttempt(`otp_verify_ip:${ip}`);
    const nextAttempts = otpRecord.attempt_count + 1;
    await prisma.loginOtp.update({
      where: { id: otpRecord.id },
      data: {
        attempt_count: nextAttempts,
        used_at: nextAttempts >= otpRecord.max_attempts ? now : null,
      },
    });

    const remaining = Math.max(0, otpRecord.max_attempts - nextAttempts);
    if (remaining <= 0) {
      return {
        success: false,
        error: "Maximum attempts exceeded. Please request a new verification code.",
        status: 401,
      };
    }

    return {
      success: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      status: 401,
    };
  }

  // 6. OTP is valid! Mark as used
  await prisma.loginOtp.update({
    where: { id: otpRecord.id },
    data: { used_at: now },
  });

  // 7. Create MemberSession
  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashToken(sessionToken);
  const sessionExpiresAt = new Date(now.getTime() + MEMBER_SESSION_TTL_MS);

  // Clean up any old expired member sessions in the background
  cleanupExpiredMemberSessions().catch(() => {});

  await prisma.memberSession.create({
    data: {
      member_id: member.id,
      session_token_hash: sessionTokenHash,
      expires_at: sessionExpiresAt,
      last_used_at: now,
    },
  });

  return {
    success: true,
    member,
    token: sessionToken,
  };
}

/**
 * Retrieves and validates a MemberSession from raw token.
 */
export async function getMemberSessionFromToken(
  token: string | null | undefined
): Promise<{ session: MemberSession; member: Member } | null> {
  if (!token) return null;
  const sessionTokenHash = hashToken(token);

  try {
    const session = await prisma.memberSession.findUnique({
      where: { session_token_hash: sessionTokenHash },
      include: { member: true },
    });

    if (!session) return null;

    if (session.expires_at <= new Date()) {
      await prisma.memberSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    // Touch last_used_at if it's been more than 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (session.last_used_at < fifteenMinutesAgo) {
      await prisma.memberSession
        .update({
          where: { id: session.id },
          data: { last_used_at: new Date() },
        })
        .catch(() => {});
    }

    return {
      session,
      member: session.member,
    };
  } catch (err) {
    console.error("[getMemberSessionFromToken Error]:", err);
    return null;
  }
}

/**
 * Invalidates a MemberSession upon logout.
 */
export async function invalidateMemberSession(
  token: string | null | undefined
): Promise<void> {
  if (!token) return;
  const sessionTokenHash = hashToken(token);
  try {
    await prisma.memberSession.deleteMany({
      where: { session_token_hash: sessionTokenHash },
    });
  } catch (err) {
    console.error("[invalidateMemberSession Error]:", err);
  }
}

/**
 * Deletes all expired member sessions and old OTPs.
 */
export async function cleanupExpiredMemberSessions(): Promise<void> {
  const now = new Date();
  try {
    await prisma.memberSession.deleteMany({
      where: { expires_at: { lt: now } },
    });
    // Clean up OTPs older than 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.loginOtp.deleteMany({
      where: { created_at: { lt: oneDayAgo } },
    });
  } catch {
    // Ignore cleanup errors
  }
}
