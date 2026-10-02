"use client";

import { motion } from "framer-motion";
import { ChevronDown, QrCode, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SITE_NAME, HERO_SUBHEADING } from "@/data/siteContent";

export default function HeroSection() {
  const handleScrollToPlans = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) e.preventDefault();
    const plansSection = document.getElementById("plans");
    if (plansSection) {
      const navHeight = 80;
      const elementPosition = plansSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Layer 1: Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/uNN62f55EV0?autoplay=1&mute=1&loop=1&playlist=uNN62f55EV0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&disablekb=1&iv_load_policy=3"
          title={`${SITE_NAME} Gym Background Video`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full scale-[1.35] opacity-45 pointer-events-none"
          style={{ border: "none" }}
        />
      </div>

      {/* Cinematic depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#0A0A0A_130%)]" />

      {/* Layer 2: Cult.fit-inspired Vibrant Flowing Energy Ribbons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.svg
          className="w-full h-full opacity-90"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.015, 1],
          }}
          transition={{
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <defs>
            {/* Teal to Lime Ribbon Gradient */}
            <linearGradient id="cultTealWave" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#14B8A6" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#84CC16" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.75" />
            </linearGradient>

            {/* Lime to Golden Amber Wave Gradient */}
            <linearGradient id="cultGoldWave" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#84CC16" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#EAB308" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FB923C" stopOpacity="0.75" />
            </linearGradient>

            {/* Purple to Magenta / Pink Ribbon Gradient */}
            <linearGradient id="cultPurpleWave" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#A855F7" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#7C3AED" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wave 1: Flowing Teal/Lime Ribbon (crossing from left waist height through center) */}
          <path
            d="M -40,360 C 220,270 480,350 720,440 C 960,530 1200,470 1480,310 L 1480,370 C 1200,530 960,590 720,500 C 480,410 220,330 -40,420 Z"
            fill="url(#cultTealWave)"
            filter="url(#ribbonGlow)"
            className="mix-blend-screen opacity-90"
          />

          {/* Wave 2: Purple / Magenta Swirl (swooping from top right down and curving back) */}
          <path
            d="M 1480,70 C 1320,180 1140,310 930,440 C 720,570 420,620 -40,660 L -40,730 C 420,690 720,640 930,510 C 1140,380 1320,250 1480,140 Z"
            fill="url(#cultPurpleWave)"
            filter="url(#ribbonGlow)"
            className="mix-blend-screen opacity-85"
          />

          {/* Wave 3: Golden Lime Ribbon Loop (sweeping across bottom center) */}
          <path
            d="M -40,590 C 350,510 650,620 950,530 C 1200,450 1360,340 1480,370 L 1480,430 C 1360,400 1200,510 950,590 C 650,680 350,570 -40,650 Z"
            fill="url(#cultGoldWave)"
            filter="url(#ribbonGlow)"
            className="mix-blend-screen opacity-80"
          />
        </motion.svg>
      </div>

      {/* Layer 3: Central Content & Cult.fit Typography */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 w-full text-center pt-24 pb-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Cult.fit-style "WE ARE" Headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] mb-1 md:mb-2"
          >
            WE ARE
          </motion.p>

          {/* Massive Cult.fit-style Lime-Yellow Gradient Brand Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.4rem,8.8vw,8rem)] font-display font-black tracking-tight leading-[0.9] mb-6 md:mb-8"
          >
            <span className="bg-gradient-to-r from-[#A3E635] via-[#C9F257] to-[#FACC15] bg-clip-text text-transparent drop-shadow-[0_12px_40px_rgba(163,230,53,0.35)] select-all">
              {SITE_NAME}
            </span>
          </motion.h1>

          {/* Cult.fit-style Clean Punchy Tagline (NO "welcome to") */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] mb-8 md:mb-10"
          >
            {HERO_SUBHEADING}
          </motion.p>

          {/* Cult.fit-style Rounded Pill CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="hero-explore-passes-btn"
              onClick={handleScrollToPlans}
              className="px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-white text-[#FF4D58] hover:text-[#E03A45] hover:bg-neutral-100 font-black text-xs md:text-sm tracking-[0.15em] uppercase shadow-[0_6px_30px_rgba(255,255,255,0.35)] hover:shadow-[0_8px_36px_rgba(255,255,255,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              EXPLORE PASSES
            </button>

            <Link
              href="/join"
              id="hero-join-today-btn"
              className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 font-bold text-xs md:text-sm tracking-[0.1em] uppercase backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Join Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Cult.fit Minimal Bouncing Down Chevron */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 md:mt-14 cursor-pointer inline-flex flex-col items-center gap-2"
            onClick={handleScrollToPlans}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-7 h-7 text-white/70 hover:text-white transition-colors" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Bottom-Right Cult.fit-style Quick App / QR Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex absolute bottom-28 right-6 md:right-8 z-30"
      >
        <Link
          href="/checkin"
          id="hero-qr-badge"
          className="group flex flex-col items-center p-3.5 bg-white text-[#0A0A0A] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.8)] transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-[11px] font-bold text-neutral-900 text-center leading-tight mb-2">
            For better experience,<br />
            <span className="text-[10px] text-neutral-500 font-medium">use quick check-in</span>
          </div>
          {/* Interactive QR Code Preview */}
          <div className="w-20 h-20 bg-neutral-100 p-2 rounded-xl border border-neutral-200 group-hover:border-neutral-900 transition-colors flex items-center justify-center relative overflow-hidden">
            <svg
              className="w-full h-full text-neutral-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="7" y="7" width="1" height="1" fill="currentColor" />
              <rect x="18" y="7" width="1" height="1" fill="currentColor" />
              <rect x="7" y="18" width="1" height="1" fill="currentColor" />
              <path d="M14 14h3v3h-3z" fill="currentColor" />
              <path d="M20 14v3" />
              <path d="M14 20h6" />
            </svg>
            <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 flex items-center justify-center transition-colors">
              <QrCode className="w-4 h-4 text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
