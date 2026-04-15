/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Outfit\"", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px -25px rgba(24, 39, 75, 0.45)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 500ms ease-out both",
      },
    },
  },
  plugins: [],
};
