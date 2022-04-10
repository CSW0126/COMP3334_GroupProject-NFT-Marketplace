module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/styles/*", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  }, 
  plugins: [
    require('flowbite/plugin')
  ],
};
