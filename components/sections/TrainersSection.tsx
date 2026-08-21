"use client";

import SectionHeading from "../ui/SectionHeading";
import TrainerCard from "../ui/TrainerCard";
import { TRAINERS } from "@/data/siteContent";

export default function TrainersSection() {
  return (
    <section id="trainers" className="relative py-32 md:py-40 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[500px] bg-[rgba(212,175,55,0.015)] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Meet Our Coaches"
          subtitle="Learn from certified industry specialists who have trained champions and are dedicated to your individual health journey."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {TRAINERS.map((trainer, index) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
