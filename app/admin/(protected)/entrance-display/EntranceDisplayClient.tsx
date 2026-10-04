"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Sparkles, Dumbbell } from "lucide-react";
import { SITE_NAME } from "@/data/siteContent";

export default function EntranceDisplayPage() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [error, setError] = useState("");

  async function fetchToken() {
    try {
      const res = await fetch("/api/checkin/rotating-token");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load QR");
        return;
      }
      setQrUrl(data.qr_image_data_url);
      setExpiresAt(new Date(data.expires_at));
      setError("");
    } catch {
      setError("Connection error — retrying…");
    }
  }

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const left = Math.max(
        0,
        Math.ceil((expiresAt.getTime() - Date.now()) / 1000)
      );
      setSecondsLeft(left);
      if (left <= 2) fetchToken();
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#171717] flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden select-none">
      {/* Background subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Top Header / Back navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-10">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#171717]/10 text-xs font-bold uppercase tracking-wider text-[#5F5F5A] hover:text-[#171717] hover:bg-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Kiosk</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#171717]/10 text-xs text-[#5F5F5A] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Turnstile Kiosk</span>
        </div>
      </div>

      {/* Center QR Display */}
      <div className="flex flex-col items-center justify-center my-auto relative z-10 py-6">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#171717] text-white mx-auto shadow-sm mb-2">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#171717]">
            {SITE_NAME}
          </h1>
          <p className="text-sm sm:text-base text-[#5F5F5A] font-medium tracking-wide">
            Scan with your mobile camera or gym app to check in
          </p>
        </div>

        {/* QR Card */}
        <div className="bg-white p-7 sm:p-9 rounded-[32px] border border-[#171717]/10 shadow-editorial-lg relative group">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt="Live Entrance Check-in QR code"
              width={340}
              height={340}
              className="block rounded-2xl"
            />
          ) : (
            <div className="w-[340px] h-[340px] flex flex-col items-center justify-center gap-3 bg-[#F8F6F2] rounded-2xl text-[#5F5F5A]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#171717]" />
              <span className="text-xs font-semibold">Generating dynamic pass…</span>
            </div>
          )}
        </div>

        {/* Countdown Pill */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#171717]/10 shadow-sm text-xs font-bold uppercase tracking-wider text-[#171717]">
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#5F5F5A] ${
                secondsLeft <= 5 ? "animate-spin text-amber-600" : ""
              }`}
            />
            <span>Refreshes in</span>
            <span className="font-mono text-sm font-black text-[#171717]">
              {secondsLeft}s
            </span>
          </div>

          {error && (
            <p className="text-rose-600 text-xs font-medium" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Footer Notes */}
      <div className="w-full max-w-md text-center text-xs text-[#5F5F5A] relative z-10 flex items-center justify-center gap-2 pb-2">
        <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
        <span>Rotating security token protects against unauthorized screen sharing.</span>
      </div>
    </div>
  );
}
