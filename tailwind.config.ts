import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      colors: {
        molt: {
          bg: {
            DEFAULT: "#27173b",
            secondary: "#302447",
            tertiary: "#1c1627",
            card: "#3d3154",
            hover: "#443959",
          },
          pink: {
            DEFAULT: "#f5217f",
            light: "#ff87bc",
            hover: "#ff62a5",
          },
          purple: {
            DEFAULT: "#9775fb",
            light: "#bb9bff",
            deep: "#6F5DFF",
          },
          blue: {
            DEFAULT: "#7986ff",
            deep: "#6F5DFF",
          },
          green: {
            DEFAULT: "#48d294",
            bright: "#3fb950",
          },
          orange: {
            DEFAULT: "#FFA243",
          },
          stroke: {
            DEFAULT: "#572596",
            light: "rgba(255,255,255,0.1)",
          },
          text: {
            primary: "#ebe7f3",
            secondary: "#998db0",
            muted: "#695c82",
          },
        },
        data: {
          positive: "#3fb950",
          negative: "#f85149",
          neutral: "#8b949e",
        },
      },
      borderRadius: {
        molt: "20px",
        "molt-sm": "12px",
        "molt-lg": "24px",
      },
      backgroundImage: {
        "molt-gradient":
          "linear-gradient(135deg, #27173b 0%, #302447 50%, #39173f 100%)",
        "molt-card":
          "linear-gradient(135deg, rgba(61, 49, 84, 0.6) 0%, rgba(48, 36, 71, 0.4) 100%)",
        "molt-accent":
          "linear-gradient(135deg, #f5217f 0%, #9775fb 100%)",
        "molt-button":
          "linear-gradient(100deg, #4e52b7 -17%, #755bae 37%, #8a67c3 80%)",
        "molt-hero":
          "radial-gradient(ellipse at 50% 0%, rgba(245, 33, 127, 0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        "molt-glow": "0 0 20px rgba(245, 33, 127, 0.15)",
        "molt-card": "0 4px 24px rgba(0, 0, 0, 0.3)",
        "molt-purple": "0 0 30px rgba(151, 117, 251, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
        "matrix-1": "matrixScroll 60s linear infinite",
        "matrix-2": "matrixScroll 75s linear infinite",
        "matrix-3": "matrixScroll 50s linear infinite",
        "matrix-4": "matrixScroll 90s linear infinite",
        "matrix-5": "matrixScroll 65s linear infinite",
        "matrix-6": "matrixScroll 80s linear infinite",
        "matrix-7": "matrixScroll 100s linear infinite",
        "chain-fire-1": "chainFire 7s ease-in-out infinite",
        "chain-fire-2": "chainFire 10s ease-in-out infinite",
        "chain-fire-3": "chainFire 6s ease-in-out infinite",
        "chain-fire-4": "chainFire 12s ease-in-out infinite",
        "chain-fire-5": "chainFire 8s ease-in-out infinite",
        "chain-fire-6": "chainFire 11s ease-in-out infinite",
        "chain-fire-7": "chainFire 5.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 33, 127, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 33, 127, 0.3)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        matrixScroll: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        chainFire: {
          "0%, 75%, 100%": {
            boxShadow: "inset 0 0 0 transparent",
            borderColor: "rgba(255,255,255,0.1)",
          },
          "82%": {
            boxShadow: "inset 0 0 14px rgba(151,117,251,0.3), 0 0 10px rgba(151,117,251,0.3)",
            borderColor: "rgba(151,117,251,0.5)",
          },
          "88%": {
            boxShadow: "inset 0 0 20px rgba(245,33,127,0.3), 0 0 14px rgba(245,33,127,0.4)",
            borderColor: "rgba(245,33,127,0.5)",
          },
          "93%": {
            boxShadow: "inset 0 0 6px rgba(151,117,251,0.15), 0 0 4px rgba(151,117,251,0.15)",
            borderColor: "rgba(151,117,251,0.3)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
