/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: '#FFFBDE',
        secondary: '#91C8E4',
        accent: '#749BC2',
        tone:"#4682A9",
      },
    },
  },
  plugins: [],
}

