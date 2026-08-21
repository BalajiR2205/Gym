"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
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

  const infoItems = [
    { icon: MapPin, label: "Our Location", value: ADDRESS },
    { icon: Phone, label: "Call Us", value: PHONE_NUMBER },
    { icon: Mail, label: "Email Address", value: EMAIL },
    {
      icon: Clock,
      label: "Working Hours",
      value: (
        <div className="space-y-0.5">
          <p>{WORKING_HOURS.weekdays}</p>
          <p>{WORKING_HOURS.sunday}</p>
        </div>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-32 md:py-40 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-[rgba(212,175,55,0.015)] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Contact & Location"
          subtitle="Get in touch with us, find our facilities on the map, or drop by for a tour during our operational hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch mt-14">
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-7">
              <h3 className="text-xl font-display font-semibold uppercase text-white tracking-wide mb-1">
                Connect With Us
              </h3>
              <p className="text-[#BDBDBD] text-sm max-w-md leading-[1.7]">
                Have questions about our plans, trainers, or equipment? Send us a message or visit us in person. Our team is ready to assist.
              </p>

              <div className="space-y-4 pt-2">
                {infoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-5 p-5 rounded-xl bg-[#141414] border border-[rgba(212,175,55,0.05)] transition-all duration-400 ease-out hover:border-[rgba(212,175,55,0.14)] hover:bg-[#1A1A1A]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] flex items-center justify-center text-[#0A0A0A] shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-white font-display font-semibold uppercase text-[10px] tracking-[0.25em] mb-1.5">
                        {item.label}
                      </h4>
                      <div className="text-[13px] text-[#BDBDBD] leading-[1.6]">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <CTAButton
                href={waLink}
                isExternal
                variant="solid"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb85a] hover:shadow-[0_10px_28px_-6px_rgba(37,211,102,0.25)] group transition-all duration-400"
              >
                <MessageCircle className="w-4 h-4 mr-2 stroke-[1.5]" />
                Chat on WhatsApp
              </CTAButton>
            </div>
          </div>

          <div className="relative w-full min-h-[400px] lg:min-h-full rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.05)] shadow-gold-elevated bg-[#141414]">
              <iframe
                title="Be Strong Gym Location Map"
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
