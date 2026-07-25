import daisyui from "daisyui";

/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
            "on-tertiary-container": "#ffecd6",
            "on-tertiary": "#ffffff",
            "primary-fixed": "#ffdcc4",
            "primary": "#8b6447",
            "neutral": "#3f2a22",
            "on-surface": "#1f1b12",
            "on-tertiary-fixed": "#241a0b",
            "on-secondary-container": "#795d40",
            "inverse-on-surface": "#faefe0",
            "secondary-fixed-dim": "#e4c09d",
            "inverse-primary": "#edbd9a",
            "surface-bright": "#fff8f2",
            "on-error": "#ffffff",
            "primary-fixed-dim": "#edbd9a",
            "on-tertiary-fixed-variant": "#524533",
            "on-secondary": "#ffffff",
            "on-surface-variant": "#50443d",
            "inverse-surface": "#353026",
            "on-secondary-fixed": "#2a1702",
            "on-primary-container": "#ffebe0",
            "error-container": "#ffdad6",
            "on-primary-fixed-variant": "#613f25",
            "on-primary-fixed": "#2e1501",
            "on-secondary-fixed-variant": "#5b4227",
            "error": "#ba1a1a",
            "surface": "#F4EADB", /* Warm Champagne */
            "surface-dim": "#e2d9ca",
            "primary-container": "#8b6447",
            "surface-tint": "#7b563a",
            "surface-container-lowest": "#ffffff",
            "on-error-container": "#93000a",
            "tertiary-container": "#796a56",
            "tertiary-fixed": "#f4dfc7",
            "background": "#F4EADB", /* Warm Champagne */
            "surface-container-high": "#f1e7d8",
            "surface-container": "#f7edde",
            "secondary-fixed": "#ffdcbb",
            "on-background": "#1f1b12",
            "tertiary": "#e6d2ba",
            "surface-variant": "#ebe1d2",
            "tertiary-fixed-dim": "#d7c4ac",
            "secondary-container": "#ffd9b4",
            "secondary": "#c8a684",
            "outline-variant": "#d4c3b9",
            "outline": "#82746c",
            "surface-container-low": "#fcf2e3",
            "surface-container-highest": "#ebe1d2",
            "on-primary": "#ffffff"
          },
      fontFamily: {
        "display": ["Cormorant Garamond", "serif"],
        "body": ["Montserrat", "sans-serif"]
      },
      borderRadius: {
        "none": "0px",
        "sm": "0.125rem",
        "DEFAULT": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      }
    },
  },
  plugins: [daisyui],
  daisyui: { themes: ["light"] }
};
