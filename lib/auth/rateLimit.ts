import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetMs: number;
};

// In-memory fallback map in case database is unreachable
const memoryFallbackMap = new Map<string, number[]>();

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(now - windowMs);

  try {
    const attempts = await prisma.rateLimitAttempt.count({
      where: {
        key,
        created_at: { gte: windowStart },
      },
    });

    const allowed = attempts < maxAttempts;
    const remaining = Math.max(0, maxAttempts - attempts);

    return {
      allowed,
      remaining,
      resetMs: windowMs,
    };
  } catch {
    // In-memory fallback
    const timestamps = (memoryFallbackMap.get(key) || []).filter(
      (ts) => ts >= now - windowMs
    );
    memoryFallbackMap.set(key, timestamps);

    const allowed = timestamps.length < maxAttempts;
    const remaining = Math.max(0, maxAttempts - timestamps.length);

    return {
      allowed,
      remaining,
      resetMs: windowMs,
    };
  }
}

export async function recordRateLimitAttempt(key: string): Promise<void> {
  const now = Date.now();
  try {
    await prisma.rateLimitAttempt.create({
      data: { key },
    });
  } catch {
    // In-memory fallback
    const timestamps = memoryFallbackMap.get(key) || [];
    timestamps.push(now);
    memoryFallbackMap.set(key, timestamps);
  }
}

export async function clearRateLimit(key: string): Promise<void> {
  memoryFallbackMap.delete(key);
  try {
    await prisma.rateLimitAttempt.deleteMany({
      where: { key },
    });
  } catch {
    // Ignore cleanup errors
  }
}

export const resetRateLimit = clearRateLimit;

export async function clearAllRateLimitsForTesting(): Promise<void> {
  memoryFallbackMap.clear();
  try {
    await prisma.rateLimitAttempt.deleteMany({});
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Periodically purge rate limit records older than 24 hours.
 */
export async function cleanupExpiredRateLimits(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    await prisma.rateLimitAttempt.deleteMany({
      where: { created_at: { lt: cutoff } },
    });
  } catch {
    // Ignore cleanup errors
  }
}
