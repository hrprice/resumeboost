/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          default: "hsl(var(--tw-color-primary))",
          light: "hsl(var(--tw-color-primary-light))",
          dark: "hsl(var(--tw-color-primary-dark))",
        },
        secondary: {
          default: "hsl(var(--tw-color-secondary))",
          light: "hsl(var(--tw-color-secondary-light))",
          dark: "hsl(var(--tw-color-secondary-dark))",
        },
        text: {
          primary: "hsl(var(--tw-color-text-primary))",
          secondary: "hsl(var(--tw-color-text-secondary))",
          muted: "hsl(var(--tw-color-text-muted))",
        },
        accent: "hsl(var(--tw-color-accent))",
        background: "hsl(var(--tw-color-background))",
        surface: "hsl(var(--tw-color-surface))",
        border: "hsl(var(--tw-color-border))",
        success: "hsl(var(--tw-color-success))",
        error: "hsl(var(--tw-color-error))",
        warning: "hsl(var(--tw-color-warning))",
        info: "hsl(var(--tw-color-info))",
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "15px",
        xl: "17px",
        "2xl": "21px",
        "3xl": "26px",
        "4xl": "36px",
        "5xl": "51px",
        "6xl": "64px",
        "7xl": "103px",
      },
      letterSpacing: {
        tightest: "-0.5px",
        tighter: "0px",
        tight: "0.25px",
        normal: "0.5px",
        wide: "1.25px",
        widest: "1.5px",
        h1: "-1.5px",
        h6: "0.15px",
        subtitle2: "0.1px",
        caption: "0.4px",
      },
    },
  },
  plugins: [],
});
