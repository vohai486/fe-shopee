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
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "grey-0": "#fff",
        "grey-100": "#fafbfe",
        "grey-200": "#eaecf3",
        "grey-300": "#c0ccda",
        "grey-400": "#f2f2f2",
        "grey-500": "#e9ecef",
        "grey-600": "#ebebeb",

        "blue-50": "#62759D",
        "blue-100": "#718096",
        "blue-200": "#008AFF",
        "blue-300": "#152c5b",
        "blue-400": "#253649",
        "blue-500": "#1F2D3D",
        "blue-600": "#2c4056",
        "blue-700": "#0E0B2B",

        "yellow-0": "#ffc107",
        "yellow-100": "#F8D62B",
        "yellow-200": "#ffce3d",

        "black-0": "#000",
        "black-100": "#212529",

        "red-100": "#DC3545",
        "red-200": "#f73164",

        "green-50": "#51BB25",

        backdrop: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.3)",
        },
      },
      boxShadow: {
        "sm-50": "0 0 1.25rem rgba(31, 45, 61, 0.05)",

        "sm-light": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "sm-dark": "0 1px 2px rgba(0, 0, 0, 0.4)",
        "md-light": "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)",
        "md-dark": "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3)",
        "lg-light": "0 2.4rem 3.2rem rgba(0, 0, 0, 0.12)",
        "lg-dark": "0 2.4rem 3.2rem rgba(0, 0, 0, 0.4)",
      },
      grayscale: {
        light: "0",
        dark: "10%",
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
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          // paddingTop: theme("spacing.4"),
          // paddingBottom: theme("spacing[2.5]"),
          padding: "0 12px",
          "@media screen and (min-width: 1200px)": {
            padding: "0",
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

// colors: {
//   "grey-0": {
//     DEFAULT: "#fff",
//     dark: "#18212f",
//   },
//   "grey-50": {
//     DEFAULT: "#f9fafb",
//     dark: "#111827",
//   },
//   "grey-100": {
//     DEFAULT: "#f3f4f6",
//     dark: "#1f2937",
//   },
//   "grey-200": {
//     DEFAULT: "#e5e7eb",
//     dark: "#374151",
//   },
//   "grey-300": {
//     DEFAULT: "#d1d5db",
//     dark: "#4b5563",
//   },
//   "grey-400": {
//     DEFAULT: "#9ca3af",
//     dark: "#6b7280",
//   },
//   "grey-500": {
//     DEFAULT: "#6b7280",
//     dark: "#9ca3af",
//   },
//   "grey-600": {
//     DEFAULT: "#4b5563",
//     dark: "#d1d5db",
//   },
//   "grey-700": {
//     DEFAULT: "#374151",
//     dark: "#e5e7eb",
//   },
//   "grey-800": {
//     DEFAULT: "#1f2937",
//     dark: "#f3f4f6",
//   },
//   "grey-900": {
//     DEFAULT: "#111827",
//     dark: "#f9fafb",
//   },
//   "blue-100": {
//     DEFAULT: "#e0f2fe",
//     dark: "#075985",
//   },
//   "blue-700": {
//     DEFAULT: "#0369a1",
//     dark: "#e0f2fe",
//   },
//   "green-100": {
//     DEFAULT: "#dcfce7",
//     dark: "#166534",
//   },
//   "green-700": {
//     DEFAULT: "#15803d",
//     dark: "#dcfce7",
//   },
//   "yellow-100": {
//     DEFAULT: "#fef9c3",
//     dark: "#854d0e",
//   },
//   "yellow-300": {
//     DEFAULT: "#ffce3d",
//   },
//   "yellow-700": {
//     DEFAULT: "#a16207",
//     dark: "#fef9c3",
//   },
//   "silver-100": {
//     DEFAULT: "#e5e7eb",
//     dark: "#374151",
//   },
//   "silver-700": {
//     DEFAULT: "#374151",
//     dark: "#f3f4f6",
//   },
//   "indigo-100": {
//     DEFAULT: "#e0e7ff",
//     dark: "#3730a3",
//   },
//   "indigo-700": {
//     DEFAULT: "#4338ca",
//     dark: "#e0e7ff",
//   },
//   "red-100": {
//     DEFAULT: "#fee2e2",
//     dark: "#fee2e2",
//   },
//   "red-700": {
//     DEFAULT: "#b91c1c",
//     dark: "#b91c1c",
//   },
//   "red-800": {
//     DEFAULT: "#991b1b",
//     dark: "#991b1b",
//   },
//   "backdrop-color": {
//     DEFAULT: "rgba(255, 255, 255, 0.1)",
//     dark: "rgba(0, 0, 0, 0.3)",
//   },
//   "brand-50": "#eef2ff",
//   "brand-100": "#e0e7ff",
//   "brand-200": "#c7d2fe",
//   "brand-500": "#6366f1",
//   "brand-600": "#4f46e5",
//   "brand-700": "#4338ca",
//   "brand-800": "#3730a3",
//   "brand-900": "#312e81",

//   orange: "#00ab9f",
//   orange1: "#00ab9f",
//   black: "#333333",
//   blue: "#0000EE",
//   gray: "#f7f7f7",
//   gray1: "#EAEAEA",
//   gray2: "#666",
//   gray3: "#E3E4E5",
//   gray4: "#999",
//   red: "#e4393c",
//   yellow: "#ffca11",
//   red1: "#ff424f",
//   black: "#000",
//   // orange1: "linear-gradient(-180deg,#f53d2d,#f63)",
//   // orange: "#ee4d2d",
//   // gray: "#f5f5f5",
//   // gray1: "rgba(0,0,0,.03)",
//   // gray2: "rgba(0,0,0,.54)",
//   // gray3: "rgba(0,0,0,.14)",
//   // gray4: "#767676",
//   // red: "#ee4d2d",
//   // blue: "#05a",
// },
