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
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "heart-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%": { 
            transform: "translate(0, 100vh) rotate(0deg)",
            opacity: "0"
          },
          "10%": { 
            opacity: "1"
          },
          "100%": { 
            transform: "translate(var(--tw-float-x, -100px), -100vh) rotate(var(--tw-float-r, 360deg))",
            opacity: "0"
          }
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "heart-beat": "heart-beat 0.8s ease-in-out infinite",
        "heart-float": "heart-float 3s ease-in-out infinite",
        "float": "float 8s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-delayed": "fade-in-delayed 1s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "deal-card": "deal-card 0.5s ease-out",
        "gradient-x": "gradient 15s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
