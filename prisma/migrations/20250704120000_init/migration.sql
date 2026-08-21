-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'FROZEN');

-- CreateEnum
CREATE TYPE "CheckinMethod" AS ENUM ('SELF_SCAN', 'STAFF_SCAN');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'FRONT_DESK', 'TRAINER');

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "photo_url" TEXT,
    "plan" "Plan" NOT NULL,
    "joined_at" DATE NOT NULL,
    "expires_at" DATE NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "auth_user_id" UUID,
    "personal_qr_secret" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_user_id" UUID NOT NULL,
    "full_name" TEXT,
    "role" "StaffRole" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "checked_in_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "CheckinMethod" NOT NULL,
    "marked_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkin_tokens" (
    "token" TEXT NOT NULL,
    "window_start" TIMESTAMPTZ NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_by_member_ids" UUID[] DEFAULT ARRAY[]::UUID[],

    CONSTRAINT "checkin_tokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "sync_state" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "last_synced_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- CreateIndex
CREATE INDEX "members_phone_idx" ON "members"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "staff_auth_user_id_key" ON "staff"("auth_user_id");

-- CreateIndex
CREATE INDEX "attendance_member_id_idx" ON "attendance"("member_id");

-- CreateIndex
CREATE INDEX "attendance_checked_in_at_idx" ON "attendance"("checked_in_at");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed sync state row
INSERT INTO "sync_state" ("id", "last_synced_at") VALUES ('default', '1970-01-01T00:00:00Z');
