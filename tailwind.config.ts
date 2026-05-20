import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#20123a",
        mint: "#6d4aff",
        leaf: "#17b26a",
        paper: "#fbf8ff",
        line: "#e8ddff",
        gold: "#ffcc33",
        skysoft: "#eaf6ff",
        lilac: "#efe8ff"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(73, 34, 148, 0.13)",
        glow: "0 24px 80px rgba(109, 74, 255, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
