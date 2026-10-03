"use client";

import Link from "next/link";
import { Dumbbell, UserCheck, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/data/siteContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background aesthetic texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Top Brand Link */}
      <div className="relative z-10 mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 hover:bg-white text-[#171717] border border-[#171717]/10 shadow-sm transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-lg bg-[#171717] text-white flex items-center justify-center">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <span className="font-display font-bold text-xs uppercase tracking-wider">
            {SITE_NAME}
          </span>
          <span className="text-[10px] text-[#5F5F5A] group-hover:text-[#171717] transition-colors">
            ← Home
          </span>
        </Link>
      </div>

      {/* Selection Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-lg bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-10 border border-[#171717]/10 shadow-editorial-lg text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
          Portal Access
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight mb-2">
          How are you signing in?
        </h1>
        <p className="text-xs sm:text-sm text-[#5F5F5A] max-w-sm mx-auto mb-8">
          Select your portal to continue with member services or staff operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Member Card */}
          <Link
            href="/login/member"
            className="group relative p-6 rounded-2xl bg-[#D3E4F1]/60 hover:bg-[#D3E4F1] border border-[#171717]/10 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white text-[#171717] flex items-center justify-center shadow-sm mb-4">
                <UserCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#171717] mb-1">
                Member Login
              </h2>
              <p className="text-xs text-[#5F5F5A] leading-relaxed">
                Access your membership, expiry date, and attendance history.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#171717] group-hover:translate-x-1 transition-transform">
              <span>Sign in with OTP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Admin Card */}
          <Link
            href="/login/admin"
            className="group relative p-6 rounded-2xl bg-[#CAD3C1]/60 hover:bg-[#CAD3C1] border border-[#171717]/10 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white text-[#171717] flex items-center justify-center shadow-sm mb-4">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#171717] mb-1">
                Admin Login
              </h2>
              <p className="text-xs text-[#5F5F5A] leading-relaxed">
                Front desk, member directory, attendance stats, and scanner.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#171717] group-hover:translate-x-1 transition-transform">
              <span>Staff portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#171717]/8 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F5F5A] hover:text-[#171717] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {SITE_NAME} Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
