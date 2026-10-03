import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "<GYM NAME> Gym A/C | Modern Unisex Fitness Center",
  description: "<GYM NAME> Gym A/C — An editorial, modern unisex fitness center offering state-of-the-art equipment, expert personal coaching, and flexible memberships.",
  keywords: ["gym", "fitness", "<GYM NAME>", "Unisex Fitness Center", "personal training", "workout", "strength training", "cardio", "wellness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[#171717] bg-[#F0EEE9] min-h-screen flex flex-col`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
