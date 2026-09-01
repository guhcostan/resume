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
        // Warm paper stock — the page IS the paper.
        paper: {
          DEFAULT: "#faf6ee",
          deep: "#f2ecdf",
          card: "#fffdf7",
        },
        // Warm near-black ink for type, rules and solid buttons.
        ink: {
          DEFAULT: "#1d1915",
          soft: "#4a4238",
          faint: "#8a7f70",
          line: "#e5dcc9",
          raised: "#28221c",
          border: "#3a322a",
        },
        // Editorial accents.
        clay: {
          DEFAULT: "#c2542a",
          deep: "#9a3f1d",
        },
        sage: "#5f7355",
        gold: "#c9972f",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        phone:
          "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px -12px rgba(29,25,21,0.55), 0 0 90px -30px rgba(194,84,42,0.5)",
        glow: "0 10px 44px -14px rgba(194,84,42,0.55)",
        card: "0 1px 2px rgba(29,25,21,0.05), 0 12px 32px -16px rgba(29,25,21,0.18)",
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
