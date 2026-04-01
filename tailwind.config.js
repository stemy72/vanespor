/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FBF9F6',
          100: '#F7F3EE',
          200: '#F0ECE5',
          300: '#E8E0D4',
          400: '#D4C8B8',
          500: '#B5A898',
          600: '#8C7E6A',
          700: '#6B5F50',
          800: '#4A4035',
          900: '#2C2416',
          950: '#1A1714',
        },
        terra: {
          400: '#E08A5E',
          500: '#D4764E',
          600: '#B85A35',
        },
        forest: {
          400: '#6B9E6A',
          500: '#5B8C5A',
          600: '#4A7449',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
