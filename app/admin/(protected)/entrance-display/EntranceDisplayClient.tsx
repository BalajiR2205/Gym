"use client";

import { useEffect, useState } from "react";

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
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">
          Be Strong Gym
        </h1>
        <p className="text-textSecondary text-lg">Scan to check in</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-gold-lg">
        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt="Check-in QR code"
            width={360}
            height={360}
            className="block"
          />
        ) : (
          <div className="w-[360px] h-[360px] flex items-center justify-center bg-gray-100 text-gray-500">
            Loading QR…
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-textSecondary text-sm">
          Refreshes in{" "}
          <span className="text-gold font-mono text-lg">{secondsLeft}s</span>
        </p>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
