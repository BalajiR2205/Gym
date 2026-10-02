"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StaffRole } from "@/app/generated/prisma/client";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <header className="border-b border-borderGold bg-primarySurface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/members" className="font-display text-xl text-gold">
            &lt;GYM NAME&gt; Admin
          </Link>
          <nav className="flex flex-wrap gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-gold/15 text-gold"
                    : "text-textSecondary hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-textSecondary">{staffName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-textSecondary hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
