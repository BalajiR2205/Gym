"use client";

import { useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import MembershipCard from "../ui/MembershipCard";
import { MEMBERSHIP_PLANS, PERSONAL_TRAINING_PLANS } from "@/data/siteContent";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import {
  Sparkles,
  Target,
  Apple,
  Activity,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function MembershipSection() {
  const pinContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll through the pinning zone
  const { scrollYProgress } = useScroll({
    target: pinContainerRef,
    offset: ["start start", "end end"],
  });

  // Silky spring momentum for scroll transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.15,
  });

  // Track active plan index (0..3) for step pills
  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.28) {
      setActiveStep(0);
    } else if (latest < 0.48) {
      setActiveStep(1);
    } else if (latest < 0.68) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  });

  // Card 0: Monthly (Peach) - begins peeking and lands by 0.28
  const c0Y = useTransform(smoothProgress, [0.0, 0.08, 0.28], [80, 80, 0]);
  const c0Opacity = useTransform(smoothProgress, [0.0, 0.08, 0.28], [0.35, 0.35, 1]);
  const c0Scale = useTransform(smoothProgress, [0.0, 0.08, 0.28], [0.94, 0.94, 1]);
  const c0Rotate = useTransform(smoothProgress, [0.0, 0.08, 0.28], [-2, -2, 0]);

  // Card 1: Quarterly (Aqua) - arrives 0.28..0.48
  const c1Y = useTransform(smoothProgress, [0.0, 0.26, 0.48], [130, 130, 0]);
  const c1Opacity = useTransform(smoothProgress, [0.0, 0.26, 0.48], [0, 0, 1]);
  const c1Scale = useTransform(smoothProgress, [0.0, 0.26, 0.48], [0.94, 0.94, 1]);
  const c1Rotate = useTransform(smoothProgress, [0.0, 0.26, 0.48], [2, 2, 0]);

  // Card 2: Half-Yearly (Ice Melt) - arrives 0.48..0.68
  const c2Y = useTransform(smoothProgress, [0.0, 0.46, 0.68], [130, 130, 0]);
  const c2Opacity = useTransform(smoothProgress, [0.0, 0.46, 0.68], [0, 0, 1]);
  const c2Scale = useTransform(smoothProgress, [0.0, 0.46, 0.68], [0.94, 0.94, 1]);
  const c2Rotate = useTransform(smoothProgress, [0.0, 0.46, 0.68], [-1.5, -1.5, 0]);

  // Card 3: Annual (Lemon) - arrives 0.68..0.88
  const c3Y = useTransform(smoothProgress, [0.0, 0.66, 0.88], [130, 130, 0]);
  const c3Opacity = useTransform(smoothProgress, [0.0, 0.66, 0.88], [0, 0, 1]);
  const c3Scale = useTransform(smoothProgress, [0.0, 0.66, 0.88], [0.94, 0.94, 1]);
  const c3Rotate = useTransform(smoothProgress, [0.0, 0.66, 0.88], [1.5, 1.5, 0]);

  const desktopCardTransforms = [
    { y: c0Y, opacity: c0Opacity, scale: c0Scale, rotate: c0Rotate },
    { y: c1Y, opacity: c1Opacity, scale: c1Scale, rotate: c1Rotate },
    { y: c2Y, opacity: c2Opacity, scale: c2Scale, rotate: c2Rotate },
    { y: c3Y, opacity: c3Opacity, scale: c3Scale, rotate: c3Rotate },
  ];

  return (
    <section
      id="plans"
      className="relative z-20 bg-[#F8F6F2] rounded-t-[40px] sm:rounded-t-[56px] lg:rounded-t-[64px] border-t border-black/8 shadow-[0_-25px_60px_rgba(23,23,23,0.16)]"
    >
      {/* Sticky Pinning Container: Pins in place while scrolling slides each plan into place */}
      <div ref={pinContainerRef} className="relative h-[280vh] lg:h-[300vh]">
        <div className="sticky top-[84px] h-[calc(100vh-84px)] flex flex-col justify-between overflow-hidden py-2 sm:py-3 px-4 sm:px-6">
          <div className="max-w-7xl xl:max-w-[1360px] mx-auto w-full">
            {/* Section Heading */}
            <SectionHeading
              badge="02 / MEMBERSHIPS"
              badgeColor="peach"
              title="Simple, Flexible Plans."
              subtitle="All memberships include complete floor access, modern climate control, clean lockers, and complimentary trainer guidance."
              size="compact"
              className="mb-1"
            />

            {/* Plan Indicator Pills */}
            <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
              {MEMBERSHIP_PLANS.map((p, idx) => (
                <div
                  key={p.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeStep >= idx
                      ? "bg-[#171717] text-white shadow-sm"
                      : "bg-black/5 text-[#171717]/40"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeStep === idx
                        ? "bg-emerald-400 animate-pulse"
                        : activeStep > idx
                        ? "bg-white"
                        : "bg-black/20"
                    }`}
                  />
                  <span>{p.duration}</span>
                </div>
              ))}
            </div>

            {/* Desktop 4-Column Grid: Cards smoothly glide up into place one by one on scroll */}
            <div className="hidden lg:grid grid-cols-4 gap-4 xl:gap-5 items-stretch w-full mt-4">
              {MEMBERSHIP_PLANS.map((plan, index) => {
                const t = desktopCardTransforms[index];
                return (
                  <div
                    key={plan.id}
                    className="relative h-full flex flex-col min-h-[390px]"
                  >
                    {/* Subtle slot boundary outline so the user perceives cards landing into place */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-black/8 bg-black/[0.015] pointer-events-none -z-0" />

                    {/* Scroll-driven animated card */}
                    <motion.div
                      style={{
                        y: t.y,
                        opacity: t.opacity,
                        scale: t.scale,
                        rotate: t.rotate,
                      }}
                      className="relative z-10 h-full flex flex-col"
                    >
                      <MembershipCard
                        plan={plan}
                        index={index}
                        isScrollDriven
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Mobile / Tablet View (<lg): Clean stacked card deck smoothly advancing on scroll */}
            <div className="lg:hidden relative w-full max-w-sm mx-auto h-[460px] px-2 mt-5">
              {MEMBERSHIP_PLANS.map((plan, index) => {
                const isPast = activeStep > index;
                const isCurrent = activeStep === index;
                const isFuture = activeStep < index;

                return (
                  <motion.div
                    key={plan.id}
                    initial={false}
                    animate={{
                      y: isFuture ? 100 : isCurrent ? 0 : -14 * (activeStep - index),
                      scale: isFuture ? 0.92 : isCurrent ? 1 : 1 - 0.04 * (activeStep - index),
                      opacity: isFuture ? 0 : 1,
                      zIndex: isCurrent ? 20 : 10 - index,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-2 top-0 bottom-0"
                  >
                    <MembershipCard
                      plan={plan}
                      index={index}
                      isScrollDriven
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Interactive Scroll Prompt */}
            <div className="text-center mt-4">
              <span className="text-[11px] font-semibold text-[#171717]/50 inline-flex items-center gap-1">
                {activeStep < 3 ? (
                  <>
                    <span>Scroll to place next plan</span>
                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </>
                ) : (
                  <span>All 4 plans placed • Continue scrolling for coaching</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-on-1 Personal Training Editorial Feature Card: Follows naturally after the plans */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="bg-[#CAD3C1] rounded-[32px] p-8 sm:p-12 border border-black/5 shadow-editorial-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Editorial Info */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 text-[#171717] text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#EBD8DB]" />
                  <span>1-on-1 Coaching</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-[#171717] tracking-tight mb-4">
                  Train With Purpose.
                </h3>
                <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed mb-6 font-normal">
                  Accelerate your progress with individualized coaching tailored to your schedule, lifestyle, and fitness aspirations.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-semibold text-[#171717]">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#171717]" />
                    <span>Custom Workout Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-[#171717]" />
                    <span>Diet & Nutrition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#171717]" />
                    <span>Form Correction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#171717]" />
                    <span>Progress Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Personal Training Pricing Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONAL_TRAINING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl p-6 border border-black/8 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#171717]/70">
                          {plan.duration}
                        </span>
                        {plan.isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBD8DB] text-[#171717] px-2.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-display font-black text-[#171717] mb-4">
                        {plan.price}
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-xs text-[#5F5F5A] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={`/join?plan=${encodeURIComponent(plan.id)}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#171717] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2A28] transition-colors"
                    >
                      <span>Book Coaching</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
