"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "../ui/CTAButton";
import AmbientToggle from "../ui/AmbientToggle";
import { SITE_NAME } from "@/data/siteContent";
import { useAmbientMode } from "@/lib/hooks/useAmbientMode";

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
  const { isAmbient } = useAmbientMode();
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
            ? "bg-[#F0EEE9]/90 backdrop-blur-xl border-b border-[#171717]/8 py-3.5 shadow-[0_2px_12px_rgba(23,23,23,0.03)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl xl:max-w-[1360px] mx-auto px-6 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "#home")}
            className={`flex items-center gap-2.5 group shrink-0 transition-colors duration-300 ${
              isAmbient && !scrolled ? "text-white" : "text-[#171717]"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                isAmbient && !scrolled ? "bg-white text-[#171717]" : "bg-[#171717] text-white"
              }`}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-display font-extrabold text-lg sm:text-xl tracking-tight leading-none whitespace-nowrap transition-colors duration-300 ${
                  isAmbient && !scrolled ? "text-white" : "text-[#171717]"
                }`}
              >
                {SITE_NAME}
              </span>
              <span
                className={`text-[9px] tracking-[0.25em] font-bold uppercase leading-none mt-1 whitespace-nowrap transition-colors duration-300 ${
                  isAmbient && !scrolled ? "text-white/70" : "text-[#5F5F5A]"
                }`}
              >
                FITNESS CENTRE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center shrink-0">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-xs font-bold tracking-[0.08em] uppercase transition-colors py-1.5 px-2 xl:px-4 relative group whitespace-nowrap ${
                    isAmbient && !scrolled
                      ? "text-white/85 hover:text-white"
                      : "text-[#5F5F5A] hover:text-[#171717]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-2 right-2 xl:left-4 xl:right-4 h-0.5 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rounded-full ${
                      isAmbient && !scrolled ? "bg-white" : "bg-[#171717]"
                    }`}
                  />
                </a>
                {index < NAV_ITEMS.length - 1 && (
                  <span
                    className={`w-[1px] h-3 select-none transition-colors duration-300 ${
                      isAmbient && !scrolled ? "bg-white/20" : "bg-[#171717]/25"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <Link
              href="/login"
              className={`text-xs font-bold tracking-[0.12em] uppercase py-2.5 px-2.5 xl:px-3.5 transition-colors whitespace-nowrap ${
                isAmbient && !scrolled ? "text-white hover:text-white/80" : "text-[#171717] hover:text-[#171717]/70"
              }`}
            >
              Log In
            </Link>
            <CTAButton
              href="/join"
              className={`py-2.5 px-5 xl:px-6 text-xs whitespace-nowrap shrink-0 transition-all duration-300 ${
                isAmbient && !scrolled
                  ? "!bg-white !text-[#171717] hover:!bg-white/90 shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
                  : ""
              }`}
            >
              Join Now
            </CTAButton>

            {/* Ambient Effect Toggle Switch */}
            <div
              className={`pl-3 xl:pl-4 ml-1 border-l flex items-center shrink-0 transition-colors duration-300 ${
                isAmbient && !scrolled ? "border-white/20" : "border-[#171717]/15"
              }`}
            >
              <AmbientToggle />
            </div>
          </div>

          {/* Mobile Actions: Ambient Toggle + Hamburger Button */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <AmbientToggle showLabel={false} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                isAmbient && !scrolled
                  ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  : "bg-white text-[#171717] border-[#171717]/10 hover:bg-black/5"
              }`}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
            className="fixed top-[70px] left-0 w-full bg-[#F8F6F2] border-b border-[#171717]/10 z-40 lg:hidden py-8 px-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4 items-center text-center">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-base font-bold text-[#171717] hover:text-[#171717]/70 transition-colors py-2 uppercase tracking-wider"
                >
                  {item.label}
                </a>
              ))}
              <div className="w-full pt-4 border-t border-[#171717]/8 flex flex-col gap-3 items-center">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full max-w-xs py-3 rounded-full border border-[#171717]/20 text-center font-bold text-xs uppercase tracking-[0.15em] text-[#171717] hover:bg-black/5 transition-colors"
                >
                  Log In
                </Link>
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
