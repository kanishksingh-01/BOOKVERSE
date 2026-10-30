import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bookverse: {
          ivory: "#F8F5EF",
          espresso: "#3D3028",
          terracotta: {
            DEFAULT: "#B87555",
            hover: "#A36345",
            light: "#F7ECE7",
          },
          sage: {
            DEFAULT: "#89917B",
            hover: "#737B65",
            light: "#F0F2EE",
          },
          cream: "#FFFDF8",
          beige: {
            DEFAULT: "#EDE5D9",
            dark: "#D6C7B3",
          },
          charcoal: "#231F20",
          sand: "#FAF7F2",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        book: "0 10px 30px -10px rgba(61, 48, 40, 0.15)",
        "book-hover": "0 20px 40px -12px rgba(61, 48, 40, 0.25)",
        warm: "0 4px 20px -2px rgba(184, 117, 85, 0.12)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
