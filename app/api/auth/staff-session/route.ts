import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { getStaffSession } from "@/lib/auth/staff";
import { serializeStaffRole } from "@/lib/api/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getStaffSession();
    if (!session) {
      return NextResponse.json({ error: "Not staff" }, { status: 403 });
    }
    return NextResponse.json({
      staff: {
        id: session.staff.id,
        full_name: session.staff.full_name,
        role: serializeStaffRole(session.staff.role),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
