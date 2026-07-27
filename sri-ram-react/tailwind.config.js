/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        'display-lg': ['"Cormorant Garamond"', 'serif'],
        'display-lg-mobile': ['"Cormorant Garamond"', 'serif'],
        'headline-md': ['"Cormorant Garamond"', 'serif'],
        'headline-sm': ['"Cormorant Garamond"', 'serif'],
        'body-lg': ['Montserrat', 'sans-serif'],
        'body-base': ['Montserrat', 'sans-serif'],
        'label-caps': ['Montserrat', 'sans-serif'],
        'button-text': ['Montserrat', 'sans-serif'],
      },
      spacing: {
        'section-gap-lg': '120px',
        'section-gap-sm': '64px',
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        gutter: '24px',
        unit: '4px',
      },
      maxWidth: {
        'container-max': '1280px',
        container: '1280px',
      },
    },
  },
  plugins: [],
}
