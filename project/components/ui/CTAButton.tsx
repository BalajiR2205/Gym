"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  variant?: "solid" | "outline";
  className?: string;
  isExternal?: boolean;
}

export default function CTAButton({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  isExternal = false,
}: CTAButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-display font-semibold tracking-wide text-sm transition-all duration-400 ease-out py-4 px-8 overflow-hidden rounded-lg";

  const variants = {
    solid:
      "bg-gradient-to-b from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] text-[#0A0A0A] hover:shadow-[0_8px_24px_-6px_rgba(212,175,55,0.35)] border border-transparent hover:-translate-y-0.5 active:translate-y-0 shadow-luxury-md",
    outline:
      "bg-transparent text-[#D4AF37] border border-[rgba(212,175,55,0.4)] hover:bg-[rgba(212,175,55,0.06)] hover:border-[#D4AF37] hover:shadow-gold-ambient",
  };

  const content = (
    <>
      <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />
      <motion.span
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative z-10 flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={`${baseStyles} ${variants[variant]} ${className}`}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
}
