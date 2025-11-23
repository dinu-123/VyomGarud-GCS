/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vgBg: "#020617",          // dark background
        vgPanel: "#020617",       // side panels
        vgAccent: "#38bdf8",      // cyan accent
        vgAccentSoft: "#0ea5e9",
        vgDanger: "#f97373",
      },
    },
  },
  plugins: [],
};
