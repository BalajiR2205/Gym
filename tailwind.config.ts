import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        cream: {
          DEFAULT: "#F0EEE9", // PANTONE 11-4201 Cloud Dancer
          50: "#FAF9F6",
          100: "#F8F6F2",
          200: "#F0EEE9", // Cloud Dancer
          300: "#E5E2DC",
          400: "#DCD8D0",
          500: "#CAC4B8",
        },
        charcoal: {
          DEFAULT: "#171717",
          50: "#73736E",
          100: "#5F5F5A",
          200: "#3D3D39",
          800: "#1E1E1C",
          900: "#171717",
        },
        pantone: {
          cloudDancer: "#F0EEE9", // PANTONE 11-4201 Cloud Dancer (Main Background)
          lemonIcing: "#F6EBC8", // PANTONE 11-0515 Lemon Icing
          nimbusCloud: "#D5D5D8", // PANTONE 13-4108 Nimbus Cloud
          raindropsOnRoses: "#EBD8DB", // PANTONE 11-1400 Raindrops on Roses
          iceMelt: "#D3E4F1", // PANTONE 13-4306 Ice Melt
          peachDust: "#F0D8CC", // PANTONE 12-1107 Peach Dust
          almostAqua: "#CAD3C1", // PANTONE 13-6006 Almost Aqua
          orchidTint: "#DBD2DB", // PANTONE 13-3802 Orchid Tint
        },
        pastel: {
          sage: "#CAD3C1", // PANTONE 13-6006 Almost Aqua
          "sage-light": "#E2E7DC",
          mint: "#CAD3C1", // PANTONE 13-6006 Almost Aqua
          "mint-light": "#E2E7DC",
          peach: "#F0D8CC", // PANTONE 12-1107 Peach Dust
          "peach-light": "#F8EAE3",
          coral: "#EBD8DB", // PANTONE 11-1400 Raindrops on Roses
          "coral-light": "#F5ECEE",
          pink: "#EBD8DB", // PANTONE 11-1400 Raindrops on Roses
          blue: "#D3E4F1", // PANTONE 13-4306 Ice Melt
          "blue-light": "#E9F1F8",
          yellow: "#F6EBC8", // PANTONE 11-0515 Lemon Icing
          "yellow-light": "#FAF4E1",
          lavender: "#DBD2DB", // PANTONE 13-3802 Orchid Tint
          "lavender-light": "#EDE7ED",
          nimbus: "#D5D5D8", // PANTONE 13-4108 Nimbus Cloud
        },
        background: "#F0EEE9", // PANTONE 11-4201 Cloud Dancer
        foreground: "#171717",
        primarySurface: "#F8F6F2",
        cardBackground: "#FFFFFF",
        gold: {
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
        textSecondary: "#5F5F5A",
        borderGold: "rgba(212,175,55,0.15)",
      },
      spacing: {
        "8": "8px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "64": "64px",
        "96": "96px",
        "128": "128px",
      },
      boxShadow: {
        "editorial-sm": "0 1px 3px rgba(23, 23, 23, 0.04), 0 2px 6px rgba(23, 23, 23, 0.02)",
        "editorial": "0 2px 8px -2px rgba(23, 23, 23, 0.04), 0 8px 20px -4px rgba(23, 23, 23, 0.06)",
        "editorial-md": "0 4px 16px -2px rgba(23, 23, 23, 0.06), 0 16px 32px -6px rgba(23, 23, 23, 0.08)",
        "editorial-lg": "0 8px 24px -4px rgba(23, 23, 23, 0.08), 0 24px 48px -12px rgba(23, 23, 23, 0.12)",
        "luxury": "0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        "luxury-md": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "luxury-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        "luxury-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        "gold-ambient": "0 0 0 1px rgba(212, 175, 55, 0.05), 0 4px 20px -4px rgba(212, 175, 55, 0.08)",
        "gold-elevated": "0 0 0 1px rgba(212, 175, 55, 0.08), 0 12px 40px -8px rgba(0, 0, 0, 0.6)",
        "gold-lg": "0 0 0 1px rgba(212, 175, 55, 0.1), 0 24px 56px -12px rgba(0, 0, 0, 0.7)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        cursive: ["var(--font-caveat)", "Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
