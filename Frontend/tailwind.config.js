/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lawyer-gray': '#F5F5F5',
        'lawyer-blue': '#0071BC',
        'lawyer-gray-text': '#666666',
        'lawyer-gray-dark': '#999999',
        'lawyer-cyan': '#0071BC',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
