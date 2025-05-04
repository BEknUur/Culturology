// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',   // включаем переключение по классу
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0faff',
          500: '#0ea5e9',
          900: '#082f49',
        },
      },
    },
  },
  plugins: [],
};
