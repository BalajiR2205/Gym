"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { SITE_NAME } from "@/data/siteContent";
import type { StaffRole } from "@/app/generated/prisma/client";

const navItems = [
  { href: "/admin/members", label: "Members", roles: ["ADMIN", "FRONT_DESK"] },
  {
    href: "/admin/attendance",
    label: "Attendance",
    roles: ["ADMIN", "FRONT_DESK"],
  },
  {
    href: "/admin/scanner",
    label: "Scanner",
    roles: ["ADMIN", "FRONT_DESK", "TRAINER"],
  },
  {
    href: "/admin/entrance-display",
    label: "Entrance QR",
    roles: ["ADMIN", "FRONT_DESK", "TRAINER"],
  },
  {
    href: "/admin/staff",
    label: "Staff",
    roles: ["ADMIN"],
  },
];

export default function AdminNav({
  staffName,
  role,
}: {
  staffName: string;
  role: StaffRole;
}) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  async function handleLogout() {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
    } catch {
      // Fallback
    }
    window.location.href = "/login/admin";
  }

  return (
    <header className="border-b border-[#171717]/8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/admin/members"
            className="flex items-center gap-2.5 text-[#171717] group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-tight leading-none text-[#171717]">
                {SITE_NAME}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#5F5F5A] font-bold uppercase leading-none mt-1">
                Admin Console
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-1.5">
            {visibleItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#171717] text-white shadow-sm"
                      : "text-[#5F5F5A] hover:text-[#171717] hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8F6F2] border border-[#171717]/10 text-[#171717] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{staffName}</span>
            <span className="text-[10px] text-[#5F5F5A] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5">
              {role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#5F5F5A] hover:text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
