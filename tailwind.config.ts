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
          red: "#FF0000",      // Vermelho (1)
          blue: "#0000FF",     // Azul (2)
          black: "#000000",    // Preto (3)
          yellow: "#FFD700",   // Amarelo (4)
          green: "#00FF00",    // Verde (5)
          purple: "#800080",   // Roxo (6)
          pink: "#FF69B4",     // Rosa (7)
          brown: "#8B4513",    // Marrom (8)
          gray: "#808080",     // Cinza (9)
          white: "#FFFFFF",    // Branco (0)
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-delayed": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "50%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "deal-card": {
          "0%": { 
            transform: "translateY(-100px) rotate(-20deg)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "1"
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
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0) rotate(0deg)",
          },
          "33%": {
            transform: "translateY(-40px) translateX(30px) rotate(15deg)",
          },
          "66%": {
            transform: "translateY(-20px) translateX(-30px) rotate(-15deg)",
          }
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
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-delayed": "fade-in-delayed 1s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "deal-card": "deal-card 0.5s ease-out",
        "gradient-x": "gradient 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
