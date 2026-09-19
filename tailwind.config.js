/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ede5',
          200: '#ceddce',
          500: '#648b67',
          700: '#436146',
          900: '#253827',
        },
        warm: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#ebe3d7',
          800: '#453c34',
        }
      },
      animation: {
        'breathe-slow': 'breathe 19s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '21%': { transform: 'scale(1.4)' },
          '57%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}