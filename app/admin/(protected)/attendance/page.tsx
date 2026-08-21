import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import { MANAGEMENT_ROLES } from "@/lib/auth/roles";
import AttendancePageClient from "./AttendancePageClient";

export default async function AttendancePage() {
  const session = await getStaffSession();
  if (!session || !MANAGEMENT_ROLES.includes(session.staff.role)) {
    redirect("/admin/scanner");
  }

  return <AttendancePageClient />;
}
