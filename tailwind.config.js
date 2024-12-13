/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/aurelia-theme/layouts/**/*.html",
    "./themes/aurelia-theme/assets/js/**/*.js",
    "./themes/aurelia-theme/static/**/*.js",
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
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'grid': 'grid 20s linear infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-delayed': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        grid: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 