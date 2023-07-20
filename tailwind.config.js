import { fontFamily } from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

export const content = [
  './app/**/*.{js,ts,jsx,tsx}',
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx}',
];
export const mode = 'jit';
export const theme = {
  extend: {
    colors: {
      customGray: 'rgb(242, 242, 242)',
    },
    fontFamily: {
      wideFont: ['var(--wideFont)', ...fontFamily.sans],
      orbitron: ['Orbitron', ...fontFamily.sans],
    },
  },
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
};
export const plugins = [
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
        '@apply h-[3rem] opacity-50 bg-customGray flex justify-between gap-10 items-center font-semibold select-none text-black disabled font-semibold gap-[0.5rem] uppercase leading-4 text-[0.875rem] rounded-[0.5rem] pl-[1rem] pr-[1rem] border-[1px] border-[#FBBD23]':
          {},
      },
    });
  }),
  require('daisyui'),
];
