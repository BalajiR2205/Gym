"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  badge?: string;
  badgeColor?: "mint" | "peach" | "sage" | "blue" | "yellow" | "coral" | "charcoal";
  className?: string;
  size?: "default" | "compact";
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
  className,
  size = "default",
}: SectionHeadingProps) {
  const isCompact = size === "compact";
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
      className={`flex flex-col ${className ?? "mb-14 md:mb-18"} ${alignmentClasses[align]}`}
    >
      {badge && (
        <div className={`inline-flex items-center gap-2 ${isCompact ? "mb-1.5" : "mb-4"}`}>
          <span
            className={`${
              isCompact ? "text-[10px] px-3 py-1" : "text-[11px] px-3.5 py-1.5"
            } uppercase tracking-[0.16em] font-bold rounded-full ${
              BADGE_COLORS[badgeColor] || BADGE_COLORS.charcoal
            }`}
          >
            {badge}
          </span>
        </div>
      )}
      <h2
        className={`${
          isCompact
            ? "text-2xl sm:text-3xl lg:text-[2rem]"
            : "text-3xl sm:text-4xl md:text-5xl"
        } font-display font-extrabold tracking-tight text-[#171717] leading-[1.12]`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`${
            isCompact
              ? "mt-1.5 text-xs sm:text-sm max-w-xl"
              : "mt-4 text-base md:text-lg max-w-2xl"
          } text-[#5F5F5A] leading-relaxed text-balance font-normal`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
