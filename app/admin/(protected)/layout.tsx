import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();

  if (!session) {
    redirect("/login/admin");
  }

  return (
    <AdminShell
      staffName={session.staff.full_name ?? "Staff"}
      role={session.staff.role}
    >
      {children}
    </AdminShell>
  );
}

