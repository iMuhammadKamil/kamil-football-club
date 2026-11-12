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
          DEFAULT: "#090D10",
          card: "#0C1611",
          elevated: "#0F1D16",
          border: "#17261E",
          muted: "#707070",
        },
        pitch: {
          obsidian: "#090D10",
          surface: "#0D1914",
          card: "#0C1611",
          charcoal: "#232325",
          border: "#17261E",
          teal: "#00C2A1",
          green: "#00E575",
          amber: "#FFB300",
          alert: "#E94A10",
        },
        neon: {
          green: "#00E575",
          cyan: "#00C2A1",
          yellow: "#FFB300",
          orange: "#E94A10",
          purple: "#B347FF",
          rose: "#E94A10",
        },
      },
      boxShadow: {
        "neon-green": "0 0 20px -3px rgba(0, 229, 117, 0.35)",
        "neon-cyan": "0 0 20px -3px rgba(0, 194, 161, 0.35)",
        "neon-orange": "0 0 20px -3px rgba(233, 74, 16, 0.35)",
        "neon-yellow": "0 0 20px -3px rgba(255, 179, 0, 0.35)",
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

