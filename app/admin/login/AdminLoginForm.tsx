"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Dumbbell, AlertCircle } from "lucide-react";
import { SITE_NAME } from "@/data/siteContent";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin/members";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    error === "not_staff"
      ? "Your account is not registered as staff."
      : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setMessage(authError.message);
      setLoading(false);
      return;
    }

    const staffRes = await fetch("/api/auth/staff-session");
    if (!staffRes.ok) {
      await supabase.auth.signOut();
      setMessage("Your account is not registered as staff.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-[#171717]/10 shadow-editorial-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-sm">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-[#171717]">
              {SITE_NAME}
            </h1>
            <p className="text-xs text-[#5F5F5A] font-semibold uppercase tracking-wider">
              Staff Console
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
              Staff Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-[#171717] placeholder:text-[#5F5F5A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
              placeholder="staff@domain.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-[#171717] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-medium flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] text-white hover:bg-[#2A2A28] font-bold text-xs uppercase tracking-wider py-3 rounded-full transition-colors disabled:opacity-50 shadow-sm mt-2"
          >
            {loading ? "Signing in…" : "Sign in to Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
