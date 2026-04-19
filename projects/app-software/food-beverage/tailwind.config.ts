import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "#dde4df",
        input: "#dde4df",
        ring: "#8ea89b",
        background: "#f6f5f0",
        foreground: "#16211b",
        primary: {
          DEFAULT: "#1e3b2d",
          foreground: "#f8fbf9"
        },
        secondary: {
          DEFAULT: "#e6ece6",
          foreground: "#23362c"
        },
        muted: {
          DEFAULT: "#edf1eb",
          foreground: "#617166"
        },
        accent: {
          DEFAULT: "#d9e4d6",
          foreground: "#1f3428"
        },
        card: {
          DEFAULT: "#fbfcf8",
          foreground: "#16211b"
        },
        destructive: {
          DEFAULT: "#9b3d32",
          foreground: "#fff7f5"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(22, 33, 27, 0.08)"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
