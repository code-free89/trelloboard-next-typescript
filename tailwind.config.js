module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        "96": "384px",
      },
      height: {
        "content": "fit-content"
      },
      minWidth: {
        "64": "16rem",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
