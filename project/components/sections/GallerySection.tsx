"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import { GALLERY_ITEMS } from "@/data/siteContent";

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
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="gallery" className="relative py-28 md:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Transformation Gallery"
          subtitle="Real results from real members. Witness the power of consistency and dedication in our fitness transformation hall of fame."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-12"
        >
          {GALLERY_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => openLightbox(item.image)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-[#141414] border border-[rgba(212,175,55,0.05)]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex flex-col items-center justify-end p-5 gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.12)] backdrop-blur-md border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37] scale-75 group-hover:scale-100 transition-transform duration-500 ease-out">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <dialog
        ref={dialogRef}
        closedby="any"
        onClose={closeLightbox}
        aria-label="Transformation photo viewer"
        className="fixed inset-0 bg-transparent p-0 m-auto border-0 max-w-[90vw] max-h-[85vh] overflow-visible outline-none backdrop:bg-black/90 backdrop:backdrop-blur-md shadow-2xl focus:outline-none"
      >
        {selectedImage && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-[#D4AF37] bg-[#141414]/90 p-2.5 rounded-full border border-[rgba(212,175,55,0.1)] transition-all duration-300 backdrop-blur-md"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video max-w-full w-[800px] h-[500px] max-h-[75vh] rounded-lg overflow-hidden border border-[rgba(212,175,55,0.08)] shadow-gold-lg">
              <Image
                src={selectedImage}
                alt="Enlarged transformation view"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 800px"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
