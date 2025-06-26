/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        martina: [
          '"Martina Plantijn Regular"',
          '"Martina Plantijn Regular Placeholder"',
          'sans-serif'
        ],
        'br-sonoma-regular': [
          '"BR Sonoma Regular"',
          '"BR Sonoma Regular Placeholder"',
          'sans-serif'
        ],
        'br-sonoma-medium': [
          '"BR Sonoma Medium"',
          '"BR Sonoma Medium Placeholder"',
          'sans-serif'
        ],
      },
      fontWeight: {
        'br-regular': '400',
        'br-medium': '500',
      },
    },
  },
  plugins: [],
} 