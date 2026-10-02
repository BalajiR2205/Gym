"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import CTAButton from "../ui/CTAButton";
import { BRAND_TAGLINE, HERO_SUBHEADING } from "@/data/siteContent";

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
          title="<GYM NAME> Gym Background Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full scale-[1.35] opacity-50 pointer-events-none"
          style={{ border: "none" }}
        />
      </div>

      {/* Cinematic depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0A_140%)]" />

      {/* Layer 2: Brand graphics and motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating gold orb — top left */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[rgba(212,175,55,0.05)] rounded-full blur-[120px]"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Floating gold orb — bottom right */}
        <motion.div
          className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[rgba(212,175,55,0.04)] rounded-full blur-[100px]"
          animate={{
            y: [0, 25, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Luxury motion curve — top right */}
        <svg
          className="absolute top-[15%] right-[8%] w-40 h-40 md:w-56 md:h-56 text-[rgba(212,175,55,0.12)]"
          viewBox="0 0 200 200"
        >
          <motion.path
            d="M100,20 Q180,100 100,180"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            animate={{
              pathLength: [0.7, 1, 0.7],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </svg>

        {/* Subtle vertical accent — left side */}
        <motion.div
          className="hidden md:block absolute top-[25%] left-[6%] w-[1px] h-32 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.25)] to-transparent"
          animate={{
            height: ["8rem", "14rem", "8rem"],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Subtle vertical accent — right side */}
        <motion.div
          className="hidden md:block absolute bottom-[25%] right-[6%] w-[1px] h-24 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.2)] to-transparent"
          animate={{
            height: ["6rem", "10rem", "6rem"],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* Layer 3: Text and CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Brand Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 md:gap-4 mb-8 md:mb-10"
          >
            <span className="h-[1px] w-5 md:w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-[#D4AF37]">
              {BRAND_TAGLINE}
            </span>
            <span className="h-[1px] w-5 md:w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>

          {/* Massive Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.2rem,5.8vw,9rem)] font-display font-bold tracking-tight text-white leading-[0.85] mb-3 md:mb-4"
          >
            BE <span className="text-gradient-gold">STRONG</span>
          </motion.h1>

          {/* Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-xs font-medium tracking-[0.3em] text-white/50 uppercase mb-8 md:mb-10"
          >
            GYM A/C &nbsp;|&nbsp; Unisex Fitness Center
          </motion.p>

          {/* Minimal Description — hidden on mobile */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block text-sm md:text-base text-[#BDBDBD]/60 max-w-lg mx-auto leading-[1.7] font-light mb-12 md:mb-14"
          >
            {HERO_SUBHEADING}
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <CTAButton href="/join" variant="solid" className="group">
              Join Today
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </CTAButton>

            <button
              onClick={handleScrollToPlans}
              className="text-sm text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide underline underline-offset-4 decoration-[rgba(212,175,55,0.2)] hover:decoration-[#D4AF37]"
            >
              View Plans
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-10"
        onClick={() => {
          const plansSection = document.getElementById("plans");
          if (plansSection) {
            window.scrollTo({ top: plansSection.offsetTop - 80, behavior: "smooth" });
          }
        }}
      >
        <span className="text-[10px] uppercase font-medium tracking-[0.25em] text-white/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-[#D4AF37]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
