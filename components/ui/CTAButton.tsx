"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  variant?: "solid" | "outline" | "coral";
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
    "relative inline-flex items-center justify-center font-display font-bold tracking-wide text-xs sm:text-sm uppercase transition-all duration-300 ease-out py-3.5 px-7 rounded-full overflow-hidden";

  const variants = {
    solid:
      "bg-[#171717] text-white hover:bg-[#2B2B28] active:bg-[#101010] shadow-[0_4px_14px_rgba(23,23,23,0.15)] hover:shadow-[0_6px_20px_rgba(23,23,23,0.22)] hover:-translate-y-0.5 active:translate-y-0",
    outline:
      "bg-transparent text-[#171717] border-2 border-[#171717] hover:bg-[#171717] hover:text-white hover:-translate-y-0.5 active:translate-y-0",
    coral:
      "bg-[#F28B78] text-[#171717] hover:bg-[#EE7862] shadow-[0_4px_14px_rgba(242,139,120,0.35)] hover:-translate-y-0.5 active:translate-y-0",
  };

  const content = (
    <motion.span
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="relative z-10 flex items-center justify-center gap-2"
    >
      {children}
    </motion.span>
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
