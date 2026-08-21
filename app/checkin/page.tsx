"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, QrCode, ShieldCheck, UserCheck, AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Member = {
  id: string;
  full_name: string;
  phone: string;
  status: string;
  expires_at: string;
  plan?: string;
};

function CheckinContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [identifier, setIdentifier] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkedInAt, setCheckedInAt] = useState<string>("");

  useEffect(() => {
    async function loadAuthMember() {
      try {
        const res = await fetch("/api/checkin/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data.member) {
          setMember(data.member);
          setStep("confirm");
        }
      } catch {
        // Guest/unauthenticated member flow
      }
    }
    loadAuthMember();
  }, []);

  if (!token) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">
          Invalid QR Code
        </h2>
        <p className="text-sm text-neutral-400 max-w-xs mx-auto">
          Please scan the active rotating QR code displayed on the reception screen.
        </p>
      </div>
    );
  }

  // Fast 1-click lookup & submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkin/self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Check-in failed. Please try again.");
        setLoading(false);
        return;
      }

      setMember(data.member);
      setCheckedInAt(
        new Date(data.attendance?.checked_in_at || Date.now()).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        )
      );
      setStep("done");
    } catch {
      setError("Network error. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === "done" && member ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-semibold tracking-wider text-emerald-400 uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Check-In Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
            Welcome, {member.full_name}!
          </h2>
          <p className="text-xs text-neutral-400 font-mono mb-6">
            ID: {member.phone || member.id}
          </p>

          <div className="bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Timestamp
              </span>
              <span className="text-white font-mono font-medium">{checkedInAt}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Status
              </span>
              <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                Active Member
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Method</span>
              <span className="text-[#D4AF37] font-mono text-[11px]">RECEPTION QR</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Attendance has been registered and synced with the gym attendance sheet.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] shadow-gold-ambient">
              <QrCode className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1.5">
              Reception Check-In
            </h2>
            <p className="text-xs text-[#BDBDBD] max-w-xs mx-auto">
              Enter your Unique Member ID or registered Phone Number to record your workout entry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2">
                Unique Member ID / Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
                placeholder="e.g. BST-101 or 9876543210"
                className="w-full bg-[#141414] border border-[rgba(212,175,55,0.2)] focus:border-[#D4AF37] rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm transition-all"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] text-[#0A0A0A] font-display font-bold text-sm tracking-wider uppercase hover:shadow-gold-elevated transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-luxury-md"
            >
              {loading ? "Recording Attendance..." : "Submit Check-In"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <span className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Secure QR Verification & Google Sheets Sync
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CheckinPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[rgba(212,175,55,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0F0F0F]/90 border border-[rgba(212,175,55,0.15)] rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
        <Suspense
          fallback={
            <p className="text-center text-xs text-neutral-400">
              Loading check-in...
            </p>
          }
        >
          <CheckinContent />
        </Suspense>
      </div>
    </div>
  );
}

