/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // Verde neon
        dark: '#0a0a0a',
        gray: '#1f1f1f',
      },
    },
  },
  plugins: [],
}
