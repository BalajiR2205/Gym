"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, RefreshCw, X, ShieldCheck, ChevronDown } from "lucide-react";
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
          dark: "#171717",
          light: "#FFFFFF",
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    } finally {
      setTimeout(() => setIsRotating(false), 400);
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

    generateNewToken();
    setSecondsLeft(60);

    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);

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
    <section id="qr-code" className="relative py-20 md:py-28 bg-[#F0EEE9] border-t border-[#171717]/8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <SectionHeading
          badge="07 / MEMBER ACCESS"
          badgeColor="mint"
          title="Digital Check-In."
          subtitle="Scan our dynamic rotating QR code for touchless reception entry and automated attendance logging."
        />

        {/* Trigger Button: Show QR */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#171717] text-white font-display font-bold tracking-wider text-xs sm:text-sm uppercase shadow-sm hover:bg-[#2A2A28] transition-all duration-300"
          >
            <QrCode className="w-4 h-4 stroke-[2]" />
            <span>{isOpen ? "Hide QR Scanner" : "Show Live Reception QR"}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-white/70" />
            </motion.div>
          </motion.button>
        </div>

        {/* Expandable Rotating QR Display */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 16 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-md mx-auto"
            >
              <div className="relative p-7 sm:p-8 rounded-3xl bg-white border border-[#171717]/10 shadow-editorial-lg text-[#171717]">
                {/* Header with live indicator & close button */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#171717]/8">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono tracking-wider text-emerald-600 uppercase font-bold">
                      Live Rotating QR
                    </span>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#F0EEE9] hover:bg-[#E4E2DC] flex items-center justify-center text-[#171717] transition-colors"
                    aria-label="Close QR display"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* QR Code Canvas */}
                <div className="relative mx-auto w-64 h-64 p-3 bg-white rounded-2xl border-2 border-[#171717]/10 shadow-sm flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {qrUrl ? (
                      <motion.img
                        key={tokenString}
                        initial={{ opacity: 0.3, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.3, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        src={qrUrl}
                        alt="Dynamic Rotating Check-In QR Code"
                        width={280}
                        height={280}
                        className="w-full h-full object-contain select-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#171717]" />
                        <span className="text-xs font-mono">Generating QR...</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Token string badge */}
                <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8F6F2] border border-[#171717]/8 text-[11px] font-mono font-bold text-[#171717]">
                  <span>TOKEN: {tokenString || "SYNCING..."}</span>
                </div>

                {/* Countdown & Auto-Refresh Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#5F5F5A] font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-rotates every 1 min
                    </span>
                    <span className="font-mono text-[#171717] font-bold">
                      {secondsLeft}s left
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#F0EEE9] rounded-full overflow-hidden">
                    <motion.div
                      key={tokenString}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 60, ease: "linear" }}
                      className="h-full bg-[#171717]"
                    />
                  </div>
                </div>

                {/* Manual Refresh Action */}
                <div className="mt-6 pt-4 border-t border-[#171717]/8 flex items-center justify-center">
                  <button
                    onClick={handleManualRefresh}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F5F5A] hover:text-[#171717] transition-colors py-1.5 px-3 rounded-full hover:bg-black/5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin text-[#171717]" : ""}`} />
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
