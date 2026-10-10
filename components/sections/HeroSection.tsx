"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Dumbbell } from "lucide-react";
import CTAButton from "../ui/CTAButton";
import { HERO_SUBHEADING } from "@/data/siteContent";
import AmbientHeroVideo from "./AmbientHeroVideo";
import { useAmbientMode } from "@/lib/hooks/useAmbientMode";

/**
 * Visual Experiment Flag:
 * Set to false to instantly revert to the standard solid pastel background.
 */
export const ENABLE_AMBIENT_HERO_VIDEO = true;

export default function HeroSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { isAmbient } = useAmbientMode();

  useEffect(() => {
    // Quick fallback to ensure smooth fade-in of the video
    const timer = setTimeout(() => {
      setIsVideoReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollToPlans = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) e.preventDefault();
    const plansSection = document.getElementById("plans");
    if (plansSection) {
      const navHeight = 84;
      const elementPosition = plansSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full bg-[#F0EEE9] pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden flex items-center"
    >
      {/* Visual Experiment: Ambient Background Video Layer (Controlled by Navbar toggle switch) */}
      {ENABLE_AMBIENT_HERO_VIDEO && (
        <AnimatePresence>
          {isAmbient && <AmbientHeroVideo />}
        </AnimatePresence>
      )}

      <div className="max-w-7xl xl:max-w-[1360px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
          {/* Left Column: Bold Editorial Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            {/* Micro-label pill - stays identical to ambient off */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CAD3C1] text-[#171717] text-xs font-bold uppercase tracking-[0.12em] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#171717]" />
              <span>
                01 / START{" "}
                <span className="font-cursive font-bold text-sm tracking-normal normal-case inline-block -rotate-1">
                  here
                </span>
              </span>
              <span className="text-[#171717]/40">•</span>
              <span>UNISEX FITNESS CENTRE</span>
            </div>

            {/* Oversized Expressive Headline - text color changes between dark variant and white */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-display font-extrabold tracking-tight leading-[1.08] mb-6 transition-colors duration-500 ${
                isAmbient
                  ? "text-white drop-shadow-[0_2px_10px_rgba(23,23,23,0.45)]"
                  : "text-[#171717]"
              }`}
            >
              <span className="whitespace-nowrap">
                YOUR{" "}
                <span className="inline-block relative">
                  <span className="relative z-10">COMEBACK</span>
                  <span className="absolute -bottom-1 left-0 w-full h-3.5 bg-[#F0D8CC] -z-0 rounded-full rotate-[-1deg]" />
                </span>
              </span>
              <br />
              <span className="whitespace-nowrap">STARTS HERE.</span>
            </h1>

            {/* Subtitle - text color changes between dark variant and white */}
            <p
              className={`text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-normal transition-colors duration-500 ${
                isAmbient
                  ? "text-white drop-shadow-[0_1px_6px_rgba(23,23,23,0.35)]"
                  : "text-[#5F5F5A]"
              }`}
            >
              {HERO_SUBHEADING}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              {/* Join The Gym CTA Button - stays identical to ambient off */}
              <CTAButton href="/join" variant="solid" className="w-full sm:w-auto">
                <span>JOIN THE GYM</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </CTAButton>

              {/* Explore Memberships Button with Google Assistant Rotating Border & Ambient Aura */}
              <div
                className="relative inline-flex items-center justify-center rounded-full group w-full sm:w-auto transition-all duration-300"
                style={{
                  filter: isAmbient
                    ? "drop-shadow(0 0 8px rgba(66, 133, 244, 0.45)) drop-shadow(0 0 12px rgba(234, 67, 53, 0.35))"
                    : "drop-shadow(0 0 6px rgba(66, 133, 244, 0.3)) drop-shadow(0 0 8px rgba(251, 188, 5, 0.25))",
                }}
              >
                {/* Sharp Rotating Border Mask */}
                <div className="relative inline-flex items-center justify-center p-[2.5px] rounded-full overflow-hidden w-full sm:w-auto shadow-sm">
                  {/* Rotating Conic Beam */}
                  <div
                    className="absolute left-1/2 top-1/2 w-[460px] h-[460px] -ml-[230px] -mt-[230px] rounded-full animate-spin-google pointer-events-none"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #4285F4 0deg, #4285F4 60deg, #EA4335 90deg, #EA4335 150deg, #FBBC05 180deg, #FBBC05 240deg, #34A853 270deg, #34A853 330deg, #4285F4 360deg)",
                    }}
                  />

                  {/* Inner Pill Button */}
                  <button
                    id="hero-explore-plans-btn"
                    onClick={handleScrollToPlans}
                    className={`relative z-10 w-full sm:w-auto inline-flex items-center justify-center font-display font-bold tracking-wide text-xs sm:text-sm uppercase py-3.5 px-7 rounded-full transition-all duration-500 whitespace-nowrap active:scale-[0.98] ${
                      isAmbient
                        ? "bg-[#171717] hover:bg-[#252522] text-white"
                        : "bg-[#F0EEE9] hover:bg-white text-[#171717]"
                    }`}
                  >
                    EXPLORE MEMBERSHIPS
                  </button>
                </div>
              </div>
            </div>

            {/* Micro Highlights Pill Bar */}
            <div
              className={`flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-[#171717]/10 text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
                isAmbient
                  ? "text-white drop-shadow-[0_1px_4px_rgba(23,23,23,0.35)]"
                  : "text-[#5F5F5A]"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EBD8DB]" />
                Full A/C Facility
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell
                  className={`w-3.5 h-3.5 transition-colors duration-500 ${
                    isAmbient ? "text-white" : "text-[#171717]"
                  }`}
                />
                Certified Trainers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CAD3C1]" />
                Personal Coaching
              </span>
            </div>
          </motion.div>

          {/* Right Column: Large Rounded Editorial Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-7 relative w-full"
          >
            {/* Background Decorative Offset Block (Pinterest aesthetic) */}
            <div className="absolute -inset-3.5 bg-[#CAD3C1] rounded-[36px] -rotate-1 pointer-events-none opacity-80" />

            {/* Main Rounded Video Card */}
            <div className="relative aspect-[16/9] w-full rounded-[30px] overflow-hidden border-2 border-[#171717]/10 bg-[#171717] shadow-editorial-lg select-none">
              {/* Autoplaying muted looping background video */}
              <video
                src="/videos/hero-gym.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setIsVideoReady(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 z-10 pointer-events-none" />

              {/* Instant Poster Layer: Fades out smoothly when video is loaded */}
              <div
                className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${
                  isVideoReady ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src="/images/hero-bg.png"
                  alt="Gym Training Facility"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Floating Editorial Badges */}
              <div className="absolute top-4 left-4 z-30 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#171717] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Gym Vibe
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
                <span className="inline-flex items-center gap-1 bg-[#F6EBC8] text-[#171717] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                  Premium Equipment ↗
                </span>
              </div>
            </div>

            {/* Playful Floating Sticker (Bottom Left) */}
            <motion.div
              initial={{ rotate: -6 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="absolute -bottom-5 -left-4 z-30 bg-[#EBD8DB] text-[#171717] text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-2xl shadow-md border border-black/10"
            >
              TRAIN • MOVE • GROW
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
