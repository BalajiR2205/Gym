"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScannerPage() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const scanningRef = useRef(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
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
              message: `✅ Checked in: ${data.member.full_name}`,
            });
          } else {
            setFeedback({
              type: "error",
              message: `❌ ${data.error ?? "Check-in failed"}`,
            });
          }
        } catch {
          setFeedback({
            type: "error",
            message: "❌ Network error. Please try again.",
          });
        }

        setTimeout(() => {
          scanningRef.current = false;
        }, 3000);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display text-3xl text-gradient-gold mb-2 text-center">
        Staff Scanner
      </h1>
      <p className="text-textSecondary text-center text-sm mb-8">
        Scan a member&apos;s personal QR code to check them in.
      </p>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl text-center font-medium ${
            feedback.type === "success"
              ? "bg-green-500/15 text-green-400 border border-green-500/30"
              : "bg-red-500/15 text-red-400 border border-red-500/30"
          }`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      <div
        id="qr-reader"
        className="rounded-xl overflow-hidden border border-borderGold"
      />
    </div>
  );
}
