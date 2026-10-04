"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import type { StaffRole } from "@/app/generated/prisma/client";

export default function AdminShell({
  staffName,
  role,
  children,
}: {
  staffName: string;
  role: StaffRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullscreen = pathname.startsWith("/admin/entrance-display");

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717]">
      <AdminNav staffName={staffName} role={role} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
