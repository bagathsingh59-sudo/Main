import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  // Dark mode applies only inside the admin shell (`[data-admin-theme="dark"]`
  // on <html>), so the public marketing site is unaffected.
  darkMode: ['selector', '[data-admin-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0b1f3a",
          50: "#f0f4ff",
          100: "#dce8ff",
          200: "#b8d0ff",
          300: "#8fb1ff",
          400: "#5f8aff",
          500: "#3a64f5",
          600: "#1a56db",
          700: "#1442a8",
          800: "#0d2d6a",
          900: "#0b1f3a",
          950: "#06122a",
        },
        teal: {
          DEFAULT: "#0891b2",
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        ink: "#0b1f3a",
        mist: "#eef2ff",
        cloud: "#f5f8ff",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "DM Serif Display", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 8px 40px rgba(11, 31, 58, 0.10)",
        elevated: "0 20px 60px rgba(11, 31, 58, 0.18)",
        glow: "0 0 60px rgba(26, 86, 219, 0.35)",
        "glow-teal": "0 0 60px rgba(8, 145, 178, 0.4)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #1a56db 0%, #0891b2 100%)",
        "gradient-mist": "linear-gradient(165deg, #dce8ff 0%, #eef2ff 50%, #e0f7fa 100%)",
        "grid-light": "linear-gradient(rgba(11,31,58,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(11,31,58,0.05) 1px,transparent 1px)",
      },
      backdropBlur: { xs: "2px" },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
