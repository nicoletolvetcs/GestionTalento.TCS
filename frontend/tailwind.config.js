/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta línea cubre TODO dentro de src, incluyendo componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
