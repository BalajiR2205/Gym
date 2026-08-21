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

export default function FacilitiesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="facilities" className="relative py-24 md:py-28 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[rgba(212,175,55,0.015)] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Our Facilities"
          subtitle="Explore the state-of-the-art features and client-first amenities crafted to support your fitness progress and keep you safe."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
        >
          {FACILITIES.map((facility) => {
            const IconComponent = ICON_MAP[facility.iconName] || Dumbbell;

            return (
              <motion.div
                key={facility.id}
                variants={itemVariants}
                className="group relative bg-[#141414] border border-[rgba(212,175,55,0.05)] rounded-2xl p-7 transition-all duration-500 ease-out hover:border-[rgba(212,175,55,0.18)] hover:shadow-card-elevated"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A0A0A] group-hover:border-[#D4AF37] transition-all duration-500 mb-5">
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-[15px] font-display font-semibold tracking-wide text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {facility.title}
                </h3>
                <p className="text-[13px] text-[#BDBDBD] leading-[1.6]">
                  {facility.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
