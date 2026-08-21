"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, RefreshCw, X, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";
import QRCode from "qrcode";
import SectionHeading from "../ui/SectionHeading";

export default function RotatingQrSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [tokenString, setTokenString] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRotating, setIsRotating] = useState(false);

  // Generate or fetch a new live rotating QR token
  const generateNewToken = useCallback(async () => {
    setIsRotating(true);
    try {
      const res = await fetch("/api/checkin/rotating-token");
      if (res.ok) {
        const data = await res.json();
        setQrUrl(data.qr_image_data_url);
        setTokenString(`BST-${data.token.slice(0, 6).toUpperCase()}`);
        return;
      }
    } catch {
      // Fallback to client generation if offline
    }

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const checkinUrl = `${origin}/checkin?token=bst_${randomId.toLowerCase()}`;
    setTokenString(`BST-${randomId}`);

    try {
      const url = await QRCode.toDataURL(checkinUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 320,
        color: {
          dark: "#0A0A0A",
          light: "#FFFFFF",
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    } finally {
      setTimeout(() => setIsRotating(false), 500);
    }
  }, []);

  // Timer and 60-second (1 min) interval lifecycle
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOpenQr = () => setIsOpen(true);
    window.addEventListener("open-qr-code", handleOpenQr);
    return () => window.removeEventListener("open-qr-code", handleOpenQr);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    // Initial QR generation
    generateNewToken();
    setSecondsLeft(60);

    // Countdown tick every second
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);

    // Refresh QR every 60 seconds (1 minute)
    timerRef.current = setInterval(() => {
      generateNewToken();
    }, 60000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isOpen, generateNewToken]);

  const handleManualRefresh = () => {
    generateNewToken();
    setSecondsLeft(60);
  };

  return (
    <section id="qr-code" className="relative py-20 bg-[#0A0A0A] border-t border-[rgba(212,175,55,0.08)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[rgba(212,175,55,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <SectionHeading
          title="Digital Check-In"
          subtitle="Access our dynamic rotating QR code for touchless entrance and quick verification."
        />

        {/* Trigger Button: Show QR */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] border border-[rgba(212,175,55,0.3)] hover:border-[#D4AF37] text-white font-display font-semibold tracking-wider text-sm transition-all duration-300 shadow-gold-ambient hover:shadow-gold-elevated"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] shrink-0">
              <QrCode className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-white group-hover:text-gradient-gold transition-colors duration-300">
              {isOpen ? "Hide QR" : "Show QR"}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
          </motion.button>
        </div>

        {/* Expandable Rotating QR Display */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 max-w-md mx-auto"
            >
              <div className="relative p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[rgba(212,175,55,0.2)] shadow-2xl shadow-black/80 backdrop-blur-xl">
                {/* Header with live indicator & close button */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                      Live Rotating QR
                    </span>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    aria-label="Close QR display"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* QR Code Canvas with Gold Frame */}
                <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-4 bg-white rounded-2xl shadow-gold-elevated flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {qrUrl ? (
                      <motion.img
                        key={tokenString}
                        initial={{ opacity: 0.2, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.2, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        src={qrUrl}
                        alt="Dynamic Rotating Check-In QR Code"
                        width={280}
                        height={280}
                        className="w-full h-full object-contain select-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
                        <span className="text-xs font-mono">Generating QR...</span>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Corner Accent marks */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />
                </div>

                {/* Token string badge */}
                <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[11px] font-mono text-[#D4AF37]/90">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>TOKEN: {tokenString || "SYNCING..."}</span>
                </div>

                {/* Countdown & Auto-Refresh Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Auto-rotates every 1 min
                    </span>
                    <span className="font-mono text-[#D4AF37] font-semibold">
                      {secondsLeft}s left
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      key={tokenString}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 60, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3]"
                    />
                  </div>
                </div>

                {/* Manual Refresh Action */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center">
                  <button
                    onClick={handleManualRefresh}
                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#D4AF37] transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin text-[#D4AF37]" : ""}`} />
                    <span>Refresh code now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
