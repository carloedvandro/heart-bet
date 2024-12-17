import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        heart: {
          red: "#FF0000",
          blue: "#0000FF",
          black: "#000000",
          yellow: "#FFD700",
          green: "#00FF00",
          purple: "#800080",
          pink: "#FF69B4",
          brown: "#8B4513",
          gray: "#808080",
          white: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        float: {
          "0%": { 
            transform: "translate(0, 100vh) rotate(0deg) scale(1)",
            opacity: "0"
          },
          "10%": { 
            opacity: "1"
          },
          "50%": {
            transform: "translate(var(--float-x, -100px), 0) rotate(var(--float-r, 180deg)) scale(1.2)",
          },
          "100%": { 
            transform: "translate(var(--float-x, -100px), -100vh) rotate(var(--float-r, 360deg)) scale(1)",
            opacity: "0"
          }
        },
        pulse: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.1)",
          },
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      animation: {
        "float": "float 12s linear infinite",
        "pulse": "pulse 2s ease-in-out infinite",
        "gradient-x": "gradient 15s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;