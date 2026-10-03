import crypto from "crypto";

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 * Uses crypto.randomInt (never Math.random).
 */
export function generateOtp(): string {
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

/**
 * Cryptographically hash an OTP using SHA-256 before database storage.
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Generate a cryptographically secure session token (256-bit entropy).
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Cryptographically hash a session token before storing in DB.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Constant-time string equality check to prevent timing attacks.
 */
export function timingSafeMatch(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Keep constant time by comparing bufA with itself, but return false
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Mask an email address to protect member privacy (e.g. "alex.rivera@example.com" -> "a***@example.com").
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return "";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "";
  return `${localPart[0]}***@${domain}`;
}
