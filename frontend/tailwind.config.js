/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}", // Añadimos esto para asegurar
    "../src/**/*.{js,ts,jsx,tsx}", // Por si acaso el proceso corre desde un nivel distinto
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
