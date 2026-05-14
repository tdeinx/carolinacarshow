/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        carolina: {
          blue: "#006dff",
          red: "#ff1f3d",
          gold: "#facc15",
        },
      },
    },
  },
  plugins: [],
};
