"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Dumbbell,
  Zap,
  ShieldCheck,
  MapPin,
  Wind,
  Apple,
  Shield,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { FACILITIES } from "@/data/siteContent";

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Dumbbell,
  Zap,
  ShieldCheck,
  MapPin,
  Wind,
  Apple,
  Shield,
};

// Pastel colors & collage grid spans mapping per facility
const FACILITY_CONFIG: Record<
  string,
  {
    bg: string;
    border: string;
    span: string;
    tag: string;
  }
> = {
  cardio: {
    bg: "bg-[#D3E4F1]", // PANTONE 13-4306 Ice Melt
    border: "border-black/5",
    span: "col-span-1 md:col-span-2 lg:col-span-7",
    tag: "ENDURANCE & HEART",
  },
  weights: {
    bg: "bg-[#CAD3C1]", // PANTONE 13-6006 Almost Aqua
    border: "border-black/5",
    span: "col-span-1 md:col-span-2 lg:col-span-5",
    tag: "OLYMPIC & DUMBBELLS",
  },
  ac: {
    bg: "bg-[#CAD3C1]", // PANTONE 13-6006 Almost Aqua
    border: "border-black/5",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "CLIMATE CONTROL",
  },
  strength: {
    bg: "bg-[#F8F6F2]", // Warm Cloud Neutral
    border: "border-black/10",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "TARGETED GEAR",
  },
  parking: {
    bg: "bg-[#F6EBC8]", // PANTONE 11-0515 Lemon Icing
    border: "border-black/5",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "SECURE SPACES",
  },
  lockers: {
    bg: "bg-[#DBD2DB]", // PANTONE 13-3802 Orchid Tint
    border: "border-black/5",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "FRESH & CLEAN",
  },
  diet: {
    bg: "bg-[#F0D8CC]", // PANTONE 12-1107 Peach Dust
    border: "border-black/5",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "NUTRITION",
  },
  security: {
    bg: "bg-[#EBD8DB]", // PANTONE 11-1400 Raindrops on Roses
    border: "border-black/10",
    span: "col-span-1 md:col-span-1 lg:col-span-4",
    tag: "PEACE OF MIND",
  },
};

export default function FacilitiesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="facilities" className="relative py-24 md:py-32 bg-[#F0EEE9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="03 / FACILITIES"
          badgeColor="sage"
          title="Everything You Need to Train Better."
          subtitle="Designed with intention. From high-grade lifting platforms to climate-controlled training floors and refreshing amenities."
        />

        {/* Asymmetric Pinterest-Inspired Collage Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mt-12"
        >
          {FACILITIES.map((facility, index) => {
            const IconComponent = ICON_MAP[facility.iconName] || Dumbbell;
            const config = FACILITY_CONFIG[facility.id] || {
              bg: "bg-white",
              border: "border-black/10",
              span: "col-span-1 md:col-span-1 lg:col-span-4",
              tag: "FACILITY",
            };

            return (
              <motion.div
                key={facility.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group relative ${config.bg} ${config.border} ${config.span} border rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_10px_rgba(23,23,23,0.03)] hover:shadow-[0_8px_24px_rgba(23,23,23,0.07)]`}
              >
                {/* Card Top: Pill Tag & Number */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full bg-white/80 text-[#171717] shadow-sm">
                    {config.tag}
                  </span>
                  <span className="text-xs font-mono text-[#171717]/50 font-bold">
                    0{index + 1}
                  </span>
                </div>

                {/* Card Center: Icon & Title */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#171717] flex items-center justify-center shadow-sm mb-4 transition-transform duration-300 group-hover:scale-105">
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#171717] tracking-tight mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#171717]/80 leading-relaxed font-normal">
                    {facility.description}
                  </p>
                </div>

                {/* Subtle bottom accent */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#171717]/60">
                  <span>Available All Hours</span>
                  <Sparkles className="w-3 h-3 text-[#171717]/40" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
