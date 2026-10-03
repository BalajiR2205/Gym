import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/lib/prisma";
import {
  validateAdminCredentials,
  createAdminSession,
  getAdminSessionFromToken,
  invalidateAdminSession,
} from "@/lib/auth/admin";
import {
  requestMemberOtp,
  verifyMemberOtp,
  getMemberSessionFromToken,
  invalidateMemberSession,
} from "@/lib/auth/member";
import {
  generateOtp,
  hashOtp,
  generateSessionToken,
  hashToken,
  timingSafeMatch,
  maskEmail,
} from "@/lib/auth/crypto";
import { findMemberByIdentifier } from "@/lib/members/lookup";
import { setEmailSenderForTesting } from "@/lib/auth/email";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
  clearAllRateLimitsForTesting,
} from "@/lib/auth/rateLimit";
import {
  GENERIC_OTP_SENT_MESSAGE,
  OTP_MAX_ATTEMPTS,
} from "@/lib/auth/constants";

describe("Authentication System — User + Admin Login", () => {
  let testMemberId: string;
  let testMemberCode: string;
  const testEmail = "auth.tester@example.com";
  const testPhone = "9988776655";
  let capturedOtp = "";

  before(async () => {
    // Intercept emails for testing
    setEmailSenderForTesting(async (_to, otp) => {
      capturedOtp = otp;
      return true;
    });

    // Ensure a designated test member exists in DB
    const existing = await prisma.member.findFirst({
      where: { email: testEmail },
    });

    if (existing) {
      testMemberId = existing.id;
      testMemberCode = `GYM-${String(existing.member_number).padStart(4, "0")}`;
    } else {
      const created = await prisma.member.create({
        data: {
          first_name: "Auth",
          last_name: "Tester",
          email: testEmail,
          phone: testPhone,
          plan: "ANNUAL",
          status: "ACTIVE",
          joined_at: new Date(),
          expires_at: new Date(Date.now() + 365 * 86400000),
          personal_qr_secret: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        },
      });
      testMemberId = created.id;
      testMemberCode = `GYM-${String(created.member_number).padStart(4, "0")}`;
    }
  });

  after(async () => {
    // Clean up test data created during runs
    setEmailSenderForTesting(null);
    try {
      await prisma.loginOtp.deleteMany({ where: { member_id: testMemberId } });
      await prisma.memberSession.deleteMany({ where: { member_id: testMemberId } });
      await prisma.rateLimitAttempt.deleteMany({
        where: { key: { startsWith: "test-" } },
      });
      await prisma.$disconnect();
    } catch {
      // Best effort cleanup
    }
  });

  beforeEach(async () => {
    capturedOtp = "";
    // Clean OTPs for test member before each OTP-specific test
    await prisma.loginOtp.deleteMany({ where: { member_id: testMemberId } });
    await clearAllRateLimitsForTesting();
  });

  // --------------------------------------------------------------------------
  // 1. Admin credentials validation
  // --------------------------------------------------------------------------
  describe("1. Admin credentials validation", () => {
    it("validates configured admin credentials (master / master)", () => {
      const isValid = validateAdminCredentials("master", "master");
      assert.equal(isValid, true);
    });

    it("validates when environment credentials match", () => {
      const origUser = process.env.ADMIN_USERNAME;
      const origPass = process.env.ADMIN_PASSWORD;
      try {
        process.env.ADMIN_USERNAME = "custom_admin";
        process.env.ADMIN_PASSWORD = "custom_super_secret_password";
        assert.equal(
          validateAdminCredentials("custom_admin", "custom_super_secret_password"),
          true
        );
      } finally {
        process.env.ADMIN_USERNAME = origUser;
        process.env.ADMIN_PASSWORD = origPass;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Invalid admin credentials
  // --------------------------------------------------------------------------
  describe("2. Invalid admin credentials", () => {
    it("rejects wrong password", () => {
      assert.equal(validateAdminCredentials("master", "wrong_password"), false);
    });

    it("rejects wrong username", () => {
      assert.equal(validateAdminCredentials("intruder", "master"), false);
    });

    it("rejects empty credentials", () => {
      assert.equal(validateAdminCredentials("", ""), false);
      assert.equal(validateAdminCredentials("master", ""), false);
      assert.equal(validateAdminCredentials("", "master"), false);
    });

    it("is case-sensitive", () => {
      assert.equal(validateAdminCredentials("Master", "master"), false);
      assert.equal(validateAdminCredentials("master", "Master"), false);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Member lookup
  // --------------------------------------------------------------------------
  describe("3. Member lookup", () => {
    it("finds member by formatted member code (e.g. GYM-0001)", async () => {
      const found = await findMemberByIdentifier(testMemberCode);
      assert.ok(found);
      assert.equal(found.id, testMemberId);
    });

    it("finds member by raw numeric member number", async () => {
      const numOnly = testMemberCode.replace(/\D/g, "").replace(/^0+/, "") || "1";
      const found = await findMemberByIdentifier(numOnly);
      assert.ok(found);
      assert.equal(found.id, testMemberId);
    });

    it("finds member by registered phone number", async () => {
      const found = await findMemberByIdentifier(testPhone);
      assert.ok(found);
      assert.equal(found.id, testMemberId);
    });

    it("finds member by registered email address", async () => {
      const found = await findMemberByIdentifier(testEmail);
      assert.ok(found);
      assert.equal(found.id, testMemberId);
    });

    it("returns null for non-existent member identifier", async () => {
      const found = await findMemberByIdentifier("GYM-999999");
      assert.equal(found, null);
    });

    it("masks email properly without leaking full address", () => {
      assert.equal(maskEmail("alex.rivera@example.com"), "a***@example.com");
      assert.equal(maskEmail("john@gmail.com"), "j***@gmail.com");
    });
  });

  // --------------------------------------------------------------------------
  // 4. OTP generation
  // --------------------------------------------------------------------------
  describe("4. OTP generation", () => {
    it("generates a 6-digit numeric OTP", () => {
      const otp = generateOtp();
      assert.equal(otp.length, 6);
      assert.match(otp, /^\d{6}$/);
      const num = parseInt(otp, 10);
      assert.ok(num >= 100000 && num <= 999999);
    });

    it("generates non-repeating cryptographically random codes", () => {
      const set = new Set<string>();
      for (let i = 0; i < 20; i++) {
        set.add(generateOtp());
      }
      assert.ok(set.size >= 19);
    });
  });

  // --------------------------------------------------------------------------
  // 5. OTP hashing
  // --------------------------------------------------------------------------
  describe("5. OTP hashing", () => {
    it("hashes OTP into a 64-character sha256 hex string", () => {
      const hash = hashOtp("482913");
      assert.equal(hash.length, 64);
      assert.match(hash, /^[0-9a-f]{64}$/);
    });

    it("produces deterministic hash for same OTP", () => {
      const hash1 = hashOtp("482913");
      const hash2 = hashOtp("482913");
      assert.equal(hash1, hash2);
      assert.equal(timingSafeMatch(hash1, hash2), true);
    });

    it("produces different hash for different OTP", () => {
      const hash1 = hashOtp("482913");
      const hash2 = hashOtp("482914");
      assert.notEqual(hash1, hash2);
      assert.equal(timingSafeMatch(hash1, hash2), false);
    });
  });

  // --------------------------------------------------------------------------
  // 6. OTP expiration
  // --------------------------------------------------------------------------
  describe("6. OTP expiration", () => {
    it("rejects an expired OTP", async () => {
      const otpCode = "555111";
      const otpHash = hashOtp(otpCode);

      // Create an expired OTP directly in DB
      await prisma.loginOtp.create({
        data: {
          member_id: testMemberId,
          otp_hash: otpHash,
          purpose: "MEMBER_LOGIN",
          expires_at: new Date(Date.now() - 1000), // expired 1s ago
          attempt_count: 0,
          max_attempts: OTP_MAX_ATTEMPTS,
        },
      });

      const result = await verifyMemberOtp(testMemberCode, otpCode, "127.0.0.1");
      assert.equal(result.success, false);
      assert.match(result.error || "", /expired/i);
    });
  });

  // --------------------------------------------------------------------------
  // 7. OTP verification
  // --------------------------------------------------------------------------
  describe("7. OTP verification", () => {
    it("verifies a valid OTP and returns a member session token", async () => {
      const reqRes = await requestMemberOtp(testMemberCode, "127.0.0.1");
      assert.equal(reqRes.success, true);
      assert.ok(capturedOtp.length === 6);

      const verifyRes = await verifyMemberOtp(testMemberCode, capturedOtp, "127.0.0.1");
      assert.equal(verifyRes.success, true);
      assert.ok(verifyRes.token);
      assert.ok(verifyRes.member);
      assert.equal(verifyRes.member.id, testMemberId);
    });

    it("preserves privacy on non-existent member request", async () => {
      const reqRes = await requestMemberOtp("GYM-999999", "127.0.0.1");
      // Must return success with generic message to avoid member enumeration
      assert.equal(reqRes.success, true);
      assert.equal(reqRes.message, GENERIC_OTP_SENT_MESSAGE);
      assert.equal(capturedOtp, ""); // No email actually sent
    });
  });

  // --------------------------------------------------------------------------
  // 8. Invalid OTP
  // --------------------------------------------------------------------------
  describe("8. Invalid OTP", () => {
    it("rejects an incorrect OTP code and increments attempt_count", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      assert.ok(capturedOtp.length === 6);

      const wrongCode = capturedOtp === "111111" ? "222222" : "111111";
      const verifyRes = await verifyMemberOtp(testMemberCode, wrongCode, "127.0.0.1");

      assert.equal(verifyRes.success, false);
      assert.match(verifyRes.error || "", /invalid/i);

      // Verify DB attempt count was incremented
      const otpRecord = await prisma.loginOtp.findFirst({
        where: { member_id: testMemberId, used_at: null },
      });
      assert.ok(otpRecord);
      assert.equal(otpRecord.attempt_count, 1);
    });
  });

  // --------------------------------------------------------------------------
  // 9. Used OTP rejection
  // --------------------------------------------------------------------------
  describe("9. Used OTP rejection", () => {
    it("rejects reusing an already used OTP", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      const code = capturedOtp;

      // First verification succeeds
      const firstVerify = await verifyMemberOtp(testMemberCode, code, "127.0.0.1");
      assert.equal(firstVerify.success, true);

      // Second verification of the exact same code MUST fail
      const secondVerify = await verifyMemberOtp(testMemberCode, code, "127.0.0.1");
      assert.equal(secondVerify.success, false);
      assert.match(secondVerify.error || "", /expired|invalid/i);
    });
  });

  // --------------------------------------------------------------------------
  // 10. Maximum attempt enforcement
  // --------------------------------------------------------------------------
  describe("10. Maximum attempt enforcement", () => {
    it("invalidates OTP after 5 failed attempts", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      const validCode = capturedOtp;
      const invalidCode = "000000";

      // Perform 5 failed attempts
      for (let i = 0; i < 5; i++) {
        const res = await verifyMemberOtp(testMemberCode, invalidCode, "127.0.0.1");
        assert.equal(res.success, false);
      }

      // Check DB record: attempt_count is now 5
      const record = await prisma.loginOtp.findFirst({
        where: { member_id: testMemberId },
        orderBy: { created_at: "desc" },
      });
      assert.ok(record);
      assert.ok(record.attempt_count >= 5);

      // Even providing the CORRECT code now must be rejected
      const attemptWithValidCode = await verifyMemberOtp(
        testMemberCode,
        validCode,
        "127.0.0.1"
      );
      assert.equal(attemptWithValidCode.success, false);
      assert.match(attemptWithValidCode.error || "", /maximum|expired/i);
    });
  });

  // --------------------------------------------------------------------------
  // 11. OTP resend cooldown
  // --------------------------------------------------------------------------
  describe("11. OTP resend cooldown", () => {
    it("enforces 60-second cooldown between OTP requests", async () => {
      const firstReq = await requestMemberOtp(testMemberCode, "127.0.0.1");
      assert.equal(firstReq.success, true);

      // Immediate second request must trigger cooldown
      const secondReq = await requestMemberOtp(testMemberCode, "127.0.0.1");
      assert.equal(secondReq.success, false);
      assert.ok((secondReq.cooldownSeconds || 0) > 0);
      assert.ok((secondReq.cooldownSeconds || 0) <= 60);
    });
  });

  // --------------------------------------------------------------------------
  // 12. Member session creation
  // --------------------------------------------------------------------------
  describe("12. Member session creation", () => {
    it("creates a database-backed member session with secure token and future expiry", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      const verifyRes = await verifyMemberOtp(testMemberCode, capturedOtp, "127.0.0.1");

      assert.equal(verifyRes.success, true);
      assert.ok(verifyRes.token);

      // Retrieve session using token
      const sessionData = await getMemberSessionFromToken(verifyRes.token);
      assert.ok(sessionData);
      assert.equal(sessionData.member.id, testMemberId);
      assert.equal(sessionData.member.email, testEmail);
      assert.ok(sessionData.session.expires_at > new Date());
    });
  });

  // --------------------------------------------------------------------------
  // 13. Admin session creation
  // --------------------------------------------------------------------------
  describe("13. Admin session creation", () => {
    it("creates a database-backed admin session with role ADMIN and future expiry", async () => {
      const { token, session } = await createAdminSession("master");
      assert.ok(token);
      assert.ok(session);
      assert.equal(session.role, "ADMIN");
      assert.ok(session.expires_at > new Date());

      // Lookup via session token
      const active = await getAdminSessionFromToken(token);
      assert.ok(active);
      assert.equal(active.id, session.id);
      assert.equal(active.role, "ADMIN");

      // Cleanup
      await invalidateAdminSession(token);
    });
  });

  // --------------------------------------------------------------------------
  // 14. Role separation
  // --------------------------------------------------------------------------
  describe("14. Role separation", () => {
    it("prevents admin session token from being treated as member session", async () => {
      const { token: adminToken } = await createAdminSession("master");
      const asMember = await getMemberSessionFromToken(adminToken);
      assert.equal(asMember, null);
      await invalidateAdminSession(adminToken);
    });

    it("prevents member session token from being treated as admin session", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      const { token: memberToken } = await verifyMemberOtp(
        testMemberCode,
        capturedOtp,
        "127.0.0.1"
      );
      assert.ok(memberToken);

      const asAdmin = await getAdminSessionFromToken(memberToken);
      assert.equal(asAdmin, null);
      await invalidateMemberSession(memberToken);
    });
  });

  // --------------------------------------------------------------------------
  // 15. Unauthorized admin route access
  // --------------------------------------------------------------------------
  describe("15. Unauthorized admin route access", () => {
    it("rejects unauthorized access when no token is present", async () => {
      const adminSession = await getAdminSessionFromToken(undefined);
      assert.equal(adminSession, null);
    });

    it("rejects access when token is invalid or forged", async () => {
      const adminSession = await getAdminSessionFromToken("forged-token-abc-123");
      assert.equal(adminSession, null);
    });
  });

  // --------------------------------------------------------------------------
  // 16. Unauthorized member route access
  // --------------------------------------------------------------------------
  describe("16. Unauthorized member route access", () => {
    it("rejects unauthorized access when no member token is present", async () => {
      const memberSession = await getMemberSessionFromToken(undefined);
      assert.equal(memberSession, null);
    });

    it("rejects access when member token is invalid or forged", async () => {
      const memberSession = await getMemberSessionFromToken("forged-token-xyz-789");
      assert.equal(memberSession, null);
    });
  });

  // --------------------------------------------------------------------------
  // 17. Logout
  // --------------------------------------------------------------------------
  describe("17. Logout", () => {
    it("invalidates admin session on logout so subsequent requests fail", async () => {
      const { token } = await createAdminSession("master");
      assert.ok(await getAdminSessionFromToken(token));

      await invalidateAdminSession(token);
      const afterLogout = await getAdminSessionFromToken(token);
      assert.equal(afterLogout, null);
    });

    it("invalidates member session on logout so subsequent requests fail", async () => {
      await requestMemberOtp(testMemberCode, "127.0.0.1");
      const { token } = await verifyMemberOtp(
        testMemberCode,
        capturedOtp,
        "127.0.0.1"
      );
      assert.ok(token);
      assert.ok(await getMemberSessionFromToken(token));

      await invalidateMemberSession(token);
      const afterLogout = await getMemberSessionFromToken(token);
      assert.equal(afterLogout, null);
    });
  });

  // --------------------------------------------------------------------------
  // 18. Rate limiting behavior
  // --------------------------------------------------------------------------
  describe("18. Rate limiting behavior", () => {
    const rateLimitKey = `test-rl-${Date.now()}`;

    after(async () => {
      await resetRateLimit(rateLimitKey);
    });

    it("permits requests within allowed limit and blocks when exceeded", async () => {
      const maxAttempts = 3;
      const windowMs = 60000;

      // 1st attempt: allowed
      const res1 = await checkRateLimit(rateLimitKey, maxAttempts, windowMs);
      assert.equal(res1.allowed, true);
      assert.equal(res1.remaining, 3);
      await recordRateLimitAttempt(rateLimitKey);

      // 2nd attempt: allowed
      const res2 = await checkRateLimit(rateLimitKey, maxAttempts, windowMs);
      assert.equal(res2.allowed, true);
      assert.equal(res2.remaining, 2);
      await recordRateLimitAttempt(rateLimitKey);

      // 3rd attempt: allowed
      const res3 = await checkRateLimit(rateLimitKey, maxAttempts, windowMs);
      assert.equal(res3.allowed, true);
      assert.equal(res3.remaining, 1);
      await recordRateLimitAttempt(rateLimitKey);

      // 4th attempt: BLOCKED (already 3 recorded attempts)
      const res4 = await checkRateLimit(rateLimitKey, maxAttempts, windowMs);
      assert.equal(res4.allowed, false);
      assert.equal(res4.remaining, 0);
    });

    it("resets rate limit cleanly", async () => {
      await resetRateLimit(rateLimitKey);
      const resAfterReset = await checkRateLimit(rateLimitKey, 3, 60000);
      assert.equal(resAfterReset.allowed, true);
      assert.equal(resAfterReset.remaining, 3);
    });
  });
});
