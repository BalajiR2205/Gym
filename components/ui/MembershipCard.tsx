"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";
import { MembershipPlan } from "@/data/siteContent";

interface MembershipCardProps {
  plan: MembershipPlan;
  index: number;
}

export default function MembershipCard({ plan, index }: MembershipCardProps) {
  const isPopular = plan.isPopular;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className={`relative flex flex-col justify-between p-8 md:p-9 rounded-2xl transition-all duration-500 ease-out group ${
        isPopular
          ? "bg-gradient-to-b from-[#1A1A1A] to-[#141414] border border-[rgba(212,175,55,0.2)] shadow-gold-elevated hover:shadow-gold-lg hover:-translate-y-1"
          : "bg-[#141414] border border-[rgba(212,175,55,0.06)] shadow-card hover:border-[rgba(212,175,55,0.16)] hover:shadow-card-elevated hover:-translate-y-1"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] text-[#0A0A0A] text-[10px] font-display font-bold tracking-[0.25em] uppercase px-5 py-2 rounded-full whitespace-nowrap">
          Best Value
        </span>
      )}

      <div>
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
              isPopular
                ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border-[rgba(212,175,55,0.2)]"
                : "bg-[#1A1A1A] text-[#BDBDBD] border-[rgba(212,175,55,0.06)]"
            }`}
          >
            {plan.duration}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-display font-bold text-white tracking-tight">
            {plan.price}
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.12)] to-transparent mb-7" />

        <ul className="space-y-3.5 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] text-[#BDBDBD]">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-2">
        <CTAButton
          href="/join"
          variant={isPopular ? "solid" : "outline"}
          className="w-full py-3 text-xs"
        >
          Join Now
        </CTAButton>
      </div>
    </motion.div>
  );
}
