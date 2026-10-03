"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import CTAButton from "../ui/CTAButton";
import {
  ADDRESS,
  PHONE_NUMBER,
  EMAIL,
  WORKING_HOURS,
  GOOGLE_MAPS_EMBED_URL,
  WHATSAPP_NUMBER,
} from "@/data/siteContent";

export default function ContactSection() {
  const waLink = `https://wa.me/${encodeURIComponent(WHATSAPP_NUMBER)}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

  const infoItems = [
    {
      icon: MapPin,
      label: "Our Location",
      value: ADDRESS,
      bg: "bg-[#CAD3C1]", // Almost Aqua
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: (
        <div className="space-y-0.5">
          <p>{WORKING_HOURS.weekdays}</p>
          <p>{WORKING_HOURS.sunday}</p>
        </div>
      ),
      bg: "bg-[#F6EBC8]", // Lemon Icing
    },
    {
      icon: Phone,
      label: "Call Us",
      value: PHONE_NUMBER,
      bg: "bg-[#D3E4F1]", // Ice Melt
    },
    {
      icon: Mail,
      label: "Email Support",
      value: EMAIL,
      bg: "bg-[#F0D8CC]", // Peach Dust
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#F8F6F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="06 / VISIT US"
          badgeColor="yellow"
          title="Come Train With Us."
          subtitle="Drop in for a quick floor walkthrough, chat with our coaching team, or reach out anytime."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mt-12">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#171717]/8 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#F0EEE9] border border-black/5 flex items-center justify-center text-[#171717] mb-4">
                    <item.icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5F5F5A] mb-1.5">
                      {item.label}
                    </h4>
                    <div className="text-sm font-semibold text-[#171717] leading-snug">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <CTAButton
                href={waLink}
                isExternal
                variant="solid"
                className="w-full sm:w-auto bg-[#25D366] text-[#171717] hover:bg-[#20BE5A]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </CTAButton>

              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display font-bold tracking-wide text-xs sm:text-sm uppercase py-3.5 px-6 rounded-full border-2 border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-300"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Rounded Google Maps Card */}
          <div className="lg:col-span-6 relative w-full min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-[#171717]/10 shadow-editorial-md bg-white">
            <iframe
              title="Gym Location Map"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
