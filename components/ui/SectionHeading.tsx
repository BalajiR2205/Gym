"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  badge?: string;
  badgeColor?: "mint" | "peach" | "sage" | "blue" | "yellow" | "coral" | "charcoal";
}

const BADGE_COLORS = {
  mint: "bg-[#CAD3C1] text-[#171717]", // PANTONE 13-6006 Almost Aqua
  peach: "bg-[#F0D8CC] text-[#171717]", // PANTONE 12-1107 Peach Dust
  sage: "bg-[#CAD3C1] text-[#171717]", // PANTONE 13-6006 Almost Aqua
  blue: "bg-[#D3E4F1] text-[#171717]", // PANTONE 13-4306 Ice Melt
  yellow: "bg-[#F6EBC8] text-[#171717]", // PANTONE 11-0515 Lemon Icing
  coral: "bg-[#EBD8DB] text-[#171717]", // PANTONE 11-1400 Raindrops on Roses
  charcoal: "bg-[#171717] text-white",
};

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  badge = "<GYM NAME> Fitness",
  badgeColor = "charcoal",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`flex flex-col mb-14 md:mb-18 ${alignmentClasses[align]}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span
            className={`text-[11px] uppercase tracking-[0.16em] font-bold px-3.5 py-1.5 rounded-full ${
              BADGE_COLORS[badgeColor] || BADGE_COLORS.charcoal
            }`}
          >
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#171717] leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#5F5F5A] max-w-2xl leading-relaxed text-balance font-normal">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
