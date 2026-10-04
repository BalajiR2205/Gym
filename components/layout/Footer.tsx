"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, Mail, Phone, MapPin, Clock } from "lucide-react";
import {
  SITE_NAME,
  BRAND_TAGLINE,
  EMAIL,
  PHONE_NUMBER,
  ADDRESS,
  WORKING_HOURS,
  SOCIAL_LINKS,
} from "@/data/siteContent";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");

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

  const socialLinks = [
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      href: SOCIAL_LINKS.instagram,
      label: "Instagram",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: SOCIAL_LINKS.facebook,
      label: "Facebook",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: SOCIAL_LINKS.youtube,
      label: "YouTube",
    },
  ];

  return (
    <footer className="relative bg-[#171717] text-[#F0EEE9] pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div>
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2.5 text-white group mb-5"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-[#171717] flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-display font-black text-xl tracking-tight">
              {SITE_NAME}
            </span>
          </Link>
          <p className="text-[11px] text-[#D3E4F1] mb-4 font-bold tracking-[0.2em] uppercase">
            {BRAND_TAGLINE}
          </p>
          <p className="text-sm text-[#F0EEE9]/70 leading-relaxed max-w-xs font-normal">
            A modern, supportive fitness centre designed to elevate your everyday movement, strength, and overall wellbeing.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-display font-bold uppercase tracking-[0.16em] text-xs mb-6">
            Explore
          </h4>
          <ul className="space-y-3">
            {[
              { label: "Home", href: "#home" },
              { label: "Membership Plans", href: "#plans" },
              { label: "Our Facilities", href: "#facilities" },
              { label: "Meet Coaches", href: "#trainers" },
              { label: "Member Stories", href: "#gallery" },
              { label: "Location & Visit", href: "#contact" },
              { label: "Portal Login", href: "/login" },
            ].map((link) => (
              <li key={link.label}>
                {link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-[#F0EEE9]/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm text-[#F0EEE9]/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-display font-bold uppercase tracking-[0.16em] text-xs mb-6">
            Get in Touch
          </h4>
          <ul className="space-y-3.5 text-sm text-[#F0EEE9]/70">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#F6EBC8] shrink-0 mt-0.5" />
              <span className="leading-snug">{ADDRESS}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#F6EBC8] shrink-0" />
              <span>{PHONE_NUMBER}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#F6EBC8] shrink-0" />
              <span>{EMAIL}</span>
            </li>
          </ul>
        </div>

        {/* Operating Hours & Socials */}
        <div>
          <h4 className="text-white font-display font-bold uppercase tracking-[0.16em] text-xs mb-6">
            Hours & Community
          </h4>
          <div className="space-y-3 mb-6 text-sm text-[#F0EEE9]/70">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#F6EBC8] shrink-0 mt-0.5" />
              <div>
                <p>{WORKING_HOURS.weekdays}</p>
                <p>{WORKING_HOURS.sunday}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5">
            {socialLinks.map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#171717] flex items-center justify-center text-white transition-all duration-300"
                aria-label={soc.label}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F0EEE9]/50 font-medium">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.</p>
        <p>Unisex Fitness Centre & Coaching</p>
      </div>
    </footer>
  );
}
