"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, Mail, Phone, MapPin, Clock } from "lucide-react";
import { SITE_NAME, BRAND_TAGLINE, EMAIL, PHONE_NUMBER, ADDRESS, WORKING_HOURS, SOCIAL_LINKS } from "@/data/siteContent";

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
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const socialLinks = [
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      href: SOCIAL_LINKS.instagram,
      label: "Instagram",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: SOCIAL_LINKS.facebook,
      label: "Facebook",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      href: SOCIAL_LINKS.youtube,
      label: "YouTube",
    },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[rgba(212,175,55,0.05)] pt-20 pb-10 text-[#BDBDBD] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2.5 text-white group mb-5"
          >
            <Dumbbell className="w-6 h-6 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500 ease-out" />
            <span className="font-display font-bold text-lg tracking-tight">
              BE <span className="text-gradient-gold">STRONG</span>
            </span>
          </Link>
          <p className="text-[11px] text-[#BDBDBD]/60 mb-5 font-semibold tracking-[0.2em] uppercase">
            {BRAND_TAGLINE}
          </p>
          <p className="text-sm text-[#BDBDBD] leading-[1.8] max-w-xs">
            Elevate your body, push past your limits, and sculpt your ultimate form. Be Strong is your home for peak physical and mental output.
          </p>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold uppercase tracking-[0.2em] text-[10px] mb-7">
            Quick Links
          </h4>
          <ul className="space-y-3.5">
            {[
              { label: "Home", href: "#home" },
              { label: "Plans", href: "#plans" },
              { label: "Facilities", href: "#facilities" },
              { label: "Trainers", href: "#trainers" },
              { label: "Gallery", href: "#gallery" },
              { label: "Contact Us", href: "#contact" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[13px] text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold uppercase tracking-[0.2em] text-[10px] mb-7">
            Contact Info
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 stroke-[1.5]" />
              <span className="text-[13px] text-[#BDBDBD] leading-[1.6]">{ADDRESS}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 stroke-[1.5]" />
              <span className="text-[13px] text-[#BDBDBD]">{PHONE_NUMBER}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 stroke-[1.5]" />
              <span className="text-[13px] text-[#BDBDBD]">{EMAIL}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold uppercase tracking-[0.2em] text-[10px] mb-7">
            Hours & Connect
          </h4>
          <div className="space-y-4 mb-7">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 stroke-[1.5]" />
              <div className="text-[13px] text-[#BDBDBD] leading-[1.6]">
                <p>{WORKING_HOURS.weekdays}</p>
                <p>{WORKING_HOURS.sunday}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {socialLinks.map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] flex items-center justify-center text-[#BDBDBD] hover:text-[#0A0A0A] hover:bg-gradient-to-b hover:from-[#F5E6A3] hover:via-[#D4AF37] hover:to-[#8B6914] hover:border-transparent transition-all duration-400 ease-out"
                aria-label={soc.label}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-[rgba(212,175,55,0.05)] max-w-7xl mx-auto mb-8" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#525252]">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.</p>
        <p>
          <span className="text-[#BDBDBD] font-semibold">Unisex Fitness Center</span>
        </p>
      </div>
    </footer>
  );
}
