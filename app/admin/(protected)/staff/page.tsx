import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import StaffPageClient from "./StaffPageClient";

export default async function StaffPage() {
  const session = await getStaffSession();
  if (!session || session.staff.role !== "ADMIN") {
    redirect("/admin/members");
  }

  return <StaffPageClient />;
}
