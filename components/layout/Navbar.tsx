"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "../ui/CTAButton";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Plans", href: "#plans" },
  { label: "Facilities", href: "#facilities" },
  { label: "Trainers", href: "#trainers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
  { label: "Show QR", href: "#qr-code" },
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
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0A0A0A]/75 backdrop-blur-2xl border-b border-[rgba(212,175,55,0.08)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-3 text-white group"
          >
            <Dumbbell className="w-6 h-6 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500 ease-out" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight leading-none">
                BE <span className="text-gradient-gold">STRONG</span>
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#BDBDBD]/50 uppercase leading-none mt-1">
                GYM A/C
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative text-[13px] font-medium tracking-[0.1em] text-[#BDBDBD] hover:text-white transition-colors duration-300 py-1 gold-border"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <CTAButton href="/join" className="py-2.5 px-7 text-xs">
              Join Now
            </CTAButton>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-[#D4AF37] transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed top-[64px] left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-[rgba(212,175,55,0.08)] z-40 lg:hidden py-10 px-6"
          >
            <nav className="flex flex-col gap-6 items-center">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium tracking-[0.15em] text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300 py-2"
                >
                  {item.label}
                </a>
              ))}
              <CTAButton
                href="/join"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs text-center mt-2"
              >
                Join Now
              </CTAButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
