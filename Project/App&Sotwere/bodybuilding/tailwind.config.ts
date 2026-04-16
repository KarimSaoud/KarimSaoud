import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#080808",
        panel: "#111111",
        panelSoft: "#171717",
        gold: "#d4af37",
        goldSoft: "#f1db8a",
        borderStrong: "rgba(212, 175, 55, 0.24)",
      },
      boxShadow: {
        stage: "0 24px 80px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(212, 175, 55, 0.14), 0 18px 40px rgba(212, 175, 55, 0.12)",
      },
      backgroundImage: {
        "stage-radial":
          "radial-gradient(circle at top, rgba(212, 175, 55, 0.22), transparent 32%), radial-gradient(circle at bottom, rgba(255,255,255,0.08), transparent 28%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};

export default config;
