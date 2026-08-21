import HeroSection from "@/components/sections/HeroSection";
import MembershipSection from "@/components/sections/MembershipSection";
import FacilitiesSection from "@/components/sections/FacilitiesSection";
import TrainersSection from "@/components/sections/TrainersSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import RotatingQrSection from "@/components/sections/RotatingQrSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MembershipSection />
      <FacilitiesSection />
      <TrainersSection />
      <GallerySection />
      <ContactSection />
      <RotatingQrSection />
    </>
  );
}
