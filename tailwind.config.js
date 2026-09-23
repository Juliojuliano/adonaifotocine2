/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#141414",
          charcoal: "#232323",
          cream: "#FAF7F2",
          gold: "#C6A15B",
          golddark: "#A9823D",
          goldtext: "#8A6A2E",
          ink: "#2B2B2B"
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ["Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};
