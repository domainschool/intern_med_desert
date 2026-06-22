/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep modern dashboard colors
        brand: {
          emerald: '#10b981',
          teal: '#14b8a6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
    },
  },
  plugins: [],
}
