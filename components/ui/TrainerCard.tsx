"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trainer } from "@/data/siteContent";

interface TrainerCardProps {
  trainer: Trainer;
  index: number;
}

export default function TrainerCard({ trainer, index }: TrainerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col items-center bg-[#141414] border border-[rgba(212,175,55,0.05)] rounded-2xl p-8 transition-all duration-500 ease-out hover:border-[rgba(212,175,55,0.16)] hover:shadow-card-elevated"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-7 border border-[rgba(212,175,55,0.08)] group-hover:border-[rgba(212,175,55,0.25)] transition-colors duration-500 shadow-card">
        <Image
          src={trainer.image}
          alt={trainer.name}
          fill
          sizes="128px"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
        {trainer.specialty}
      </span>
      <h3 className="text-lg font-display font-semibold text-white tracking-wide mb-3">
        {trainer.name}
      </h3>

      <div className="bg-gradient-to-b from-[#F5E6A3]/10 via-[#D4AF37]/10 to-[#8B6914]/10 text-[#D4AF37] text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5 border border-[rgba(212,175,55,0.15)]">
        {trainer.certification}
      </div>

      <p className="text-[13px] text-[#BDBDBD] text-center leading-[1.7] mb-7 max-w-[240px]">
        {trainer.bio}
      </p>

      <div className="mt-auto">
        <a
          href={trainer.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] text-[#BDBDBD] hover:text-[#0A0A0A] hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-400 ease-out"
          aria-label={`${trainer.name} on Instagram`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
