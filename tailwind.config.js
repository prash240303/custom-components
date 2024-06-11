/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      userSelect: {
        none: 'none',
      },
    },
  },
  variants: {
    userSelect: ['responsive'],
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.select-none': {
          userSelect: 'none',
          '-webkit-user-select': 'none', /* Safari */
          '-moz-user-select': 'none', /* Firefox */
          '-ms-user-select': 'none', /* Internet Explorer/Edge */
        },
      })
    },
  ],
};
