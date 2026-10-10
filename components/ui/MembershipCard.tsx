"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";
import { MembershipPlan } from "@/data/siteContent";

interface MembershipCardProps {
  plan: MembershipPlan;
  index: number;
  isScrollDriven?: boolean;
}

// Editorial pastel color map per plan as requested
const PLAN_THEMES: Record<
  string,
  {
    bg: string;
    badgeBg: string;
    badgeText: string;
    buttonVariant: "solid" | "outline" | "coral";
    border: string;
  }
> = {
  monthly: {
    bg: "bg-[#F0D8CC]", // PANTONE 12-1107 Peach Dust
    badgeBg: "bg-white/80",
    badgeText: "text-[#171717]",
    buttonVariant: "solid",
    border: "border-black/5",
  },
  quarterly: {
    bg: "bg-[#CAD3C1]", // PANTONE 13-6006 Almost Aqua
    badgeBg: "bg-white/80",
    badgeText: "text-[#171717]",
    buttonVariant: "solid",
    border: "border-black/5",
  },
  "half-yearly": {
    bg: "bg-[#D3E4F1]", // PANTONE 13-4306 Ice Melt
    badgeBg: "bg-[#171717]",
    badgeText: "text-white",
    buttonVariant: "solid",
    border: "border-black/10",
  },
  annual: {
    bg: "bg-[#F6EBC8]", // PANTONE 11-0515 Lemon Icing
    badgeBg: "bg-white/80",
    badgeText: "text-[#171717]",
    buttonVariant: "solid",
    border: "border-black/5",
  },
  "pt-monthly": {
    bg: "bg-[#EBD8DB]", // PANTONE 11-1400 Raindrops on Roses
    badgeBg: "bg-white/80",
    badgeText: "text-[#171717]",
    buttonVariant: "solid",
    border: "border-black/5",
  },
  "pt-quarterly": {
    bg: "bg-[#DBD2DB]", // PANTONE 13-3802 Orchid Tint
    badgeBg: "bg-[#171717]",
    badgeText: "text-white",
    buttonVariant: "solid",
    border: "border-black/10",
  },
};

export default function MembershipCard({
  plan,
  index,
  isScrollDriven,
}: MembershipCardProps) {
  const isPopular = plan.isPopular;
  const theme = PLAN_THEMES[plan.id] || {
    bg: "bg-[#F8F6F2]",
    badgeBg: "bg-black/5",
    badgeText: "text-[#171717]",
    buttonVariant: "solid" as const,
    border: "border-black/5",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.div
      {...(!isScrollDriven
        ? {
            variants: cardVariants,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, amount: 0.05 },
          }
        : {})}
      whileHover={{ y: -6 }}
      className={`relative flex flex-col justify-between h-full ${
        isScrollDriven ? "p-4 sm:p-5 xl:p-6" : "p-7 sm:p-8"
      } rounded-3xl ${theme.bg} ${theme.border} border text-[#171717] shadow-[0_4px_16px_rgba(23,23,23,0.04)] hover:shadow-[0_12px_28px_rgba(23,23,23,0.08)] transition-shadow duration-300 ease-out group`}
    >
      {isPopular && (
        <div className="absolute -top-3 right-5 inline-flex items-center gap-1.5 bg-[#171717] text-white text-[10px] font-display font-bold tracking-[0.16em] uppercase px-3.5 py-1 rounded-full shadow-md">
          <Sparkles className="w-3 h-3 text-[#F6EBC8]" />
          <span>Member Favourite</span>
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className={`flex items-center justify-between gap-2 ${isScrollDriven ? "mb-2" : "mb-4"}`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]/70">
            {plan.name}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
          >
            {plan.duration}
          </span>
        </div>

        {/* Pricing */}
        <div className={`flex items-baseline gap-1.5 ${isScrollDriven ? "mb-2.5" : "mb-6"}`}>
          <span
            className={`${
              isScrollDriven ? "text-2xl sm:text-3xl xl:text-4xl" : "text-4xl sm:text-5xl"
            } font-display font-black text-[#171717] tracking-tight`}
          >
            {plan.price}
          </span>
          <span className="text-xs font-semibold text-[#171717]/60">
            / {plan.duration.toLowerCase()}
          </span>
        </div>

        {/* Divider */}
        <div className={`h-px bg-[#171717]/10 ${isScrollDriven ? "mb-2.5" : "mb-6"}`} />

        {/* Features */}
        <ul className={`${isScrollDriven ? "space-y-1.5 mb-3" : "space-y-3 mb-8"}`}>
          {plan.features.map((feature, i) => (
            <li key={i} className={`flex items-start gap-2 ${isScrollDriven ? "text-[11px] sm:text-xs" : "text-xs"} text-[#171717]/85 font-medium`}>
              <div className="w-3.5 h-3.5 rounded-full bg-[#171717] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2 h-2 stroke-[3]" />
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-1">
        <CTAButton
          href={`/join?plan=${encodeURIComponent(plan.id)}`}
          variant={theme.buttonVariant}
          className={`w-full ${isScrollDriven ? "py-2" : "py-3.5"} text-xs`}
        >
          Choose {plan.duration}
        </CTAButton>
      </div>
    </motion.div>
  );
}
