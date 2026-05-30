import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        foreground: "#F8FAFC",
        card: {
          DEFAULT: "#1E293B",
          foreground: "#F8FAFC",
        },
        border: "#334155",
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#334155",
          foreground: "#94A3B8",
        },
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        accent: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        card: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
