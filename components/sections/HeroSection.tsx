"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Dumbbell } from "lucide-react";
import CTAButton from "../ui/CTAButton";
import { HERO_SUBHEADING } from "@/data/siteContent";

export default function HeroSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);

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
      className="relative min-h-[92vh] w-full bg-[#F0EEE9] pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* Left Column: Bold Editorial Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Micro-label pill */}
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

            {/* Oversized Expressive Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-display font-extrabold text-[#171717] tracking-tight leading-[1.08] mb-6">
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

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5F5F5A] max-w-xl leading-relaxed mb-8 font-normal">
              {HERO_SUBHEADING}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <CTAButton href="/join" variant="solid" className="w-full sm:w-auto">
                <span>JOIN THE GYM</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </CTAButton>

              <button
                id="hero-explore-plans-btn"
                onClick={handleScrollToPlans}
                className="w-full sm:w-auto inline-flex items-center justify-center font-display font-bold tracking-wide text-xs sm:text-sm uppercase py-3.5 px-7 rounded-full border-2 border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-300 active:translate-y-0"
              >
                EXPLORE MEMBERSHIPS
              </button>
            </div>

            {/* Micro Highlights Pill Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-[#171717]/10 text-xs font-bold uppercase tracking-wider text-[#5F5F5A]">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EBD8DB]" />
                Full A/C Facility
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#171717]" />
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
            className="lg:col-span-5 relative w-full"
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
