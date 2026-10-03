import { redirect } from "next/navigation";
import Link from "next/link";
import { getMemberSession } from "@/lib/auth/session";
import { formatMemberCode } from "@/lib/members/code";
import { Dumbbell, Calendar, QrCode, LogOut, ShieldCheck, CheckCircle2, UserCheck } from "lucide-react";
import { SITE_NAME } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const sessionData = await getMemberSession();

  if (!sessionData) {
    redirect("/login/member");
  }

  const { member } = sessionData;
  const memberCode = member.member_number
    ? formatMemberCode(member.member_number)
    : member.phone;

  const expiryFormatted = new Date(member.expires_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isExpired = member.status === "EXPIRED" || new Date(member.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#171717]/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-display font-black text-base uppercase tracking-tight text-[#171717]">
            {SITE_NAME}
          </span>
        </Link>

        <form action="/api/auth/member/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-black/5 text-[#171717] text-xs font-bold uppercase tracking-wider border border-[#171717]/10 shadow-sm transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </form>
      </header>

      {/* Main Member Profile Container */}
      <main className="max-w-xl mx-auto w-full my-auto py-10">
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-10 border border-[#171717]/10 shadow-editorial-lg">
          {/* Status Badge */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[10px] font-mono font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              Member Portal
            </div>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isExpired
                  ? "bg-red-500/15 text-red-800"
                  : "bg-emerald-500/15 text-emerald-800"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isExpired ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
              {isExpired ? "Membership Expired" : `${member.status} Member`}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
            Welcome, {member.first_name} {member.last_name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5F5A] mt-1">
            Your active membership details and quick workout attendance.
          </p>

          {/* Details Card */}
          <div className="mt-8 bg-[#F8F6F2] rounded-2xl p-6 border border-[#171717]/8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/8 text-xs">
              <span className="text-[#5F5F5A] font-medium">Member ID</span>
              <span className="font-mono font-bold text-sm text-[#171717] bg-white px-2.5 py-0.5 rounded border border-[#171717]/8">
                {memberCode}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/8 text-xs">
              <span className="text-[#5F5F5A] font-medium">Plan</span>
              <span className="font-display font-bold text-xs uppercase text-[#171717]">
                {member.plan} Pass
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/8 text-xs">
              <span className="text-[#5F5F5A] font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Valid Until
              </span>
              <span className="font-medium text-xs text-[#171717]">
                {expiryFormatted}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5F5F5A] font-medium">Registered Phone</span>
              <span className="font-mono text-xs text-[#171717]">
                {member.phone}
              </span>
            </div>
          </div>

          {/* Quick Check-in action */}
          <div className="mt-8 pt-6 border-t border-[#171717]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/#qr-code"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#171717] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#2A2A28] transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Reception Check-In</span>
            </Link>

            <Link
              href="/"
              className="text-xs font-semibold text-[#5F5F5A] hover:text-[#171717] transition-colors"
            >
              ← Back to Gym Website
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] font-mono text-[#5F5F5A] uppercase tracking-wider">
        {SITE_NAME} • AUTHENTICATED MEMBER PORTAL
      </footer>
    </div>
  );
}
