"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "../ui/CTAButton";
import { SITE_NAME } from "@/data/siteContent";

const NAV_ITEMS = [
  { label: "Membership", href: "#plans" },
  { label: "Facilities", href: "#facilities" },
  { label: "Coaches", href: "#trainers" },
  { label: "Stories", href: "#gallery" },
  { label: "Location", href: "#contact" },
  { label: "Check-In QR", href: "#qr-code" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.replace("#", "");

    if (href === "#qr-code") {
      window.dispatchEvent(new CustomEvent("open-qr-code"));
    }

    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 84;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F7F4EE]/90 backdrop-blur-xl border-b border-[#171717]/8 py-3.5 shadow-[0_2px_12px_rgba(23,23,23,0.03)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2.5 text-[#171717] group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#171717] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight leading-none text-[#171717]">
                {SITE_NAME}
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#5F5F5A] font-bold uppercase leading-none mt-1">
                FITNESS CENTRE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs font-bold tracking-[0.08em] uppercase text-[#5F5F5A] hover:text-[#171717] transition-colors py-1 relative group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#171717] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <CTAButton href="/join" className="py-2.5 px-6 text-xs">
              Join Now
            </CTAButton>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-white border border-[#171717]/10 flex items-center justify-center text-[#171717] hover:bg-black/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed top-[70px] left-0 w-full bg-[#FFF9F0] border-b border-[#171717]/10 z-40 lg:hidden py-8 px-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4 items-center text-center">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-base font-bold text-[#171717] hover:text-[#F28B78] transition-colors py-2 uppercase tracking-wider"
                >
                  {item.label}
                </a>
              ))}
              <div className="w-full pt-4 border-t border-[#171717]/8 flex flex-col items-center">
                <CTAButton
                  href="/join"
                  onClick={() => setIsOpen(false)}
                  className="w-full max-w-xs"
                >
                  Join the Gym
                </CTAButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
