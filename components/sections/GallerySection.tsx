"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import { GALLERY_ITEMS } from "@/data/siteContent";

// Asymmetric layout aspect ratios & tags for Pinterest rhythm
const GALLERY_LAYOUTS = [
  { aspect: "aspect-[4/5]", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "DEDICATION" },
  { aspect: "aspect-square", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "CONSISTENCY" },
  { aspect: "aspect-[4/3]", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "STRENGTH" },
  { aspect: "aspect-square", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "TECHNIQUE" },
  { aspect: "aspect-[4/5]", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "MILESTONES" },
  { aspect: "aspect-[4/3]", span: "col-span-1 md:col-span-1 lg:col-span-4", tag: "COMMUNITY" },
  { aspect: "aspect-[16/10]", span: "col-span-1 md:col-span-2 lg:col-span-6", tag: "TRANSFORMATION" },
  { aspect: "aspect-[16/10]", span: "col-span-1 md:col-span-2 lg:col-span-6", tag: "DAILY PROGRESS" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeLightbox = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedImage(null);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const hasClosedBy = "closedBy" in HTMLDialogElement.prototype;

    if (!hasClosedBy) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isDialogContent) {
          dialog.close();
        }
      };

      dialog.addEventListener("click", handleBackdropClick);
      return () => {
        dialog.removeEventListener("click", handleBackdropClick);
      };
    }
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-[#F0EEE9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="05 / PROGRESS"
          badgeColor="blue"
          title="Real People. Real Progress."
          subtitle="A look inside our training spaces, member dedication, and the everyday consistency that transforms lifestyles."
        />

        {/* Asymmetric Pinterest-Inspired Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mt-12 items-start"
        >
          {GALLERY_ITEMS.map((item, index) => {
            const layout = GALLERY_LAYOUTS[index % GALLERY_LAYOUTS.length];

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onClick={() => openLightbox(item.image)}
                whileHover={{ y: -4 }}
                className={`group relative ${layout.aspect} ${layout.span} w-full rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#171717]/8 shadow-editorial transition-all duration-300`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle light vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#171717] shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#171717] shadow-sm">
                      {layout.tag}
                    </span>
                  </div>
                </div>

                {/* Tag pill in corner */}
                <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#171717] backdrop-blur-sm shadow-sm">
                    {layout.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Accessible Dialog Lightbox */}
      <dialog
        ref={dialogRef}
        closedby="any"
        onClose={closeLightbox}
        aria-label="Member story photo viewer"
        className="fixed inset-0 bg-transparent p-0 m-auto border-0 max-w-[90vw] max-h-[85vh] overflow-visible outline-none backdrop:bg-black/75 backdrop:backdrop-blur-sm shadow-2xl focus:outline-none"
      >
        {selectedImage && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-[#171717] hover:text-black bg-white p-2.5 rounded-full border border-black/10 transition-all duration-200 shadow-md"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video max-w-full w-[820px] h-[520px] max-h-[75vh] rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-white">
              <Image
                src={selectedImage}
                alt="Enlarged gallery photo view"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 820px"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
