"use client";

import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/data/siteContent";

export default function WhatsAppButton() {
  const waLink = `https://wa.me/${encodeURIComponent(WHATSAPP_NUMBER)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 180, damping: 16 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1fb85a] text-white rounded-full shadow-[0_8px_28px_-6px_rgba(37,211,102,0.35)] transition-colors duration-400"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.003 14.12 1.05 11.998 1.05c-5.44 0-9.866 4.372-9.87 9.802-.001 1.772.487 3.5 1.411 5.012l-.995 3.634 3.738-.973zm13.125-9.362c-.3-.15-1.771-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.951 1.175-.176.2-.351.225-.651.075-1.026-.514-1.742-.916-2.428-2.09-.18-.31-.18-.57-.03-.72.136-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.625-.926-2.225-.244-.589-.493-.51-.677-.52l-.576-.007c-.2 0-.526.075-.801.375-.276.3-1.053 1.025-1.053 2.5s1.078 2.9 1.228 3.1c.15.2 2.122 3.24 5.141 4.541.718.309 1.279.494 1.716.633.722.23 1.38.196 1.9.119.58-.087 1.771-.725 2.022-1.425.25-.7.25-1.299.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </motion.a>
    </motion.div>
  );
}
