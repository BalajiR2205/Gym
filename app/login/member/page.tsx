"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, Dumbbell, ArrowLeft, RefreshCw, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_NAME } from "@/data/siteContent";

export default function MemberLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"id" | "otp">("id");
  const [memberId, setMemberId] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  // Step 1: Send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!memberId.trim()) return;

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/auth/member/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: memberId.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to send verification code. Please try again.");
        if (data.cooldownSeconds) {
          setCooldown(data.cooldownSeconds);
        }
        setLoading(false);
        return;
      }

      setInfoMessage(data.message);
      if (data.maskedEmail) {
        setMaskedEmail(data.maskedEmail);
      }
      setCooldown(data.cooldownSeconds || 60);
      setStep("otp");
    } catch {
      setError("Network error. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/member/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code.");
        setLoading(false);
        return;
      }

      router.push(data.redirect || "/member");
      router.refresh();
    } catch {
      setError("Network error. Please verify your connection.");
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResend() {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/member/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: memberId.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not resend OTP. Please try again.");
      } else {
        setInfoMessage("A new verification code has been sent.");
        setCooldown(data.cooldownSeconds || 60);
      }
    } catch {
      setError("Network error. Please verify your connection.");
    } finally {
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

      {/* Member Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-10 border border-[#171717]/10 shadow-editorial-lg"
      >
        <AnimatePresence mode="wait">
          {step === "id" ? (
            <motion.div
              key="step-id"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="text-center mb-7">
                <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#D3E4F1] text-[#171717] flex items-center justify-center shadow-sm">
                  <UserCheck className="w-7 h-7 stroke-[2]" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                  Member Portal
                </div>

                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
                  Member Login
                </h1>
                <p className="text-xs sm:text-sm text-[#5F5F5A] max-w-xs mx-auto mt-1 leading-relaxed">
                  Enter your Member ID or registered phone number to receive a one-time login code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="member-id-input"
                    className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-2"
                  >
                    Member ID / Phone
                  </label>
                  <input
                    id="member-id-input"
                    type="text"
                    required
                    autoFocus
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. GYM-0001 or 9876543210"
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 focus:border-[#171717] rounded-2xl px-5 py-3.5 text-[#171717] placeholder:text-[#5F5F5A]/50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 transition-all shadow-sm"
                  />
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
                  disabled={loading || !memberId.trim()}
                  className="w-full mt-2 py-4 rounded-full bg-[#171717] text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#2A2A28] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>SENDING OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#EBD8DB] text-[#171717] flex items-center justify-center shadow-sm">
                  <Mail className="w-7 h-7 stroke-[2]" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                  Code Dispatched
                </div>

                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
                  Check Your Email
                </h1>
                <p className="text-xs sm:text-sm text-[#5F5F5A] max-w-xs mx-auto mt-1 leading-relaxed">
                  We sent a 6-digit verification code to your registered email address.
                </p>
                {maskedEmail && (
                  <span className="inline-block mt-2 font-mono text-xs font-bold text-[#171717] bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#171717]/8">
                    {maskedEmail}
                  </span>
                )}
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp-input"
                    className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] text-center mb-2"
                  >
                    Enter 6-Digit Code
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 focus:border-[#171717] rounded-2xl py-4 text-center font-mono font-black text-2xl tracking-[0.5em] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 transition-all shadow-sm"
                  />
                </div>

                {infoMessage && (
                  <p className="text-[11px] text-[#5F5F5A] text-center font-medium">
                    {infoMessage}
                  </p>
                )}

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
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 rounded-full bg-[#171717] text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#2A2A28] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>VERIFYING...</span>
                    </>
                  ) : (
                    <span>VERIFY OTP</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("id");
                      setOtp("");
                      setError("");
                    }}
                    className="text-[#5F5F5A] hover:text-[#171717] transition-colors font-medium"
                  >
                    Change Member ID
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || loading}
                    className="text-[#171717] font-semibold hover:underline disabled:text-[#5F5F5A] disabled:no-underline transition-colors"
                  >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-[#171717]/8 flex items-center justify-between text-xs text-[#5F5F5A]">
          <Link
            href="/login/admin"
            className="hover:text-[#171717] transition-colors"
          >
            Staff? Admin Login →
          </Link>
          <Link
            href="/login"
            className="hover:text-[#171717] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Choice</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
