import { prisma } from "@/lib/prisma";
import { parseMemberCode } from "@/lib/members/code";
import type { Member } from "@/app/generated/prisma/client";

/**
 * Resolves a Member record by Member Code (e.g. GYM-0001), raw number, phone, email, or UUID.
 */
export async function findMemberByIdentifier(
  identifier: string
): Promise<Member | null> {
  if (!identifier || typeof identifier !== "string") return null;
  const searchKey = identifier.trim();
  if (!searchKey) return null;

  // 1. Check if it's a member code or short number
  const parsedCode = parseMemberCode(searchKey);
  if (parsedCode !== null) {
    const member = await prisma.member.findUnique({
      where: { member_number: parsedCode },
    });
    if (member) return member;
  }

  // 2. Check UUID format
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      searchKey
    );

  // 3. Fallback to phone (exact or last 10 digits) or email
  return prisma.member.findFirst({
    where: {
      OR: [
        ...(isUuid ? [{ id: searchKey }] : []),
        { phone: searchKey },
        { phone: { endsWith: searchKey.slice(-10) } },
        { email: { equals: searchKey, mode: "insensitive" as const } },
      ],
    },
  });
}
