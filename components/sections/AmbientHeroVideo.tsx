"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Visual Experiment: Ambient Background Video Layer
 * 
 * Provides a visible, blurred, moving gym atmosphere behind the entire Hero section.
 * - Sits at z-0 / z-1 behind existing hero content (z-10).
 * - Warm cream gradient overlay preserves Cloud Dancer (#F0EEE9) pastel aesthetic and text contrast.
 * - Programmatic muted + play() guarantees reliable autoplay across Chrome, Safari, and iOS.
 * - Fully non-interactive (pointer-events-none, aria-hidden, no controls).
 */
export default function AmbientHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Browser autoplay policy requires DOM properties to be explicitly true
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay fallback
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Ambient Video Texture with Rich Atmospheric Glow */}
      <video
        ref={videoRef}
        src="/videos/hero-gym.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-110 filter blur-[10px] md:blur-[14px] opacity-40 md:opacity-50 transform-gpu"
      />

      {/* 2. Warm Cream Horizontal Gradient Overlay (Guarantees headline legibility on left while letting ambient movement shine on right) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#F0EEE9]/92 via-[#F0EEE9]/75 to-[#F0EEE9]/45" />

      {/* 3. Soft Top Navbar Blending */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#F0EEE9]/40 via-transparent to-transparent" />
    </motion.div>
  );
}
