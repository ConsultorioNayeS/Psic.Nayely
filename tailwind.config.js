/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ede5',
          200: '#c8dac8',
          300: '#9dbf9d',
          400: '#6f9e71',
          500: '#4e7e52',
          600: '#3e6542',
          700: '#335236',
          800: '#2a422d',
          900: '#1d2f20',
          950: '#0e1810',
        },
        sanctuary: {
          bg: '#faf8f5',
          card: '#ffffff',
          sand: '#f2ece4',
          linen: '#e7decfa0',
          ink: '#1c1917',
          subtle: '#78716c',
        },
        goldleaf: {
          50: '#fdfbf7',
          100: '#f8f2e6',
          500: '#b88a44',
          600: '#996f30',
          700: '#7a5522',
        }
      },
      boxShadow: {
        'ambient': '0 10px 30px -10px rgba(42, 66, 45, 0.05), 0 20px 40px -15px rgba(28, 25, 23, 0.04)',
        'luxe': '0 20px 45px -12px rgba(29, 47, 32, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'glow-sage': '0 0 35px -5px rgba(78, 126, 82, 0.25)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      },
      animation: {
        'breathe-aurora': 'aurora 14s ease-in-out infinite alternate',
        'soft-float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'scale(1) translate(0%, 0%)', opacity: 0.4 },
          '50%': { transform: 'scale(1.25) translate(4%, -6%)', opacity: 0.65 },
          '100%': { transform: 'scale(0.95) translate(-3%, 4%)', opacity: 0.4 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}