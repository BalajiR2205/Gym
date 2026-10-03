import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  MEMBER_COOKIE_NAME,
  ADMIN_SESSION_TTL_MS,
  MEMBER_SESSION_TTL_MS,
} from "@/lib/auth/constants";
import { getAdminSessionFromToken, invalidateAdminSession } from "@/lib/auth/admin";
import { getMemberSessionFromToken, invalidateMemberSession } from "@/lib/auth/member";
import type { AdminSession, MemberSession, Member } from "@/app/generated/prisma/client";

/**
 * Sets an HttpOnly, secure authentication session cookie.
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });
}

/**
 * Sets an HttpOnly, secure member session cookie.
 */
export async function setMemberSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(MEMBER_SESSION_TTL_MS / 1000),
  });
}

/**
 * Clears the admin session cookie and deletes the database record.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    await invalidateAdminSession(token);
  }
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Clears the member session cookie and deletes the database record.
 */
export async function clearMemberSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  if (token) {
    await invalidateMemberSession(token);
  }
  cookieStore.delete(MEMBER_COOKIE_NAME);
}

/**
 * Retrieves the current authenticated AdminSession from cookies.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return getAdminSessionFromToken(token);
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated MemberSession and Member from cookies.
 */
export async function getMemberSession(): Promise<{
  session: MemberSession;
  member: Member;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
    return getMemberSessionFromToken(token);
  } catch {
    return null;
  }
}
