import crypto from "crypto";

const TOKEN_TTL_MS = 90_000;

export function generateRotatingTokenValue(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getTokenWindow(now = new Date()) {
  const windowStart = new Date(now);
  const expiresAt = new Date(now.getTime() + TOKEN_TTL_MS);
  return { windowStart, expiresAt };
}

export function getCheckinUrl(token: string): string {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  return `${origin.replace(/\/$/, "")}/checkin?token=${encodeURIComponent(token)}`;
}

export { TOKEN_TTL_MS };
