module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  daisyui: {
    themes: ['dark']
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide')
    // ...
  ]
};
