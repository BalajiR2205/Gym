import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { serializeMember } from "@/lib/api/serialize";
import { parseMemberCode } from "@/lib/members/code";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier =
      searchParams.get("identifier")?.trim() ||
      searchParams.get("phone")?.trim() ||
      searchParams.get("member_id")?.trim();
    const pin = searchParams.get("pin")?.trim();

    if (!identifier) {
      return NextResponse.json(
        { error: "Member ID, Phone, or Email is required" },
        { status: 400 }
      );
    }

    // Attempt lookup by Member Code first
    const parsedCode = parseMemberCode(identifier);
    let member: Awaited<ReturnType<typeof prisma.member.findFirst>> | null = null;

    if (parsedCode !== null) {
      member = await prisma.member.findUnique({
        where: { member_number: parsedCode },
      });
    }

    // Attempt lookup by Phone, ID (if UUID), or Email
    if (!member) {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          identifier
        );

      member = await prisma.member.findFirst({
        where: {
          OR: [
            ...(isUuid ? [{ id: identifier }] : []),
            { phone: identifier },
            { phone: { endsWith: identifier.slice(-10) } },
            { email: { equals: identifier, mode: "insensitive" as const } },
          ],
        },
      });
    }

    if (!member) {
      return NextResponse.json(
        { error: "No member found with this ID or phone number", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (pin) {
      const lastFour = member.phone.replace(/\D/g, "").slice(-4);
      if (pin !== lastFour) {
        return NextResponse.json(
          { error: "Invalid PIN", code: "INVALID_PIN" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ member: serializeMember(member) });
  } catch (error) {
    return errorResponse(error);
  }
}
