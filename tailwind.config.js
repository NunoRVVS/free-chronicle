/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandstorm: '#ECD540', // Replace this hex with the shade you want
      },
    },
  },
  plugins: [],
}