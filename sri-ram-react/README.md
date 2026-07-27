# Sri Ram Jewellery — Stitch → React Conversion

This is a **runnable, working React app** converted from the 16-screen Stitch export
(`stitch_sriram_jewellery_cl001.zip`). Run `npm install && npm run dev` and it works
out of the box.

## What was corrected (vs. the raw Stitch export)

Stitch's own `DESIGN.md` had drifted from what the client actually approved. Both are
fixed globally in `tailwind.config.js` and `index.html`, so every screen picked up the
fix automatically — no per-screen editing needed:

1. **Font:** All 16 screens used `EB Garamond`. Client brief confirmed `Cormorant Garamond`.
   Fixed in `index.html` (font import) and `tailwind.config.js` (every `font-display-*`,
   `font-headline-*` token now maps to Cormorant Garamond).
2. **Colors:** Stitch generated its own "Golden Hour" palette (`#fff8f2`, `#1f1b12`,
   `#edbd9a`, etc.) instead of the client's 5 approved hex values. Every semantic color
   token Stitch used (`bg-surface`, `text-on-surface`, `bg-primary`, `border-outline`,
   etc.) is remapped in `tailwind.config.js` to the correct palette:
   - `#F4EADB` background — `#E6D2BA` cards — `#C8A684` accents/borders — `#8B6447` CTAs — `#3F2A22` text
3. **Header/footer consistency:** Individual screens had drifted nav labels ("Collections,
   Gold, Silver, Heritage, Boutique" vs. the intended "Home, Shop, Categories, About").
   The Header and Footer are now extracted **once** from the Home screen into
   `src/components/Header.jsx` / `Footer.jsx` and reused across every storefront page via
   `src/layouts/MainLayout.jsx` — so there's now exactly one nav, everywhere.

## How the conversion works

Each screen's HTML/Tailwind was corrected (colors + fonts) and wrapped in a real React
component using `dangerouslySetInnerHTML`. **This is intentional, not a shortcut skipped
by mistake** — converting 16 complex screens into fully hand-authored JSX in one pass
risks silently breaking inline SVGs, style strings, and self-closing tags. This approach
guarantees the visual output is byte-identical to the corrected design while being 100%
valid, running React.

**This is a starting point, not the final state.** Treat `src/pages/*.jsx` as a visual
reference layer to refactor from — not what should ship long-term.

## What still needs to happen (your Phase 1–8 plan)

This project is standalone — it does **not** have your existing `jewellery-ecommerce-spa`
codebase, hooks, or backend wired in, since that repo wasn't available here. The real
next step is exactly what you outlined:

1. **Merge, don't replace:** Bring these corrected `tailwind.config.js` tokens and font
   setup into your actual project's config (Phase 1: Foundation).
2. **Replace `dangerouslySetInnerHTML` with real componentized JSX**, screen by screen —
   ideally with Claude Code, which can see your actual `src/hooks/`, `src/components/`,
   and `src/pages/` structure and do this properly (ask/attribute conversion, wiring
   `useProducts`, `useCart`, `useAxiosSecure`, etc. instead of static mockup content).
3. **Header/Footer:** `src/components/Header.jsx` and `Footer.jsx` here are still raw
   HTML — use them as the visual reference to update your *existing* `Header`/`Footer`
   components with the corrected nav labels and styling, don't just drop these in as-is.
4. **Images:** All image URLs (`lh3.googleusercontent.com/aida-public/...`) are Stitch's
   own AI-generation hosting — these are **not guaranteed permanent**. Before this goes
   anywhere near production, download and self-host these under `public/img/`, since a
   Stitch project deletion or URL expiry would silently break every hero/product image
   on the live site.
5. **The 8 backend gaps** you identified (isQuoteOnly, price breakdown, gold rate
   management, contact form, etc.) — none of that data-wiring exists in this conversion,
   it's purely visual. That work happens in your actual repo per the phase plan.

## Screen → route map

| Route | Component | Source Stitch screen |
|---|---|---|
| `/` | `Home` | sri_ram_jewellery_home_themed |
| `/shop` | `Shop` | shop_all_sri_ram_jewellery_themed |
| `/product/:id` | `ProductDetail` | product_detail_sri_ram_jewellery_fixed |
| `/wishlist` | `Wishlist` | wishlist_sri_ram_jewellery |
| `/checkout` | `Checkout` | checkout_sri_ram_jewellery_connected |
| `/checkout/shipping` | `CheckoutShipping` | checkout_shipping_sri_ram_jewellery |
| `/checkout/payment` | `CheckoutPayment` | checkout_payment_sri_ram_jewellery |
| `/order-success` | `OrderSuccess` | order_success_sri_ram_jewellery_themed |
| `/order-success-alt` | `OrderSuccessAlt` | order_success_sri_ram_jewellery (older variant — pick one, both included) |
| `/login` | `Login` | login_modernized_sri_ram_jewellery |
| `/register` | `Register` | register_modernized_sri_ram_jewellery |
| `/dashboard/orders` | `MyOrders` | my_orders_sri_ram_jewellery |
| `/dashboard/address-book` | `AddressBook` | address_book_sri_ram_jewellery |
| `/about` | `AboutContact` | about_contact_sri_ram_jewellery |
| `/admin/dashboard` | `AdminDashboard` | admin_dashboard_sri_ram_jewellery_themed |
| `*` (404) | `NotFound` | 404_not_found_sri_ram_jewellery |

Note: `/login`, `/register`, `/admin/dashboard`, and 404 intentionally have **no**
Header/Footer shell, matching their original Stitch design (standalone auth/admin layouts).

## Run it

```bash
npm install
npm run dev
```
