/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';


module.exports = {
  mode: 'jit',
  corePlugins: {
    // preflight: false,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // customGray: 'rgb(242, 242, 242)',
      },
      fontFamily: {
        // wideFont: ['var(--wideFont)', ...fontFamily.sans],
        // orbitron: ['Orbitron', ...fontFamily.sans],
      },
    },
    screens: {
      // s: '320px',
      // sm: '640px',
      // // => @media (min-width: 640px) { ... }
      // md: '768px',
      // // => @media (min-width: 768px) { ... }
      // lg: '1024px',
      // // => @media (min-width: 1024px) { ... }
      // xl: '1280px',
      // // => @media (min-width: 1280px) { ... }
      // '2xl': '1536px',
      // // => @media (min-width: 1536px) { ... }
    },
  },

  plugins: [
    // require('daisyui'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.sidebar-item': {
          '@apply flex h-12 w-[100%] items-center justify-center cursor-pointer border rounded-lg hover:border-[#FBBD23]':
            {},
        },
        '.button-active': {
          '@apply h-[3rem] flex justify-between gap-10 items-center font-semibold select-none text-black cursor-pointer font-semibold gap-[0.5rem] uppercase leading-4 text-[0.875rem] rounded-[0.5rem] pl-[1rem] pr-[1rem] border-[1px] border-[#FBBD23]':
            {},
        },
        '.button-disabled': {
          '@apply h-[3rem] opacity-50 bg-gray-100 flex justify-between gap-10 items-center font-semibold select-none text-black font-semibold gap-[0.5rem] uppercase leading-4 text-[0.875rem] rounded-[0.5rem] pl-[1rem] pr-[1rem] border-[1px] border-[#FBBD23]':
            {},
        },
        '.select': {
          '@apply min-h-[2rem]': {},
        },
      });
    }),
  ],

  // daisyui: {
  //   themes: ['light', 'dark', ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
  //   darkTheme: 'dark', // name of one of the included themes for dark mode
  //   base: true, // applies background color and foreground color for root element by default
  //   styled: true, // include daisyUI colors and design decisions for all components
  //   utils: true, // adds responsive and modifier utility classes
  //   rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
  //   prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
  //   logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  // },
};
