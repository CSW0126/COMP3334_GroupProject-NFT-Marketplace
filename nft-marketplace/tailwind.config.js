module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/styles/*", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },

  plugins: [
    require('flowbite/plugin')
  ],
};
