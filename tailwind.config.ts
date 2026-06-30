import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAF8F5",
          dark: "#0A0908",
        },
        ink: {
          DEFAULT: "#1A1814",
          muted: "#6B6560",
          faint: "#A8A29E",
          dark: "#F5F0EB",
          "muted-dark": "#A8A29E",
        },
        accent: {
          DEFAULT: "#C45C26",
          soft: "#F4E4D7",
          dark: "#E8956A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#F3EFEA",
          dark: "#141210",
          "raised-dark": "#1F1C19",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,24,20,0.04), 0 8px 24px rgba(26,24,20,0.06)",
        "card-dark":
          "0 1px 2px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(196,92,38,0.15), 0 12px 40px rgba(196,92,38,0.12)",
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out both",
        "slide-up": "slide-up 0.7s ease-out both",
        "grain": "grain 8s steps(10) infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -2%)" },
          "30%": { transform: "translate(1%, -3%)" },
          "50%": { transform: "translate(-1%, 2%)" },
          "70%": { transform: "translate(2%, 1%)" },
          "90%": { transform: "translate(-2%, 2%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
