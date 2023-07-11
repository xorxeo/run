/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  theme: {
    extend: {},
    screens: {
      s: '320px',
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.sidebar-item': {
          '@apply flex h-10 w-[100%] mt-1 mb-1 items-center justify-center cursor-pointer border rounded-lg':
            {},
        },
        '.button-active': {
          '@apply bg-yellow-500 text-black': {},
        },
        '.button-disabled': {
          '@apply bg-gray-300 text-black disabled': {},
        },
      });
    }),
    require('daisyui'),
  ],
  // daisyui: {
  //   themes: false,
  // },
  // daisyui: {
  //   styled: true,
  //   themes: [
  //     'light',
  //     'dark',
  //     'cupcake',
  //     'bumblebee',
  //     'emerald',
  //     'corporate',
  //     'synthwave',
  //     'retro',
  //     'cyberpunk',
  //     'valentine',
  //     'halloween',
  //     'garden',
  //     'forest',
  //     'aqua',
  //     'lofi',
  //     'pastel',
  //     'fantasy',
  //     'wireframe',
  //     'black',
  //     'luxury',
  //     'dracula',
  //     'cmyk',
  //     'autumn',
  //     'business',
  //     'acid',
  //     'lemonade',
  //     'night',
  //     'coffee',
  //     'winter',
  //   ],
  //   base: true,
  //   utils: true,
  //   logs: true,
  //   rtl: false,
  //   prefix: '',
  //   // darkTheme: 'dark',
  // },
};
