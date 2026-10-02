import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parsePlan,
  parseStatus,
  serializeMember,
  serializePlan,
  serializeStatus,
} from "@/lib/api/serialize";

describe("API Serialization & Parsing", () => {
  describe("parsePlan & serializePlan", () => {
    it("parses valid plans case-insensitively", () => {
      assert.equal(parsePlan("monthly"), "MONTHLY");
      assert.equal(parsePlan("MONTHLY"), "MONTHLY");
      assert.equal(parsePlan("quarterly"), "QUARTERLY");
      assert.equal(parsePlan("semi_annual"), "SEMI_ANNUAL");
      assert.equal(parsePlan("annual"), "ANNUAL");
    });

    it("throws on unknown plans", () => {
      assert.throws(() => parsePlan("weekly"), /Invalid plan: weekly/);
      assert.throws(() => parsePlan(""), /Invalid plan: /);
    });

    it("serializes plans to lowercase strings", () => {
      assert.equal(serializePlan("MONTHLY"), "monthly");
      assert.equal(serializePlan("QUARTERLY"), "quarterly");
      assert.equal(serializePlan("SEMI_ANNUAL"), "semi_annual");
      assert.equal(serializePlan("ANNUAL"), "annual");
    });
  });

  describe("parseStatus & serializeStatus", () => {
    it("parses valid statuses case-insensitively", () => {
      assert.equal(parseStatus("active"), "ACTIVE");
      assert.equal(parseStatus("ACTIVE"), "ACTIVE");
      assert.equal(parseStatus("expired"), "EXPIRED");
      assert.equal(parseStatus("frozen"), "FROZEN");
    });

    it("throws on unknown statuses", () => {
      assert.throws(() => parseStatus("cancelled"), /Invalid status: cancelled/);
    });

    it("serializes statuses to lowercase strings", () => {
      assert.equal(serializeStatus("ACTIVE"), "active");
      assert.equal(serializeStatus("EXPIRED"), "expired");
      assert.equal(serializeStatus("FROZEN"), "frozen");
    });
  });

  describe("serializeMember", () => {
    it("formats member attributes properly and computes full_name and member_code", () => {
      const mockMember = {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        first_name: "Bruce",
        last_name: "Wayne",
        phone: "9876543210",
        email: "bruce@waynecorp.com",
        photo_url: "https://example.com/bruce.jpg",
        plan: "ANNUAL" as const,
        joined_at: new Date("2026-01-01T00:00:00.000Z"),
        expires_at: new Date("2027-01-01T00:00:00.000Z"),
        date_of_birth: new Date("1985-04-17T00:00:00.000Z"),
        member_number: 7,
        status: "ACTIVE" as const,
        auth_user_id: null,
        created_at: new Date("2026-01-01T10:00:00.000Z"),
        updated_at: new Date("2026-01-01T10:00:00.000Z"),
      };

      const serialized = serializeMember(mockMember);

      assert.equal(serialized.id, mockMember.id);
      assert.equal(serialized.first_name, "Bruce");
      assert.equal(serialized.last_name, "Wayne");
      assert.equal(serialized.full_name, "Bruce Wayne");
      assert.equal(serialized.phone, "9876543210");
      assert.equal(serialized.email, "bruce@waynecorp.com");
      assert.equal(serialized.plan, "annual");
      assert.equal(serialized.joined_at, "2026-01-01");
      assert.equal(serialized.expires_at, "2027-01-01");
      assert.equal(serialized.date_of_birth, "1985-04-17");
      assert.equal(serialized.member_number, 7);
      assert.equal(serialized.member_code, "GYM-0007");
      assert.equal(serialized.status, "active");
    });

    it("handles single-word first name with empty last name without extra space", () => {
      const mockMember = {
        id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        first_name: "Cher",
        last_name: "",
        phone: "9123456780",
        email: null,
        photo_url: null,
        plan: "MONTHLY" as const,
        joined_at: new Date("2026-02-01T00:00:00.000Z"),
        expires_at: new Date("2026-03-01T00:00:00.000Z"),
        date_of_birth: null,
        member_number: 42,
        status: "ACTIVE" as const,
        auth_user_id: null,
        created_at: new Date("2026-02-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-01T00:00:00.000Z"),
      };

      const serialized = serializeMember(mockMember);
      assert.equal(serialized.first_name, "Cher");
      assert.equal(serialized.last_name, "");
      assert.equal(serialized.full_name, "Cher");
      assert.equal(serialized.member_code, "GYM-0042");
      assert.equal(serialized.date_of_birth, null);
    });
  });
});
