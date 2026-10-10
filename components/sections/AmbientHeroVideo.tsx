"use client";

/**
 * Visual Experiment: Ambient Background Video Layer
 * 
 * Provides a subtle, blurred, low-opacity moving gym atmosphere behind the entire Hero section.
 * - Sits at z-0 / z-1 behind existing hero content (z-10).
 * - Warm cream gradient overlay preserves Cloud Dancer (#F0EEE9) pastel aesthetic and text contrast.
 * - Fully non-interactive (pointer-events-none, aria-hidden, no controls).
 * - Automatically respects prefers-reduced-motion.
 */
export default function AmbientHeroVideo() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none motion-reduce:hidden"
    >
      {/* 1. Ambient Video Texture */}
      <video
        src="/videos/hero-gym.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-[6px] md:blur-[8px] opacity-[0.14] md:opacity-[0.16] transform-gpu"
      />

      {/* 2. Warm Cream Horizontal Gradient Overlay (Protects headline contrast on left, reveals subtle vibe on right) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#F0EEE9]/95 via-[#F0EEE9]/88 to-[#F0EEE9]/78 sm:from-[#F0EEE9]/94 sm:via-[#F0EEE9]/84 sm:to-[#F0EEE9]/70 lg:from-[#F0EEE9]/92 lg:via-[#F0EEE9]/80 lg:to-[#F0EEE9]/65" />

      {/* 3. Soft Vertical Vignette (Blends seamlessly into page top navbar and bottom transition) */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#F0EEE9]/40 via-transparent to-[#F0EEE9]" />

      {/* 4. Subtle Editorial Radial Grain Texture */}
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02]" />
    </div>
  );
}
