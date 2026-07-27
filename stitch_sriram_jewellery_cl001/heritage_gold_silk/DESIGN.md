---
name: Heritage Gold & Silk
colors:
  surface: '#fff8f2'
  surface-dim: '#e2d9ca'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e3'
  surface-container: '#f7edde'
  surface-container-high: '#f1e7d8'
  surface-container-highest: '#ebe1d2'
  on-surface: '#1f1b12'
  on-surface-variant: '#50443d'
  inverse-surface: '#353026'
  inverse-on-surface: '#faefe0'
  outline: '#82746c'
  outline-variant: '#d4c3b9'
  surface-tint: '#7b563a'
  primary: '#704c31'
  on-primary: '#ffffff'
  primary-container: '#8b6447'
  on-primary-container: '#ffebe0'
  inverse-primary: '#edbd9a'
  secondary: '#75593c'
  on-secondary: '#ffffff'
  secondary-container: '#ffd9b4'
  on-secondary-container: '#795d40'
  tertiary: '#60523f'
  on-tertiary: '#ffffff'
  tertiary-container: '#796a56'
  on-tertiary-container: '#ffecd6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#edbd9a'
  on-primary-fixed: '#2e1501'
  on-primary-fixed-variant: '#613f25'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#e4c09d'
  on-secondary-fixed: '#2a1702'
  on-secondary-fixed-variant: '#5b4227'
  tertiary-fixed: '#f4dfc7'
  tertiary-fixed-dim: '#d7c4ac'
  on-tertiary-fixed: '#241a0b'
  on-tertiary-fixed-variant: '#524533'
  background: '#fff8f2'
  on-background: '#1f1b12'
  surface-variant: '#ebe1d2'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-base:
    fontFamily: Montserrat
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
  button-text:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  container-max: 1280px
  section-gap-lg: 120px
  section-gap-sm: 64px
---

## Brand & Style

The design system is anchored in "Quiet Luxury" and "Heritage Craftsmanship." It targets a discerning audience that values permanence, artisanal quality, and emotional resonance over fleeting digital trends. 

The aesthetic is a sophisticated blend of **Minimalism** and **Tactile Luxury**. It prioritizes expansive whitespace to allow high-fidelity imagery to breathe, punctuated by delicate metallic accents. The interface should feel like a physical boutique experience: warm, intimate, and meticulously curated. Motion must be cinematic and deliberate, favoring soft fades and gentle "Ken Burns" scales on imagery rather than aggressive, high-speed transitions.

## Colors

The palette is an organic, earthen spectrum designed to complement the natural luster of gold and precious materials. The updated tones are slightly lighter and more sun-drenched, moving toward a "Golden Hour" aesthetic.

- **Primary (Antique Bronze):** The core brand color, reserved for high-priority actions and signature touchpoints. It evokes the warmth of aged bronze and hand-tooled leather.
- **Secondary (Pale Gold):** Used for decorative elements, hairline dividers, and secondary actions. This lighter gold provides a soft transition between surfaces.
- **Tertiary (Flaxen):** Provides depth for supporting containers and subtle accents, mimicking raw silk.
- **Neutral (Warm Parchment):** A soft, inviting canvas that reduces eye strain and provides a premium alternative to pure white.
- **Typography Tone:** Headings utilize a deep **Espresso** to ensure legibility while maintaining a warm, organic relationship with the background.

## Typography

The system pairs the literary elegance of **EB Garamond** with the architectural clarity of **Montserrat**. 

Display and Headline levels should be treated with editorial care; use tight tracking on `display-lg` to emphasize the craftsmanship of the serif letterforms. `label-caps` is used for metadata, category tags, and navigation anchors to provide a structured, modern contrast to the fluid serifs. Line heights are purposefully generous to maintain a breathable, luxurious feel.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop, centered within a 1280px container to maintain visual focus and prestige. 

The spacing strategy is intentionally "wasteful"—utilizing significant vertical gaps (`section-gap-lg`) to signal that the user is in a space that is not rushed. On mobile, margins are increased compared to standard utility apps to preserve a sense of exclusivity. Product grids should adhere to a 2-column layout on mobile and a 4-column layout on desktop to ensure imagery remains large and impactful.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layers** and **Hairline Outlines** to maintain a flat, editorial feel.

- **Depth through Color:** Hierarchy is established by placing lighter surface containers on the Warm Parchment background.
- **Hairline Outlines:** Use 1px borders in `outline-gold` (#C8A684) to define interactive boundaries and card edges.
- **Subtle Glow:** For critical elevated states like modals or floating menus, use an extremely diffused ambient shadow with a hint of bronze: `0 20px 40px -10px rgba(139, 100, 71, 0.08)`.

## Shapes

The shape language is "Softly Geometric." A base roundedness of 8px (0.5rem) is used for standard buttons and input fields to balance the sharp serifs of the display typography. Larger components, such as product cards or hero banners, utilize `rounded-lg` (1rem) or `rounded-xl` (1.5rem) to emphasize their role as containers for "precious" brand content.

## Components

- **Buttons:**
  - **Primary:** Solid Antique Bronze (#8B6447) with white text. No border. On hover, apply a subtle scale (1.02) and a slight darkening.
  - **Secondary:** Transparent background with a 1px `outline-gold` border. Text in `heading-espresso`.
- **Product Cards:** Solid `surface-container` background. Use 1px gold borders instead of shadows. Product images should have a subtle "Ken Burns" scale effect on hover.
- **Input Fields:** Use a white background to signal interactivity. Use `outline-gold` for the border, shifting to Antique Bronze on focus.
- **Dividers:** Use 1px gold lines. For major section breaks, use a centered 64px wide gold line as a traditional boutique flourish.
- **Chips/Badges:** Small, `label-caps` typography. Use `surface-variant` backgrounds for a subtle, tone-on-tone aesthetic.
- **Navigation:** A sticky header that transitions from transparent to solid Warm Parchment with a hairline gold bottom border upon scrolling.