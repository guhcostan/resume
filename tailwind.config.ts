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
          DEFAULT: "#ff4f1f",
          fg: "#cf360d",
        },
        accent: {
          DEFAULT: "#7c3aed",
        },
        signal: {
          DEFAULT: "#b9f34a",
        },
        canvas: {
          DEFAULT: "#f2f0e9",
        },
        paper: {
          DEFAULT: "#fbfaf6",
        },
        ink: {
          DEFAULT: "#11110f",
          raised: "#191916",
          border: "#302f2a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        phone:
          "0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px -22px rgba(0,0,0,0.8), 0 0 80px -28px rgba(255,79,31,0.5)",
        glow: "0 18px 45px -18px rgba(255,79,31,0.7)",
        editorial: "0 28px 80px -42px rgba(33,29,24,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(22px)",
            filter: "blur(6px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
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
        "fade-up": "fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
