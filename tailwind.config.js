/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e5ff',
          200: '#80d3ff',
          300: '#4dc1ff',
          400: '#26aff0',
          500: '#119bd6',
          600: '#0d8ac0',
          700: '#0a79aa',
          800: '#076894',
          900: '#04577e',
          DEFAULT: '#119bd6',
        },
        danger: {
          50: '#ffebeb',
          100: '#ffc7c8',
          200: '#ffa3a5',
          300: '#ff7f82',
          400: '#ff5b5e',
          500: '#eb2225',
          600: '#d41e21',
          700: '#bd1a1d',
          800: '#a61619',
          900: '#8f1215',
          DEFAULT: '#eb2225',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #119bd6 0%, #0d8ac0 100%)',
        'gradient-danger': 'linear-gradient(135deg, #eb2225 0%, #d41e21 100%)',
        'gradient-primary-danger':
          'linear-gradient(135deg, #119bd6 0%, #eb2225 100%)',
        'gradient-danger-primary':
          'linear-gradient(135deg, #eb2225 0%, #119bd6 100%)',
      },
      boxShadow: {
        primary: '0 4px 14px 0 rgba(17, 155, 214, 0.39)',
        'primary-lg': '0 10px 25px 0 rgba(17, 155, 214, 0.5)',
        danger: '0 4px 14px 0 rgba(235, 34, 37, 0.39)',
        'danger-lg': '0 10px 25px 0 rgba(235, 34, 37, 0.5)',
      },
      ringColor: {
        primary: '#119bd6',
        danger: '#eb2225',
      },
      borderColor: {
        primary: '#119bd6',
        danger: '#eb2225',
      },
      animation: {
        'mh-shimmer': 'mh-shimmer 1.5s ease infinite',
        'mh-glow': 'mh-glow 4s ease-in-out infinite',
        'mh-ripple': 'mh-ripple 1.8s ease-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'mh-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'mh-glow': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.65' },
        },
        'mh-ripple': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.18' },
          '50%': { opacity: '0.40' },
        },
      },
    },
  },
  plugins: [],
};
