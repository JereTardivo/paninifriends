import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        panini: {
          dark: "#0f172a",
          card: "#1e293b",
          border: "#334155",
          blue: "#3b82f6",
          gold: "#f59e0b",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};

export default config;
