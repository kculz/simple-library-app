module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5DBB63', // Leaf green
          dark: '#3A8D40',
        }
      }
    },
  },
  plugins: [],
}