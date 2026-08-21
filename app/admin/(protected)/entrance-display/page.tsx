import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import EntranceDisplayClient from "./EntranceDisplayClient";

export default async function EntranceDisplayPage() {
  const session = await getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <EntranceDisplayClient />;
}