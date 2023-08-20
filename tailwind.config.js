const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        orange: "#00ab9f",
        orange1: "#00ab9f",
        black: "#333333",
        blue: "#0000EE",
        gray: "#f7f7f7",
        gray1: "#EAEAEA",
        gray2: "#666",
        gray3: "#E3E4E5",
        gray4: "#999",
        red: "#e4393c",
        yellow: "#ffca11",
        red1: "#ff424f",
        black: "#000",
        // orange1: "linear-gradient(-180deg,#f53d2d,#f63)",
        // orange: "#ee4d2d",
        // gray: "#f5f5f5",
        // gray1: "rgba(0,0,0,.03)",
        // gray2: "rgba(0,0,0,.54)",
        // gray3: "rgba(0,0,0,.14)",
        // gray4: "#767676",
        // red: "#ee4d2d",
        // blue: "#05a",
      },
      fontSize: {
        "13px": "13px",
      },
    },
    screens: {
      w400: "400px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
  },
  plugins: [
    require("daisyui"),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".container": {
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          // paddingTop: theme("spacing.4"),
          // paddingBottom: theme("spacing[2.5]"),
          padding: 0,

          "@media screen and (min-width: 768px) and (max-width: 1200px)": {
            padding: "0 10px",
          },
        },
        ".bg-header": {
          background: theme("colors.orange1"),
        },
        ".border-bottom": {
          borderBottom: "1px solid rgba(0,0,0,.05)",
        },
      });
    }),
    // require('@tailwindcss/line-clamp'),
  ],
};
