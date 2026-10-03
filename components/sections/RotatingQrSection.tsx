"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, RefreshCw, X, ShieldCheck, Maximize2, Sparkles, Check } from "lucide-react";
import QRCode from "qrcode";
import SectionHeading from "../ui/SectionHeading";

export default function RotatingQrSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [tokenString, setTokenString] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

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
      // Fallback to client generation if offline or error
    }

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const checkinUrl = `${origin}/checkin?token=bst_${randomId.toLowerCase()}`;
    setTokenString(`BST-${randomId}`);

    try {
      const url = await QRCode.toDataURL(checkinUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 600,
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

  // Listen for custom open-qr-code event (e.g. from Navbar)
  useEffect(() => {
    const handleOpenQr = () => setIsOpen(true);
    window.addEventListener("open-qr-code", handleOpenQr);
    return () => window.removeEventListener("open-qr-code", handleOpenQr);
  }, []);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Timer and 60-second (1 min) interval lifecycle
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCopyToken = () => {
    if (!tokenString) return;
    navigator.clipboard?.writeText(tokenString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Trigger Banner Card */}
        <div className="mt-10 max-w-xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-[#171717]/10 shadow-[0_4px_24px_rgba(23,23,23,0.04)] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#171717] text-white flex items-center justify-center mb-5 shadow-md">
            <QrCode className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Front Desk Scanner
          </div>

          <h3 className="font-display font-black text-xl sm:text-2xl text-[#171717] tracking-tight">
            Front Desk QR Attendance
          </h3>
          <p className="mt-2 text-sm text-[#5F5F5A] max-w-md">
            Tap below to open the reception QR scanner in high-resolution full screen for seamless mobile scanning.
          </p>

          {/* Trigger Button: Show Live Reception QR */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#171717] text-white font-display font-bold tracking-wider text-xs sm:text-sm uppercase shadow-lg hover:bg-[#2A2A28] hover:shadow-xl transition-all duration-300"
            >
              <QrCode className="w-4 h-4 stroke-[2]" />
              <span>Show Live Reception QR</span>
              <Maximize2 className="w-4 h-4 text-white/70 ml-0.5" />
            </motion.button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-[11px] text-[#5F5F5A] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Auto-rotates every 60s
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              High-Speed Scan
            </span>
          </div>
        </div>

        {/* Pop-up Modal */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-[#0B0B0A]/80 backdrop-blur-md"
                aria-hidden="true"
              />

              {/* Modal Dialog Card */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="qr-modal-title"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-9 shadow-2xl border border-black/10 z-10 text-[#171717] my-auto"
              >
                {/* Header with live indicator & close button */}
                <div className="flex items-start justify-between pb-4 border-b border-[#171717]/8">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] font-mono tracking-wider text-emerald-600 uppercase font-bold">
                        Live Reception QR • Active
                      </span>
                    </div>
                    <h3 id="qr-modal-title" className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
                      Scan To Check In
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5F5F5A] mt-0.5">
                      Point your phone camera to register your gym visit instantly.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-[#F0EEE9] hover:bg-[#E4E2DC] active:scale-95 flex items-center justify-center text-[#171717] transition-all ml-3 shrink-0"
                    aria-label="Close QR pop up"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Big QR Code Canvas */}
                <div className="mt-6 relative mx-auto w-full max-w-[340px] sm:max-w-[380px] aspect-square p-4 sm:p-5 bg-white rounded-3xl border-2 border-[#171717]/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {qrUrl ? (
                      <motion.img
                        key={tokenString}
                        initial={{ opacity: 0.3, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.3, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        src={qrUrl}
                        alt="Dynamic Rotating Check-In QR Code"
                        className="w-full h-full object-contain select-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-neutral-400">
                        <RefreshCw className="w-10 h-10 animate-spin text-[#171717]" />
                        <span className="text-xs font-mono font-medium">Generating High-Res QR...</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Token string badge with Copy option */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    onClick={handleCopyToken}
                    title="Click to copy token"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8F6F2] hover:bg-[#EFECE5] border border-[#171717]/8 text-xs font-mono font-bold text-[#171717] transition-colors"
                  >
                    <span>TOKEN: {tokenString || "SYNCING..."}</span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] text-[#5F5F5A] font-normal uppercase">(Copy)</span>
                    )}
                  </button>
                </div>

                {/* Countdown & Auto-Refresh Bar */}
                <div className="mt-5 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs text-[#5F5F5A] font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-rotates every 1 min
                    </span>
                    <span className="font-mono text-[#171717] font-bold">
                      {secondsLeft}s left
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#F0EEE9] rounded-full overflow-hidden">
                    <motion.div
                      key={tokenString}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 60, ease: "linear" }}
                      className="h-full bg-[#171717]"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 pt-5 border-t border-[#171717]/8 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRotating}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F5F5A] hover:text-[#171717] transition-colors py-2 px-3.5 rounded-full hover:bg-black/5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin text-[#171717]" : ""}`} />
                    <span>Generate new token</span>
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#171717] hover:bg-[#2A2A28] text-white font-display font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Close Pop Up
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

