"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  badge?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  badge = "Be Strong Fitness",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`flex flex-col mb-20 md:mb-24 ${alignmentClasses[align]}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">
          {badge}
        </span>
        <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white leading-[1.08]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-sm md:text-[15px] text-[#BDBDBD] max-w-2xl leading-[1.7] text-balance font-light">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
