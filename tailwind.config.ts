import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#651D32",
          dark: "#471221",
          light: "#832641",
        },
        hotpink: {
          DEFAULT: "#F04476",
          hover: "#D93665",
          soft: "#FDE8EF",
        },
        cream: {
          DEFAULT: "#F3EBDD",
          light: "#FAF6F0",
          dark: "#E3D5C0",
        },
        charcoal: {
          DEFAULT: "#191719",
          muted: "#353235",
          border: "#4A464A",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
