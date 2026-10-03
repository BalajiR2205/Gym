import { prisma } from "@/lib/prisma";
import {
  generateSessionToken,
  hashToken,
  timingSafeMatch,
} from "@/lib/auth/crypto";
import { ADMIN_SESSION_TTL_MS } from "@/lib/auth/constants";
import type { AdminSession } from "@/app/generated/prisma/client";

/**
 * Validates admin credentials against server-side environment variables.
 * Note: These development/MVP credentials (master/master) MUST be changed before production.
 */
export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || "master";
  const expectedPass = process.env.ADMIN_PASSWORD || "master";

  const isUserValid = timingSafeMatch(username.trim(), expectedUser);
  const isPassValid = timingSafeMatch(password, expectedPass);

  return isUserValid && isPassValid;
}

/**
 * Creates a database-backed AdminSession.
 */
export async function createAdminSession(
  username: string
): Promise<{ token: string; session: AdminSession }> {
  const token = generateSessionToken();
  const sessionTokenHash = hashToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ADMIN_SESSION_TTL_MS);

  // Clean up any old expired admin sessions in the background
  cleanupExpiredAdminSessions().catch(() => {});

  const session = await prisma.adminSession.create({
    data: {
      username: username.trim(),
      role: "ADMIN",
      session_token_hash: sessionTokenHash,
      expires_at: expiresAt,
      last_used_at: now,
    },
  });

  return { token, session };
}

/**
 * Retrieves and validates an AdminSession from a raw token.
 */
export async function getAdminSessionFromToken(
  token: string | null | undefined
): Promise<AdminSession | null> {
  if (!token) return null;
  const sessionTokenHash = hashToken(token);

  try {
    const session = await prisma.adminSession.findUnique({
      where: { session_token_hash: sessionTokenHash },
    });

    if (!session) return null;

    if (session.expires_at <= new Date()) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    // Touch last_used_at if it's been more than 5 minutes since last update
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (session.last_used_at < fiveMinutesAgo) {
      await prisma.adminSession
        .update({
          where: { id: session.id },
          data: { last_used_at: new Date() },
        })
        .catch(() => {});
    }

    return session;
  } catch (err) {
    console.error("[getAdminSessionFromToken Error]:", err);
    return null;
  }
}

/**
 * Invalidates an AdminSession upon logout.
 */
export async function invalidateAdminSession(
  token: string | null | undefined
): Promise<void> {
  if (!token) return;
  const sessionTokenHash = hashToken(token);
  try {
    await prisma.adminSession.deleteMany({
      where: { session_token_hash: sessionTokenHash },
    });
  } catch (err) {
    console.error("[invalidateAdminSession Error]:", err);
  }
}

/**
 * Deletes all expired admin sessions.
 */
export async function cleanupExpiredAdminSessions(): Promise<void> {
  try {
    await prisma.adminSession.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });
  } catch {
    // Ignore cleanup errors
  }
}
