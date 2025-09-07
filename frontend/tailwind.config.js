/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cisco: {
          blue: '#1B365D',
          lightblue: '#00BCE5',
          orange: '#FF6900',
          green: '#00A651',
          red: '#E31E24',
        },
        elastic: {
          blue: '#00A651',
          dark: '#1A1A1A',
          light: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
