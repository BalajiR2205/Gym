import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeExpiryDate, PLAN_DURATIONS } from "@/lib/members/plan";

describe("Plan Durations & Expiry Calculation", () => {
  it("defines correct durations for all membership plans", () => {
    assert.equal(PLAN_DURATIONS.MONTHLY, 1);
    assert.equal(PLAN_DURATIONS.QUARTERLY, 3);
    assert.equal(PLAN_DURATIONS.SEMI_ANNUAL, 6);
    assert.equal(PLAN_DURATIONS.ANNUAL, 12);
  });

  describe("computeExpiryDate standard durations", () => {
    it("adds 1 month for MONTHLY plan", () => {
      const start = new Date("2026-03-15T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-04-15");
    });

    it("adds 3 months for QUARTERLY plan", () => {
      const start = new Date("2026-03-15T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "QUARTERLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-06-15");
    });

    it("adds 6 months for SEMI_ANNUAL plan", () => {
      const start = new Date("2026-03-15T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "SEMI_ANNUAL");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-09-15");
    });

    it("adds 12 months for ANNUAL plan", () => {
      const start = new Date("2026-03-15T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "ANNUAL");
      assert.equal(expiry.toISOString().slice(0, 10), "2027-03-15");
    });
  });

  describe("computeExpiryDate month-end edge cases", () => {
    it("clamps to Feb 28 when starting Jan 31 in a non-leap year", () => {
      const start = new Date("2026-01-31T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-02-28");
    });

    it("clamps to Feb 29 when starting Jan 31 in a leap year", () => {
      const start = new Date("2024-01-31T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2024-02-29");
    });

    it("clamps to Apr 30 when starting Mar 31", () => {
      const start = new Date("2026-03-31T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-04-30");
    });

    it("clamps to Jun 30 when starting May 31", () => {
      const start = new Date("2026-05-31T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-06-30");
    });

    it("clamps to Sep 30 when starting Aug 31", () => {
      const start = new Date("2026-08-31T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "MONTHLY");
      assert.equal(expiry.toISOString().slice(0, 10), "2026-09-30");
    });

    it("handles annual renewal from Feb 29 of leap year to Feb 28", () => {
      const start = new Date("2024-02-29T00:00:00.000Z");
      const expiry = computeExpiryDate(start, "ANNUAL");
      assert.equal(expiry.toISOString().slice(0, 10), "2025-02-28");
    });
  });

  describe("computeExpiryDate error handling", () => {
    it("throws error for invalid plan", () => {
      // @ts-expect-error testing invalid plan argument
      assert.throws(() => computeExpiryDate(new Date(), "WEEKLY"), /Unknown plan/);
    });

    it("throws error for invalid date", () => {
      assert.throws(() => computeExpiryDate(new Date("invalid"), "MONTHLY"), /Invalid joinedAt date/);
    });
  });
});
