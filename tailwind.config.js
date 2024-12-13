/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/aurelia-theme/layouts/**/*.html",
    "./themes/aurelia-theme/assets/js/**/*.js",
    "./content/**/*.md",
    "./content/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'aurelia': '#ed2b88',
        'aurelia-light': '#ff4da1',
        'aurelia-blue': '#003F8C',
        'aurelia-blue-light': '#0066CC',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 