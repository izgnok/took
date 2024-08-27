/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
          '100%': { transform: 'rotate(-3deg)' },
        },
        jump: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        semijump: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        shake: 'shake 0.6s ease-in-out infinite',
        jump: 'jump 0.6s ease-in-out infinite',
        semijump: 'semijump 0.6s ease-in-out infinite',
      },
      colors: {
        main: '#FF7F50',
        secondary: '#FFF7ED',
      },
      fontFamily: {
        dela: ['"Dela Gothic One"', 'sans-serif'],
        nanum: ['"Noto Sans KR"', 'sans-serif'],
        noto: ['Noto Serif', 'serif'],
      },
    },
    fontFamily: {
      sans: ['"Nanum Gothic"', 'sans-serif'],
    },
  },
  plugins: [],
};
