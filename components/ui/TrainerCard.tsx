"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ArrowUpRight } from "lucide-react";
import { Trainer } from "@/data/siteContent";

interface TrainerCardProps {
  trainer: Trainer;
  index: number;
}

const TRAINER_ACCENTS = [
  { bg: "bg-[#CAD3C1]", border: "border-[#CAD3C1]", text: "text-[#171717]" }, // Almost Aqua
  { bg: "bg-[#F0D8CC]", border: "border-[#F0D8CC]", text: "text-[#171717]" }, // Peach Dust
  { bg: "bg-[#D3E4F1]", border: "border-[#D3E4F1]", text: "text-[#171717]" }, // Ice Melt
];

export default function TrainerCard({ trainer, index }: TrainerCardProps) {
  const accent = TRAINER_ACCENTS[index % TRAINER_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col bg-white border border-[#171717]/8 rounded-3xl p-7 transition-all duration-400 ease-out hover:shadow-[0_12px_32px_rgba(23,23,23,0.08)]"
    >
      {/* Top Specialty Badge */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <span className={`text-[10px] uppercase tracking-[0.16em] font-bold px-3 py-1.5 rounded-full ${accent.bg} ${accent.text}`}>
          {trainer.specialty}
        </span>
        <span className="text-xs font-mono text-[#5F5F5A] font-semibold">
          0{index + 1}
        </span>
      </div>

      {/* Trainer Portrait Frame */}
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#F8F6F2] border-2 ${accent.border}`}>
        <Image
          src={trainer.image}
          alt={trainer.name}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Name and Certification */}
      <div className="mb-3">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#171717] tracking-tight mb-1.5">
          {trainer.name}
        </h3>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#5F5F5A] font-semibold">
          <Award className="w-3.5 h-3.5 text-[#EBD8DB]" />
          <span>{trainer.certification}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs sm:text-[13px] text-[#5F5F5A] leading-relaxed mb-6 font-normal">
        {trainer.bio}
      </p>

      {/* Footer / Instagram Action */}
      <div className="mt-auto pt-4 border-t border-[#171717]/6 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#171717]/70">
          Book Session
        </span>
        <a
          href={trainer.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#171717]/70 transition-colors py-1 px-2.5 rounded-full hover:bg-black/5"
          aria-label={`${trainer.name} on Instagram`}
        >
          <span>Connect</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
