"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, AlertCircle, Scan, Camera, Sparkles } from "lucide-react";

export default function ScannerPage() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    sub?: string;
  } | null>(null);
  const scanningRef = useRef(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (scanningRef.current) return;
        scanningRef.current = true;

        try {
          const res = await fetch("/api/checkin/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qr_payload: decodedText }),
          });

          const data = await res.json();

          if (res.ok) {
            setFeedback({
              type: "success",
              message: `Checked in: ${data.member.full_name}`,
              sub: `Pass verified • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            });
          } else {
            setFeedback({
              type: "error",
              message: data.error ?? "Check-in failed",
              sub: "Please verify member status or expiration date.",
            });
          }
        } catch {
          setFeedback({
            type: "error",
            message: "Network error",
            sub: "Could not reach verification server. Please try again.",
          });
        }

        setTimeout(() => {
          scanningRef.current = false;
        }, 3500);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#171717]/10 text-xs font-bold uppercase tracking-wider text-[#171717] shadow-sm">
          <Scan className="w-3.5 h-3.5" />
          <span>Access Point</span>
        </div>
        <h1 className="font-display text-3xl font-black tracking-tight text-[#171717]">
          Staff Scanner
        </h1>
        <p className="text-sm text-[#5F5F5A] max-w-sm mx-auto">
          Position the member&apos;s digital QR pass inside the scanner frame to verify entrance.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3.5 border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : "bg-rose-50 border-rose-200 text-rose-950"
          }`}
          role="alert"
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="font-bold text-sm">{feedback.message}</p>
            {feedback.sub && (
              <p className="text-xs opacity-80">{feedback.sub}</p>
            )}
          </div>
        </div>
      )}

      {/* Scanner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#171717]/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-[#171717]/8">
          <div className="flex items-center gap-2 font-medium text-[#171717]">
            <Camera className="w-4 h-4 text-[#5F5F5A]" />
            <span>Live Camera Feed</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Ready
          </span>
        </div>

        <div
          id="qr-reader"
          className="rounded-2xl overflow-hidden border border-[#171717]/10 bg-[#F8F6F2] [&_video]:rounded-xl [&_img]:mx-auto"
        />

        <div className="bg-[#F8F6F2] rounded-xl p-3.5 flex items-center gap-3 text-xs text-[#5F5F5A]">
          <Sparkles className="w-4 h-4 text-[#171717] shrink-0" />
          <span>
            Members can display their live rotating QR code from their mobile check-in portal.
          </span>
        </div>
      </div>
    </div>
  );
}
