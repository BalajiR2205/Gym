"use client";

import SectionHeading from "../ui/SectionHeading";
import TrainerCard from "../ui/TrainerCard";
import { TRAINERS } from "@/data/siteContent";

export default function TrainersSection() {
  return (
    <section id="trainers" className="relative py-24 md:py-32 bg-[#FFF9F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="04 / COACHING"
          badgeColor="mint"
          title="Meet Our Coaches."
          subtitle="Experienced mentors committed to your consistency, form, and personal milestones every single day."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {TRAINERS.map((trainer, index) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
