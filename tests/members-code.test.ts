import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatMemberCode, parseMemberCode } from "@/lib/members/code";

describe("Member Code Formatting & Parsing", () => {
  describe("formatMemberCode", () => {
    it("pads numbers below 10000 with leading zeroes to 4 digits", () => {
      assert.equal(formatMemberCode(1), "GYM-0001");
      assert.equal(formatMemberCode(42), "GYM-0042");
      assert.equal(formatMemberCode(999), "GYM-0999");
      assert.equal(formatMemberCode(9999), "GYM-9999");
    });

    it("formats numbers 10000 and above without trimming", () => {
      assert.equal(formatMemberCode(10000), "GYM-10000");
      assert.equal(formatMemberCode(123456), "GYM-123456");
    });
  });

  describe("parseMemberCode", () => {
    it("parses valid GYM- prefixed codes case-insensitively", () => {
      assert.equal(parseMemberCode("GYM-0042"), 42);
      assert.equal(parseMemberCode("gym-0042"), 42);
      assert.equal(parseMemberCode("Gym-1"), 1);
      assert.equal(parseMemberCode("  GYM-0999  "), 999);
    });

    it("parses legacy BST- prefixed codes", () => {
      assert.equal(parseMemberCode("BST-101"), 101);
      assert.equal(parseMemberCode("bst-0005"), 5);
    });

    it("parses short raw numbers up to 6 digits as member numbers", () => {
      assert.equal(parseMemberCode("42"), 42);
      assert.equal(parseMemberCode("1"), 1);
      assert.equal(parseMemberCode("999999"), 999999);
    });

    it("does NOT treat 10-digit phone numbers as member codes (prevents integer overflow and search bug)", () => {
      assert.equal(parseMemberCode("9876543210"), null);
      assert.equal(parseMemberCode("9123456780"), null);
      assert.equal(parseMemberCode("+919876543210"), null);
    });

    it("rejects numbers exceeding 32-bit signed integer maximum (2147483647)", () => {
      assert.equal(parseMemberCode("GYM-9999999999"), null);
      assert.equal(parseMemberCode("GYM-2147483648"), null);
      assert.equal(parseMemberCode("GYM-2147483647"), 2147483647);
    });

    it("returns null for non-numeric, zero, negative, or invalid inputs", () => {
      assert.equal(parseMemberCode(""), null);
      assert.equal(parseMemberCode("   "), null);
      assert.equal(parseMemberCode("GYM-"), null);
      assert.equal(parseMemberCode("GYM-abc"), null);
      assert.equal(parseMemberCode("GYM-0"), null);
      assert.equal(parseMemberCode("0"), null);
      assert.equal(parseMemberCode("-5"), null);
      // @ts-expect-error test invalid type handling
      assert.equal(parseMemberCode(null), null);
    });
  });
});
