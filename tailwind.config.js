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
        // --- Simple brand tokens (use these for any NEW code you write) ---
        cream: '#F4EADB',
        sand: '#E6D2BA',
        gold: '#C8A684',
        bronze: '#8B6447',
        espresso: '#3F2A22',

        // --- Semantic tokens used throughout the converted Stitch screens ---
        // (bg-surface, text-on-surface, bg-primary, etc.)
        // Stitch's own DESIGN.md drifted these to its own generated hex values;
        // every one below is corrected to map onto the 5 client-approved colors.
        surface: '#F4EADB',
        'surface-dim': '#E6D2BA',
        'surface-bright': '#F4EADB',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F4EADB',
        'surface-container': '#E6D2BA',
        'surface-container-high': '#E6D2BA',
        'surface-container-highest': '#E6D2BA',
        'surface-variant': '#E6D2BA',
        'surface-tint': '#8B6447',
        background: '#F4EADB',

        'on-surface': '#3F2A22',
        'on-surface-variant': '#3F2A22',
        'on-background': '#3F2A22',
        'inverse-surface': '#3F2A22',
        'inverse-on-surface': '#F4EADB',

        outline: '#C8A684',
        'outline-variant': '#C8A684',

        primary: '#8B6447',
        'primary-container': '#8B6447',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#FFFFFF',
        'inverse-primary': '#C8A684',
        'primary-fixed': '#E6D2BA',
        'primary-fixed-dim': '#C8A684',
        'on-primary-fixed': '#3F2A22',
        'on-primary-fixed-variant': '#3F2A22',

        secondary: '#8B6447',
        'secondary-container': '#E6D2BA',
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#3F2A22',
        'secondary-fixed': '#E6D2BA',
        'secondary-fixed-dim': '#C8A684',
        'on-secondary-fixed': '#3F2A22',
        'on-secondary-fixed-variant': '#3F2A22',

        tertiary: '#8B6447',
        'tertiary-container': '#E6D2BA',
        'on-tertiary': '#FFFFFF',
        'on-tertiary-container': '#3F2A22',
        'tertiary-fixed': '#E6D2BA',
        'tertiary-fixed-dim': '#C8A684',
        'on-tertiary-fixed': '#3F2A22',
        'on-tertiary-fixed-variant': '#3F2A22',

        error: '#BA1A1A',
        'error-container': '#FFDAD6',
        'on-error': '#FFFFFF',
        'on-error-container': '#93000A',
        success: '#2E7D32',
        
        // --- Legacy fallback aliases to prevent build errors in un-synced components ---
        'outline-gold': '#C8A684',
        'heading-espresso': '#3F2A22',
        'success-sage': '#4CAF50',
        'error-crimson': '#BA1A1A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        'display': ['"Cormorant Garamond"', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
        'display-lg': ['"Cormorant Garamond"', 'serif'],
        'display-lg-mobile': ['"Cormorant Garamond"', 'serif'],
        'headline-md': ['"Cormorant Garamond"', 'serif'],
        'headline-sm': ['"Cormorant Garamond"', 'serif'],
        'body-lg': ['Montserrat', 'sans-serif'],
        'body-base': ['Montserrat', 'sans-serif'],
        'label-caps': ['Montserrat', 'sans-serif'],
        'button-text': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        "display-lg-mobile": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-base": ["15px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "display-lg": ["56px", { "lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "button-text": ["14px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-caps": ["12px", { "lineHeight": "1", "letterSpacing": "0.15em", "fontWeight": "600" }],
        "headline-md": ["32px", { "lineHeight": "1.3", "fontWeight": "500" }],
        "headline-sm": ["24px", { "lineHeight": "1.4", "fontWeight": "500" }]
      },
      spacing: {
        "unit": "4px",
        "gutter": "24px",
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        "container-max": "1280px",
        "section-gap-sm": "64px",
        "section-gap-lg": "120px",
      },
      borderRadius: {
        "none": "0px",
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        "full": "9999px",
      },
      boxShadow: {
        "heritage": "0 20px 40px -10px rgba(139, 100, 71, 0.08)",
        "heritage-lg": "0 30px 60px -15px rgba(63, 42, 34, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "ken-burns": "kenBurns 20s ease-in-out infinite alternate",
        "scale-in": "scaleIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        fadeInUp: {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        scaleIn: {
          "from": { opacity: "0", transform: "scale(0.95)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: { themes: ["light"] },
};
