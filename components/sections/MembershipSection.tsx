"use client";

import SectionHeading from "../ui/SectionHeading";
import MembershipCard from "../ui/MembershipCard";
import { MEMBERSHIP_PLANS, PERSONAL_TRAINING_PLANS } from "@/data/siteContent";
import { motion } from "framer-motion";
import { Sparkles, Target, Apple, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MembershipSection() {
  return (
    <section id="plans" className="relative py-24 md:py-32 bg-[#F8F6F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="02 / MEMBERSHIPS"
          badgeColor="peach"
          title="Simple, Flexible Plans."
          subtitle="All memberships include complete floor access, modern climate control, clean lockers, and complimentary trainer guidance."
        />

        {/* 4 Pastel Membership Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-12">
          {MEMBERSHIP_PLANS.map((plan, index) => (
            <MembershipCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Personal Training Editorial Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-20 md:mt-28"
        >
          <div className="bg-[#CAD3C1] rounded-[32px] p-8 sm:p-12 border border-black/5 shadow-editorial-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Editorial Info */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 text-[#171717] text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#EBD8DB]" />
                  <span>1-on-1 Coaching</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-[#171717] tracking-tight mb-4">
                  Train With Purpose.
                </h3>
                <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed mb-6 font-normal">
                  Accelerate your progress with individualized coaching tailored to your schedule, lifestyle, and fitness aspirations.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-semibold text-[#171717]">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#171717]" />
                    <span>Custom Workout Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-[#171717]" />
                    <span>Diet & Nutrition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#171717]" />
                    <span>Form Correction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#171717]" />
                    <span>Progress Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Personal Training Pricing Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONAL_TRAINING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl p-6 border border-black/8 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#171717]/70">
                          {plan.duration}
                        </span>
                        {plan.isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBD8DB] text-[#171717] px-2.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-display font-black text-[#171717] mb-4">
                        {plan.price}
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-xs text-[#5F5F5A] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={`/join?plan=${encodeURIComponent(plan.id)}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#171717] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2A28] transition-colors"
                    >
                      <span>Book Coaching</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
