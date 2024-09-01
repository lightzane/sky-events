import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  // prettier-ignore
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        enter: 'enter .5s ease-in-out forwards',
      },
      keyframes: {
        enter: {
          from: {
            opacity: 0,
            // filter: 'blur(12px)',
            // transform: 'translateX(1.25rem)',
            transform: 'scale(1.25rem)',
          },
          to: {
            opacity: 1,
            // filter: 'blur(0)',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
