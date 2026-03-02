/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        walmart: { blue: "#0071CE", yellow: "#FFC220", dark: "#004F9A" },
      },
    },
  },
  plugins: [],
};

