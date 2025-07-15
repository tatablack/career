/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'silver': {
          100: '#F8F8F8',
          200: '#E8E8E8',
          300: '#D8D8D8',
          400: '#C0C0C0',
          500: '#A8A8A8',
          600: '#808080',
          700: '#606060',
          800: '#404040',
          900: '#202020',
        },
        'orange': {
          100: '#FFF3E0',
          200: '#FFE0B2',
          300: '#FFCC80',
          400: '#FFB74D',
          500: '#FF8C00',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
      },
      fontFamily: {
        'gothic': ['Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 140, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 140, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};