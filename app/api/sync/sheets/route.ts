import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/errors";
import { requireSyncAuth } from "@/lib/auth/staff";
import { syncToGoogleSheets } from "@/lib/google/sheets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireSyncAuth(request);
    const result = await syncToGoogleSheets();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return errorResponse(error);
  }
}
