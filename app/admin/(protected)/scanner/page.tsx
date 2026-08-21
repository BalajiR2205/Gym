import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import ScannerPageClient from "./ScannerPageClient";

export default async function ScannerPage() {
  const session = await getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <ScannerPageClient />;
}