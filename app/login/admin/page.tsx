"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Dumbbell, ArrowLeft, RefreshCw, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/data/siteContent";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin/members";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid username or password.");
        setLoading(false);
        return;
      }

      router.push(data.redirect || redirectUrl);
      router.refresh();
    } catch {
      setError("Network error. Please verify your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background subtle radial texture */}
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

      {/* Admin Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-10 border border-[#171717]/10 shadow-editorial-lg"
      >
        <div className="text-center mb-7">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#CAD3C1] text-[#171717] flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-7 h-7 stroke-[2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            Staff Portal
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5F5A] max-w-xs mx-auto mt-1 leading-relaxed">
            Enter administrative credentials to access gym management and scanner operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-2"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5F5F5A]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full bg-[#F8F6F2] border border-[#171717]/15 focus:border-[#171717] rounded-2xl pl-11 pr-5 py-3.5 text-[#171717] placeholder:text-[#5F5F5A]/50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5F5F5A]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8F6F2] border border-[#171717]/15 focus:border-[#171717] rounded-2xl pl-11 pr-5 py-3.5 text-[#171717] placeholder:text-[#5F5F5A]/50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 transition-all shadow-sm"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full mt-2 py-4 rounded-full bg-[#171717] text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#2A2A28] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <span>SIGN IN TO DASHBOARD</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#171717]/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F5F5A]">
          <Link
            href="/login/member"
            className="hover:text-[#171717] transition-colors"
          >
            ← Member Login
          </Link>
          <Link
            href="/login"
            className="hover:text-[#171717] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Portal Choice</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0EEE9] flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[#171717]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
