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
        brand: {
          DEFAULT: "#8b5cf6",
          fg: "#7c3aed",
        },
        accent: {
          DEFAULT: "#22d3ee",
        },
        ink: {
          // Near-black canvas used for the dark theme and the phone screen.
          DEFAULT: "#07080c",
          raised: "#0d0f16",
          border: "#1c1f2b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        phone:
          "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px -12px rgba(0,0,0,0.65), 0 0 80px -20px rgba(139,92,246,0.35)",
        glow: "0 0 40px -8px rgba(139,92,246,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
