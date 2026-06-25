/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2563eb",
          secondary: "#4f46e5",
          accent: "#06b6d4",
          neutral: "#1f2937",
          "base-100": "#ffffff",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3b82f6",
          secondary: "#6366f1",
          accent: "#22d3ee",
          neutral: "#f3f4f6",
          "base-100": "#0f172a",
        },
      },
    ],
  },
}
