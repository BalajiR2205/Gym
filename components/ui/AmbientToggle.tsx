"use client";

import { useAmbientMode } from "@/lib/hooks/useAmbientMode";
import { Sparkles } from "lucide-react";

export default function AmbientToggle({
  className = "",
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { isAmbient, toggleAmbient } = useAmbientMode();

  return (
    <div className={`flex items-center gap-2 select-none whitespace-nowrap ${className}`}>
      {showLabel && (
        <span
          className={`text-[10px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1 whitespace-nowrap transition-colors duration-300 ${
            isAmbient ? "text-white/90" : "text-[#5F5F5A]"
          }`}
        >
          <Sparkles className={`w-3 h-3 ${isAmbient ? "text-white" : "text-[#5F5F5A]/50"}`} />
          <span>Ambient</span>
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isAmbient}
        aria-label="Toggle ambient background video effect"
        onClick={toggleAmbient}
        title={isAmbient ? "Turn ambient background video off" : "Turn ambient background video on"}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
          isAmbient ? "bg-white" : "bg-[#171717]/20 hover:bg-[#171717]/30"
        }`}
      >
        <span
          className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm ring-0 transition duration-300 ease-in-out ${
            isAmbient ? "translate-x-5 bg-[#171717]" : "translate-x-0 bg-white"
          }`}
        >
          <Sparkles
            className={`w-2.5 h-2.5 transition-colors duration-200 ${
              isAmbient ? "text-white" : "text-[#5F5F5A]/40"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
