/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chrome: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#1A1D21',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F5EBCF',
          400: '#E2B050',
          500: '#D4A437',
          600: '#B8922E',
        },
        silver: {
          400: '#C0C0C0',
          500: '#A8A8A8',
        },
        bronze: {
          400: '#CD7F32',
          500: '#B8702D',
        },
        status: {
          positive: '#4A9D6E',
          negative: '#C0524E',
          warning: '#D4A437',
          neutral: '#6C757D',
        },
      },
    },
  },
  plugins: [],
}
