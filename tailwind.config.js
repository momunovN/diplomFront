/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e50914",
        secondary: "#ff9b00",
        dark: "#141414",
        bg: "#000000",
        "bg-secondary": "#181818",
        text: "#ffffff",
        "text-secondary": "#b3b3b3",
      },
    },
  },
  plugins: [],
  extend: {
    colors: {
      primary: "#ffcc00", // ярко-жёлтый Kinopoisk
      "primary-dark": "#e6b800",
      secondary: "#000000",
      bg: "#0f0f0f", // почти чёрный фон
      "bg-secondary": "#1a1a1a",
      "bg-card": "#141414",
      text: "#ffffff",
      "text-secondary": "#bbbbbb",
      accent: "#ffcc00",
    },
    fontFamily: {
      sans: ['"PT Sans"', "Inter", "system-ui", "sans-serif"], // ближе к Kinopoisk
    },
  },
};
