"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-md">
        <h1 className="font-display text-2xl text-gold mb-2">Staff Login</h1>
        <p className="text-textSecondary text-sm mb-6">
          Sign in to access the admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cardBackground border border-borderGold rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-cardBackground border border-borderGold rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          {message && (
            <p className="text-red-400 text-sm" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black font-semibold py-2.5 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
