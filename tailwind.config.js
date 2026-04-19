/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c5d8',
          300: '#8ca9c5',
          400: '#6b8db1',
          500: '#4a709e',
          600: '#355784',
          700: '#213d6b',
          800: '#1a2f52',
          900: '#152139',
        },
        gold: {
          50: '#fffbf0',
          100: '#fff7e0',
          200: '#ffe4b2',
          300: '#ffd684',
          400: '#ffc856',
          500: '#ffb81c',
          600: '#e6a500',
          700: '#bf8c00',
          800: '#997300',
          900: '#735500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
