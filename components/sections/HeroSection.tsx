"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Dumbbell } from "lucide-react";
import CTAButton from "../ui/CTAButton";
import { HERO_SUBHEADING } from "@/data/siteContent";

export default function HeroSection() {
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
      className="relative min-h-[92vh] w-full bg-[#F7F4EE] pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Bold Editorial Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Micro-label pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9E8D8] text-[#171717] text-xs font-bold uppercase tracking-[0.12em] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#171717]" />
              <span>01 / START HERE</span>
              <span className="text-[#171717]/40">•</span>
              <span>UNISEX FITNESS CENTRE</span>
            </div>

            {/* Oversized Expressive Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-[#171717] tracking-tight leading-[1.04] mb-6">
              YOUR{" "}
              <span className="inline-block relative">
                <span className="relative z-10">STRONG</span>
                <span className="absolute -bottom-1.5 left-0 w-full h-4 bg-[#F8C7A8] -z-0 rounded-full rotate-[-1deg]" />
              </span>
              <br />
              STARTS HERE.
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
                <Sparkles className="w-3.5 h-3.5 text-[#F28B78]" />
                Full A/C Facility
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#171717]" />
                Certified Trainers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B8D8C5]" />
                Personal Coaching
              </span>
            </div>
          </motion.div>

          {/* Right Column: Large Rounded Editorial Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:col-span-5 relative"
          >
            {/* Background Decorative Offset Block (Pinterest aesthetic) */}
            <div className="absolute -inset-3 bg-[#B8D8C5] rounded-[36px] -rotate-1 pointer-events-none opacity-80" />

            {/* Main Rounded Video Card */}
            <div className="relative aspect-[4/3] sm:aspect-[16/12] w-full rounded-[30px] overflow-hidden border-2 border-[#171717]/10 bg-[#FFF9F0] shadow-editorial-lg">
              {/* Autoplaying muted looping background video */}
              <iframe
                src="https://www.youtube-nocookie.com/embed/uNN62f55EV0?autoplay=1&mute=1&loop=1&playlist=uNN62f55EV0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&disablekb=1&iv_load_policy=3"
                title="Gym Facility Video Preview"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full scale-[1.3] pointer-events-none"
                style={{ border: "none" }}
              />

              {/* Light editorial card vignette (no heavy black overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

              {/* Floating Editorial Badges */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#171717] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Gym Vibe
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-20">
                <span className="inline-flex items-center gap-1 bg-[#F4D98A] text-[#171717] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                  Premium Equipment ↗
                </span>
              </div>
            </div>

            {/* Playful Floating Sticker (Bottom Left) */}
            <motion.div
              initial={{ rotate: -6 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="absolute -bottom-5 -left-4 z-30 bg-[#F28B78] text-[#171717] text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-2xl shadow-md border border-black/10"
            >
              TRAIN • MOVE • GROW
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
