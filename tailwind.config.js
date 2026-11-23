/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff6633',
          600: '#f53d2d',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        primary: {
          DEFAULT: 'var(--color-primary, #ff6633)',
          dark: 'var(--color-primary-hover, #f53d2d)',
          blue: '#1e40af',
        },
        themePrimary: 'var(--color-primary, #f53d2d)',
        themePrimaryHover: 'var(--color-primary-hover, #ea580c)',
        themePrimaryLight: 'var(--color-primary-light, #fff7ed)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
