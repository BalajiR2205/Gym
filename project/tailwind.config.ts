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
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        primarySurface: "#141414",
        cardBackground: "#1A1A1A",
        gold: {
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
        textSecondary: "#BDBDBD",
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
        "luxury": "0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        "luxury-md": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "luxury-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        "luxury-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        "gold-ambient": "0 0 0 1px rgba(212, 175, 55, 0.05), 0 4px 20px -4px rgba(212, 175, 55, 0.08)",
        "gold-elevated": "0 0 0 1px rgba(212, 175, 55, 0.08), 0 12px 40px -8px rgba(0, 0, 0, 0.6)",
        "gold-lg": "0 0 0 1px rgba(212, 175, 55, 0.1), 0 24px 56px -12px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
