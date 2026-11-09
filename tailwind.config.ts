import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#070A0F",
          card: "#0D131F",
          elevated: "#141E30",
          border: "#1E2C44",
          muted: "#64748B",
        },
        neon: {
          green: "#00FF87",
          cyan: "#00E5FF",
          yellow: "#D4FF00",
          orange: "#FF6B00",
          purple: "#B347FF",
          rose: "#FF3366",
        },
      },
      boxShadow: {
        "neon-green": "0 0 20px -3px rgba(0, 255, 135, 0.45)",
        "neon-cyan": "0 0 20px -3px rgba(0, 229, 255, 0.45)",
        "neon-orange": "0 0 20px -3px rgba(255, 107, 0, 0.45)",
        "neon-yellow": "0 0 20px -3px rgba(212, 255, 0, 0.45)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

