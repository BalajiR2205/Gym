import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generatePersonalQrSecret,
  isMembershipExpired,
  signPersonalQrPayload,
  verifyPersonalQrPayload,
} from "@/lib/checkin/validation";
import { getCheckinUrl, getTokenWindow, TOKEN_TTL_MS } from "@/lib/checkin/tokens";

describe("Check-in Validation & Token Helpers", () => {
  describe("Personal QR Signing & Verification", () => {
    it("generates a 64-character hex secret", () => {
      const secret = generatePersonalQrSecret();
      assert.equal(secret.length, 64);
      assert.match(secret, /^[0-9a-f]{64}$/);
    });

    it("signs and successfully decodes a member ID from personal QR payload", () => {
      const memberId = "3f82a170-8b09-4ce2-b2a6-90e66872957b";
      const secret = generatePersonalQrSecret();
      const payload = signPersonalQrPayload(memberId, secret);

      assert.ok(typeof payload === "string");
      assert.ok(payload.length > 0);

      const verifiedId = verifyPersonalQrPayload(payload);
      assert.equal(verifiedId, memberId);
    });

    it("throws an ApiError for malformed payload", () => {
      assert.throws(() => verifyPersonalQrPayload("not-valid-base64"), /Invalid QR code/);
      assert.throws(() => verifyPersonalQrPayload(Buffer.from("nodot").toString("base64url")), /Invalid QR code/);
    });
  });

  describe("isMembershipExpired", () => {
    it("returns true if member status is EXPIRED", () => {
      const member = {
        status: "EXPIRED" as const,
        expires_at: new Date(Date.now() + 86400000), // tomorrow
      };
      // @ts-expect-error partial member
      assert.equal(isMembershipExpired(member), true);
    });

    it("returns true if expires_at is before today", () => {
      const past = new Date();
      past.setDate(past.getDate() - 2);
      const member = {
        status: "ACTIVE" as const,
        expires_at: past,
      };
      // @ts-expect-error partial member
      assert.equal(isMembershipExpired(member), true);
    });

    it("returns false for active member with future expiry", () => {
      const future = new Date();
      future.setMonth(future.getMonth() + 1);
      const member = {
        status: "ACTIVE" as const,
        expires_at: future,
      };
      // @ts-expect-error partial member
      assert.equal(isMembershipExpired(member), false);
    });
  });

  describe("Rotating QR Tokens", () => {
    it("computes token window with 90s TTL", () => {
      const now = new Date("2026-03-01T12:00:00.000Z");
      const { windowStart, expiresAt } = getTokenWindow(now);

      assert.equal(windowStart.getTime(), now.getTime());
      assert.equal(expiresAt.getTime(), now.getTime() + TOKEN_TTL_MS);
      assert.equal(TOKEN_TTL_MS, 90_000);
    });

    it("formats a valid checkin URL", () => {
      const token = "abc123xyz";
      const url = getCheckinUrl(token);
      assert.ok(url.includes("/checkin?token=abc123xyz"));
    });
  });
});
