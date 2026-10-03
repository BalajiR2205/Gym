"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  QrCode,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Clock,
  ArrowLeft,
  Dumbbell,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_NAME } from "@/data/siteContent";

type Member = {
  id: string;
  member_code?: string;
  full_name: string;
  phone: string;
  status: string;
  expires_at: string;
  plan?: string;
};

// Curated Pantone color palettes matching our editorial design system
const PANTONE_CARD_PALETTES = [
  {
    name: "Ice Melt",
    code: "PANTONE 13-4306",
    bg: "bg-[#D3E4F1]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "ENDURANCE & CLARITY",
  },
  {
    name: "Almost Aqua",
    code: "PANTONE 13-6006",
    bg: "bg-[#CAD3C1]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "RECOVERY & STRENGTH",
  },
  {
    name: "Lemon Icing",
    code: "PANTONE 11-0515",
    bg: "bg-[#F6EBC8]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "ENERGY & FOCUS",
  },
  {
    name: "Peach Dust",
    code: "PANTONE 12-1107",
    bg: "bg-[#F0D8CC]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "WARMTH & DEDICATION",
  },
  {
    name: "Raindrops on Roses",
    code: "PANTONE 11-1400",
    bg: "bg-[#EBD8DB]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "BALANCE & DRIVE",
  },
  {
    name: "Orchid Tint",
    code: "PANTONE 13-3802",
    bg: "bg-[#DBD2DB]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "MINDSET & DISCIPLINE",
  },
  {
    name: "Nimbus Cloud",
    code: "PANTONE 13-4108",
    bg: "bg-[#D5D5D8]",
    badgeBg: "bg-white/85 text-[#171717]",
    tag: "MODERN PRECISION",
  },
];

function CheckinContent({
  palette,
  onShufflePalette,
}: {
  palette: (typeof PANTONE_CARD_PALETTES)[number];
  onShufflePalette: () => void;
}) {
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
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md">
          <AlertCircle className="w-7 h-7 text-amber-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
          Scanner Verification
        </div>
        <h2 className="text-2xl font-display font-black text-[#171717] mb-2 tracking-tight">
          Invalid or Expired QR Code
        </h2>
        <p className="text-xs sm:text-sm text-[#5F5F5A] max-w-sm mx-auto mb-6 leading-relaxed">
          Please scan the active rotating QR code currently displayed at the gym reception desk to check in.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#2A2A28] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
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
        setError(data.error ?? "Check-in failed. Please verify your Member ID or phone number.");
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
          className="text-center py-2"
        >
          {/* Header pill */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${palette.badgeBg} text-[10px] font-mono font-bold tracking-wider uppercase shadow-sm`}>
              <Sparkles className="w-3 h-3 text-[#171717]" />
              {palette.code} • {palette.name}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/15 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Entry
            </span>
          </div>

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#171717] mb-1 tracking-tight">
            Welcome, {member.full_name}!
          </h2>
          <p className="text-xs font-mono font-semibold text-[#171717]/70 mb-6">
            ID: {member.member_code || member.phone || member.id}
          </p>

          <div className="bg-white/85 border border-[#171717]/10 rounded-2xl p-5 mb-6 text-left space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5F5F5A] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#171717]" /> Check-In Time
              </span>
              <span className="text-[#171717] font-mono font-bold">{checkedInAt}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5F5F5A] flex items-center gap-1.5 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-[#171717]" /> Membership Status
              </span>
              <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                Active Member
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5F5F5A] font-medium">Verification Mode</span>
              <span className="text-[#171717] font-mono font-bold text-[11px] bg-black/5 px-2 py-0.5 rounded">
                RECEPTION QR
              </span>
            </div>
          </div>

          <p className="text-xs text-[#171717]/70 leading-relaxed mb-6 font-medium">
            Attendance has been registered and synced with the gym attendance records. Enjoy your workout!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#2A2A28] transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={() => {
                setStep("input");
                setIdentifier("");
                setMember(null);
                onShufflePalette();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-[#171717] font-display font-bold text-xs uppercase tracking-wider border border-[#171717]/10 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check In Another</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Top Badge & Palette Indicator */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${palette.badgeBg} text-[10px] font-mono font-bold tracking-wider uppercase shadow-sm`}>
              <Sparkles className="w-3 h-3 text-[#171717]" />
              {palette.code} • {palette.name}
            </span>

            <button
              type="button"
              onClick={onShufflePalette}
              title="Shuffle card color theme"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#171717]/70 hover:text-[#171717] px-2.5 py-1 rounded-full bg-white/60 hover:bg-white/90 transition-all border border-[#171717]/8"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Theme</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md">
              <QrCode className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Reception Touchless Entry
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#171717] tracking-tight">
              Member Check-In
            </h1>
            <p className="text-xs sm:text-sm text-[#171717]/75 max-w-xs mx-auto mt-1 leading-relaxed">
              Enter your Member ID or registered phone number to log your attendance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-2">
                Member ID or Phone Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
                placeholder="e.g. GYM-0042 or 9876543210"
                className="w-full bg-white/90 border border-[#171717]/15 focus:border-[#171717] rounded-2xl px-5 py-4 text-[#171717] placeholder:text-[#5F5F5A]/60 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 transition-all shadow-sm"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="w-full py-4 rounded-full bg-[#171717] text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#2A2A28] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Recording Attendance...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Check-In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#171717]/10 text-center">
            <span className="text-[11px] text-[#171717]/70 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Verified against active dynamic reception token
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CheckinPage() {
  // Random Pantone color selection for the card
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    // Pick a random index on client mount so each visit gets a fresh pantone color
    const randomIndex = Math.floor(Math.random() * PANTONE_CARD_PALETTES.length);
    setPaletteIndex(randomIndex);
  }, []);

  const handleShufflePalette = () => {
    setPaletteIndex((prev) => (prev + 1) % PANTONE_CARD_PALETTES.length);
  };

  const currentPalette = PANTONE_CARD_PALETTES[paletteIndex];

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background aesthetic touches */}
      <div className="absolute inset-0 bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Top Brand Link */}
      <div className="relative z-10 mb-6 text-center">
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

      {/* Main Check-In Card with Random Pantone Color */}
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-md ${currentPalette.bg} border border-[#171717]/12 rounded-3xl sm:rounded-[36px] p-7 sm:p-9 shadow-editorial-lg`}
      >
        <Suspense
          fallback={
            <div className="text-center py-12 text-[#171717]/60">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#171717]" />
              <p className="text-xs font-mono">Loading check-in...</p>
            </div>
          }
        >
          <CheckinContent
            palette={currentPalette}
            onShufflePalette={handleShufflePalette}
          />
        </Suspense>
      </motion.div>

      {/* Footer Tagline */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-[11px] font-mono tracking-widest text-[#5F5F5A] uppercase">
          {SITE_NAME} • DIGITAL ATTENDANCE SYSTEM
        </p>
      </div>
    </div>
  );
}


