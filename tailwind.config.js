/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scans all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: 'green',
      },
    }, // you can add custom colors, fonts, etc.
  },
  plugins: [], // optional plugins
};
