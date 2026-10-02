"use client";

import SectionHeading from "../ui/SectionHeading";
import MembershipCard from "../ui/MembershipCard";
import { MEMBERSHIP_PLANS, PERSONAL_TRAINING_PLANS } from "@/data/siteContent";
import { motion } from "framer-motion";

export default function MembershipSection() {
  return (
    <section id="plans" className="relative py-32 md:py-40 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[rgba(212,175,55,0.02)] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Membership Offers"
          subtitle="Choose the plan that fits your lifestyle. Full equipment access, expert guidance, and premium facilities — at every tier."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-16">
          {MEMBERSHIP_PLANS.map((plan, index) => (
            <MembershipCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-32"
        >
          <div className="flex flex-col items-center mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                &lt;GYM NAME&gt; Fitness
              </span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white leading-[1.1]">
              Personal Training
            </h2>
            <p className="mt-6 text-sm md:text-base text-[#BDBDBD] max-w-2xl text-center text-balance font-light leading-[1.7]">
              Accelerate your results with 1-on-1 expert coaching. Get a custom program, nutrition plan, and dedicated support to transform faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PERSONAL_TRAINING_PLANS.map((plan, index) => (
              <MembershipCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
