/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Typography
      fontFamily: {
        mono: ["var(--font-mono)", "'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["var(--font-display)", "'Space Mono'", "monospace"],
        sans: ["var(--font-sans)", "'DM Sans'", "sans-serif"],
      },
      
      // Color System
      colors: {
        void: "#080808",
        surface: "#0e0e0e",
        card: "#141414",
        border: "#1f1f1f",
        amber: {
          glow: "#f5a623",
          DEFAULT: "#f5a623",
          muted: "#a87016",
          dim: "#2a1c08",
        },
        text: {
          primary: "#f0ece0",
          secondary: "#7a7570",
          muted: "#3d3a35",
        },
      },
      
      // Animations
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "flicker": "flicker 8s infinite",
        "scanline": "scanline 6s linear infinite",
      },
      
      // Keyframes
      keyframes: {
        fadeUp: {
          "0%": { 
            opacity: "0", 
            transform: "translateY(24px)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        flicker: {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.85" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.9" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      
      // Background Patterns
      backgroundImage: {
        "grid-pattern": [
          "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)"
        ].join(", "),
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      
      backgroundSize: {
        "grid": "40px 40px",
      },
      
      // Animation Delays (for stagger effects)
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
};