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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <AdminNav staffName={staffName} role={role} />
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
