/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shadowLow: "var(--shadow-low)",
        shadowHigh: "var(--shadow-high)",
        primary: "var(--primary)",
        primaryHover: "var(--primary-hover)",
        danger: "var(--danger)",
        success: "var(--success)",
        warning: "var(--warning)",
        main: "var(--main)",
        infoDark: "var(--info-dark)",
        dark: "var(--dark)",
        light: "var(--light)",
        darkVariant: "var(--dark-variant)",
        background: "var(--background)",
        darkGreen: "var(--dark-green)",
        white: "var(--white)",
        disabledButton: "var(--disabled-button)",
        transparent: "rgba(0, 0, 0, 0)",
        darkenBlue: "var(--darken-blue)",
      },
      boxShadow: {
        default: "0 0 1.6rem var(--color-background)",
        "4xl": "0 0 2.4rem 0 rgba(0, 0, 0, 0.5)",
        high: "0 0 4.2rem 0 var(--shadow-low), 0 0 2.1rem 0 var(--shadow-high)",
      },
    },
  },
  plugins: [],
};