import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { serializeMember } from "@/lib/api/serialize";

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!email || !privateKey) {
    throw new Error("Google Sheets credentials are not configured");
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

async function ensureHeaders(
  sheets: ReturnType<typeof getSheetsClient>,
  spreadsheetId: string
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetTitles = meta.data.sheets?.map((s) => s.properties?.title) ?? [];

  if (!sheetTitles.includes("Members")) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Members" } } }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Members!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "id",
            "full_name",
            "phone",
            "email",
            "plan",
            "joined_at",
            "expires_at",
            "status",
            "updated_at",
          ],
        ],
      },
    });
  }

  if (!sheetTitles.includes("Attendance")) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Attendance" } } }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Attendance!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "id",
            "member_id",
            "member_name",
            "member_phone",
            "checked_in_at",
            "method",
            "marked_by",
          ],
        ],
      },
    });
  }
}

export async function syncToGoogleSheets() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured");
  }

  const sheets = getSheetsClient();
  await ensureHeaders(sheets, spreadsheetId);

  const syncState = await prisma.syncState.upsert({
    where: { id: "default" },
    create: { id: "default", last_synced_at: new Date(0) },
    update: {},
  });

  const since = syncState.last_synced_at;

  const [members, attendance] = await Promise.all([
    prisma.member.findMany({
      where: { updated_at: { gt: since } },
      orderBy: { updated_at: "asc" },
    }),
    prisma.attendance.findMany({
      where: { created_at: { gt: since } },
      include: { member: true, staff: true },
      orderBy: { created_at: "asc" },
    }),
  ]);

  if (members.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Members!A2",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: members.map((m) => {
          const s = serializeMember(m);
          return [
            s.id,
            s.full_name,
            s.phone,
            s.email ?? "",
            s.plan,
            s.joined_at,
            s.expires_at,
            s.status,
            s.updated_at,
          ];
        }),
      },
    });
  }

  if (attendance.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Attendance!A2",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: attendance.map((a) => [
          a.id,
          a.member_id,
          `${a.member.first_name}${a.member.last_name ? ` ${a.member.last_name}` : ""}`,
          a.member.phone,
          a.checked_in_at.toISOString(),
          a.method.toLowerCase(),
          a.staff?.full_name ?? "",
        ]),
      },
    });
  }

  const now = new Date();
  await prisma.syncState.update({
    where: { id: "default" },
    data: { last_synced_at: now },
  });

  return {
    synced_at: now.toISOString(),
    members_count: members.length,
    attendance_count: attendance.length,
  };
}

export async function appendAttendanceToGoogleSheets(entry: {
  id: string;
  member_id: string;
  member_name: string;
  member_phone: string;
  checked_in_at: Date;
  method: string;
  marked_by?: string;
}) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!spreadsheetId || !email || !privateKey) {
    console.warn(
      "[GoogleSheets] Credentials not fully configured. Attendance saved to database only."
    );
    return false;
  }

  try {
    const sheets = getSheetsClient();
    await ensureHeaders(sheets, spreadsheetId);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Attendance!A2",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            entry.id,
            entry.member_id,
            entry.member_name,
            entry.member_phone,
            entry.checked_in_at.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "medium",
            }),
            entry.method.toUpperCase(),
            entry.marked_by ?? "SELF_SCAN",
          ],
        ],
      },
    });

    return true;
  } catch (err) {
    console.error("[GoogleSheets] Failed to append attendance row:", err);
    return false;
  }
}

