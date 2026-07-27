# Product Requirements Document — Sri Ram Jewellery E-commerce Platform

**Prepared by:** BuildWithUs
**Client:** Sri Ram Jewellery
**Repo:** https://github.com/Mr1823/Demo-3.git
**Reference deployment:** https://jewellery-store-self.vercel.app
**Status:** In development
**Revision:** v2 — custom JWT authentication architecture added, replacing Firebase Auth

---

## 1. Overview

Sri Ram Jewellery needs a customised gold and silver jewellery e-commerce platform, built on the existing `jewellery-ecommerce-spa` template (React 19 + Vite frontend, Express.js API). The build converts the template's in-memory data layer into a persistent MongoDB-backed system, replaces the template's Firebase-based authentication with a custom JWT authentication system, and adds client-specific business logic: dynamic weight-based pricing, manual daily rate updates, Razorpay checkout, and a WhatsApp-alerted "Get Quote" flow for non-fixed-price items.

Brand tagline: *"Timeless gold and silver, crafted for every celebration."*

---

## 2. Goals

- Give customers a fast, elegant shopping experience for fixed-price and quote-only jewellery
- Own the full authentication stack in-house (no third-party auth dependency) with secure password handling and session management
- Let the admin update gold/silver rates once daily and have it reflect instantly across the entire catalog, with zero manual per-product edits
- Give the client visibility into sales performance through an admin dashboard
- Capture and route quote leads to the client's team in near real-time via WhatsApp
- Accept payments securely via Razorpay

---

## 3. Out of Scope (for this phase)

- Automatic gold/silver rate pulled from a live market API (explicitly declined by client — manual entry only)
- Status tracking on quote requests (no `status` field — admin handles follow-up outside the app)
- Global/fixed GST rate (GST is entered manually per product)
- Multi-tier roles beyond Admin/User (no Manager/Employee tier — not requested for this phase)
- MySQL, Redis, Flutter mobile app, Nginx reverse proxy — evaluated and declined; database stays MongoDB, no mobile app in scope, deployment remains Vercel serverless (handles SSL/routing without a separate reverse proxy)

---

## 4. Functional Requirements

### 4.1 Authentication — Custom JWT (replaces Firebase Auth)

The existing template's Firebase Authentication is replaced with a custom-built JWT authentication system. Rationale: full control over the user data model, no third-party auth dependency, and direct integration with the MongoDB `User` collection already planned for roles/addresses.

**Password handling:**
- Passwords hashed with **bcrypt** at signup — never stored in plaintext
- Login compares submitted password against the stored hash via `bcrypt.compare()`

**Token model:**
- **Access token** — JWT, expires after **30 minutes**, sent as `Authorization: Bearer <token>` on every authenticated request, contains `userId` and `role` in the payload
- **Refresh token** — also expires after **30 minutes** (client-confirmed), stored **hashed** (not raw) in MongoDB, associated with the user, used solely to mint new access tokens when the current one expires — never used directly for API authorization
- **Logout** — invalidates the stored refresh token **immediately** (deletes/marks it invalid server-side), rather than letting it passively expire

> **Flagging for review:** a 30-minute refresh token means a user is fully logged out (forced back to the login page) every 30 minutes of inactivity, since there's no longer-lived token to silently renew the session. This is workable but worth confirming it's the intended UX — most apps set refresh tokens to days/weeks specifically so users aren't repeatedly re-prompted to log in. If this was meant as "access token: 30 min, refresh token: longer," let us know and we'll adjust; as given, both are implemented as 30 minutes.

**JWT enforcement — required on every endpoint except token issuance itself:**
Client decision: **every** endpoint requires a valid JWT, with the sole exception of `POST /api/auth/register`, `POST /api/auth/login`, and `POST /api/auth/refresh` — these three cannot require a token by definition, since the caller doesn't have one yet at that point. This includes product/category browsing and Get Quote submission, which are commonly left public on e-commerce sites but are locked behind login here per client instruction.

> **Flagging for review:** this means a visitor must create an account and log in before they can view the product catalog or submit a Get Quote inquiry — there is no anonymous browsing. This is a deliberate deviation from typical e-commerce UX (where browsing and inquiries are usually open, and only cart/checkout/account pages require login) and is worth the client explicitly confirming, since it directly affects how many visitors will ever see a product page in the first place.

**Endpoints:**
- `POST /api/auth/register` — create user, hash password, store in Mongo
- `POST /api/auth/login` — validate credentials, issue access + refresh token pair
- `POST /api/auth/refresh` — exchange a valid refresh token for a new access token
- `POST /api/auth/logout` — JWT required, immediately invalidates the stored refresh token

Full endpoint-by-endpoint list, including which require the ADMIN role in addition to a valid JWT, is in **Section 11 — API Endpoints**.

### 4.2 Payments — Razorpay
- Razorpay integrated at checkout for all fixed-price orders
- Order + payment status (`razorpayOrderId`, `razorpayPaymentId`) persisted in MongoDB
- Server-side price verification before payment capture (price is never trusted from the frontend)

### 4.3 Login nudge popup
- A non-blocking modal appears **30 seconds** after a visitor lands on the site, gently prompting login/signup
- Not compulsory — visitor can dismiss and continue browsing/shopping as guest
- Reuses the existing `TakeToLoginModal` component; timer wired into `MainLayout`

### 4.4 Gold/Silver rate display & update
- Today's gold rate and silver rate displayed on the homepage (rate strip)
- Rate is entered **manually** by the admin once daily via the admin panel — **no automatic pull from an external source** (confirmed with client)
- Stored per metal type in a `GoldSilverRate` collection

### 4.5 Pricing formula
For priced products:
```
X = weight × gold_rate            (gold value)
Y = weight × wastage%              (wastage weight)
Z = Y × gold_rate                  (wastage value, in ₹)
Final Price = X + Z + GST
```
- GST is entered **manually per product** by the admin (not a fixed global %)
- Confirmed with client: final price excludes Y (a weight, not a currency value) from the sum — only X, Z, and GST are additive
- Computed server-side at read time — never stored as a static price field

### 4.6 One-click gold rate propagation
- Product prices are **never stored** — they are computed live from `weight`, `wastagePercent`, `gstPercent` (stored per product) and the current rate (stored once, centrally)
- Updating the gold or silver rate once instantly reflects across every product's displayed price — no batch job, no per-product edits

### 4.7 Product catalog & categories
- Catalog and category mapping sourced from the client-provided sheet
- Categories support product-count tracking (existing `categories.js` route, migrated to Mongo)

### 4.8 Admin dashboard
- Charts and KPIs for sales/product analysis (existing chart components — `BarChartComponent`, `LineChartComponent`, `RadarChartComponent` — reused)
- Confirmed metrics to track:

| Metric | What it measures | Data source |
|---|---|---|
| Revenue over time | ₹ trend across days/weeks/months | `Order` collection — order totals grouped by date |
| Sales by category | Which categories generate the most revenue/orders | `Order.items` joined with `Product.category` |
| Best-selling products | Highest units sold / highest revenue-generating products | `Order.items` grouped by `productId` |
| Products that attract users | Engagement signal — what users show interest in, not just what they buy | Wishlist-add count per product (v1); page-view tracking is a phase-2 addition if deeper engagement insight is needed later |

- Order volume was explicitly not requested — excluded from v1 scope

### 4.9 Design system
- Typography: **Cormorant Garamond** (headings) + **Montserrat** (body/UI)
- Palette: `#F4EADB` (background), `#E6D2BA` (cards), `#C8A684` (accents/borders), `#8B6447` (CTAs), `#3F2A22` (dark text/headings)
- Direction: premium/editorial — generous whitespace (100–160px section padding), muted/desaturated color use, recurring small-caps letter-spaced micro-labels as a section motif, thin gold-line dividers, outline/ghost CTA buttons (solid fill reserved for final commit actions like checkout payment), subtle hover interactions (image zoom, card lift)
- Full 16-screen suite designed in Google Stitch, converted to React reference implementation, currently being merged into the production codebase screen-by-screen

### 4.10 Get Quote button
- Products without a fixed price display a **"Get Quote"** button instead of a price
- Clicking it opens a modal capturing **customer name and mobile number**
- On submission, a lead is created and the admin's team is alerted via **WhatsApp Cloud API (official, Meta)** — billed separately as an add-on (₹800, outside the original quote)
- No pricing formula (X/Z/GST) applies to these products — admin handles pricing and follow-up manually, outside the app
- `QuoteRequest` record stores: `productId`, `productName`, `productImage`, `customerName`, `customerMobile`, `createdAt` — no status field

---

## 5. Authentication & Authorization Workflows

### 5.1 Login flow

```
User enters email + password
        |
        v
POST /api/auth/login
        |
        v
Validate request body (Joi/Zod)
        |
        v
Find user by email in MongoDB
        |
        v
bcrypt.compare(password, storedHash)
        |
   +----+----+
   |         |
 Correct   Incorrect
   |         |
   v         v
Generate    401 Unauthorized
Access Token
(short-lived JWT)
   |
   v
Generate Refresh Token
(long-lived)
   |
   v
Store Refresh Token in MongoDB
(linked to user)
   |
   v
Return { accessToken, refreshToken, user } to client
```

### 5.2 Authenticated request / authorization flow

```
Client sends request with
Authorization: Bearer <accessToken>
        |
        v
Express Router
        |
        v
Validation Middleware (Joi/Zod)
        |
        v
Rate Limiter
        |
        v
JWT Verification Middleware
        |
   +----+----+
   |         |
 Valid     Expired/Invalid
   |         |
   v         v
Load user  401 Unauthorized
from token
payload
   |
   v
Check role/permission
(ADMIN vs USER)
        |
   +----+----+
   |         |
Authorized  Not Authorized
   |         |
   v         v
Controller  403 Forbidden
   |
   v
Service Layer
   |
   v
MongoDB (via existing route handlers)
   |
   v
JSON Response
```

### 5.3 Frontend session flow (on app load / route change)

```
Application starts
        |
        v
Access token exists in storage?
   |              |
   No             Yes
   |              |
   v              v
Redirect to    Decode JWT -- expired?
Login          |           |
              No          Yes
               |           |
               v           v
           Render      Call POST /api/auth/refresh
           Dashboard        |
                        +---+---+
                        |       |
                     Success  Failure
                        |       |
                        v       v
                   New access  Logout ->
                   token       redirect to Login
                        |
                        v
                   Render Dashboard
```

### 5.4 Protected route check (per page navigation)

```
User opens a page
        |
        v
Is this a protected route?
   |              |
   No             Yes
   |              |
   v              v
Render        Check JWT (access token)
Component          |
              +-----+-----+
              |           |
           Valid      Invalid/Missing
              |           |
              v           v
        Check role     Redirect to Login
        permission
              |
        +-----+-----+
        |           |
     Granted     Not Granted
        |           |
        v           v
    Render      Render 403 Page
    Component
```

Note: `PrivateRoute` (any authenticated user) and `AdminRoute` (ADMIN role only) already exist as route guards in the codebase — these workflows describe what should be running underneath them once the custom JWT system replaces Firebase.

---

## 6. Data Model (MongoDB)

```js
// User
{
  name,
  email,
  passwordHash,        // bcrypt hash -- never store plaintext
  role: "ADMIN" | "USER",
  address,
  createdAt
}

// RefreshToken
{
  userId,
  token,                // the refresh token value (or a hash of it)
  expiresAt,
  createdAt
}

// Product
{
  name, images, category, description,
  isQuoteOnly: Boolean,
  weight: Number,          // grams, only relevant if !isQuoteOnly
  wastagePercent: Number,  // admin enters this per product
  gstPercent: Number,      // admin enters this per product
  metalType: "gold" | "silver"
}

// GoldSilverRate
{ metalType: "gold" | "silver", ratePerGram: Number, updatedAt: Date }

// QuoteRequest
{ productId, productName, productImage, customerName, customerMobile, createdAt }

// Order
{ userId, items: [...], razorpayOrderId, razorpayPaymentId, status, gstAmount, createdAt }

// Category
{ name, image, productCount }
```

---

## 7. Non-Functional Requirements

- **Persistence:** existing template uses in-memory storage (`cart.js`, `products.js`), which is unsafe for production on Vercel serverless (no guaranteed shared memory between invocations) and unacceptable for paid orders. Full migration to MongoDB is a prerequisite before Razorpay integration or launch.
- **Security:**
  - All pricing calculations happen server-side; price is never trusted from the frontend
  - Passwords hashed with bcrypt, never stored or logged in plaintext
  - Access tokens short-lived; refresh tokens stored server-side and can be individually invalidated (logout, or admin-forced logout if ever needed)
  - Request validation (Joi/Zod) and rate limiting added at the Express router level -- not present in the original template, added as part of this build
- **Responsiveness:** mobile-responsive across all customer-facing screens

---

## 8. Technical Approach (build sequence)

1. MongoDB migration -- Product, Cart, Wishlist, Orders, Users, Category, GoldSilverRate, QuoteRequest collections replacing in-memory stores
2. **Custom JWT authentication** -- User schema with bcrypt password hashing, RefreshToken collection, `/api/auth/*` endpoints, JWT verification + authorization middleware, replacing Firebase Auth calls in `AuthProvider.jsx` / `useAxiosSecure.jsx`
3. Admin: gold/silver rate entry + pricing engine (computed-at-read pricing)
4. Product catalog + category import from client sheet
5. Get Quote button + lead capture + WhatsApp Cloud API alert
6. Razorpay checkout integration
7. Login nudge popup (30s timer)
8. Design system rollout across all screens (Stitch-generated, being merged into existing components)
9. Admin dashboard with charts (revenue over time, sales by category, best-selling products, products that attract users)

---

## 9. Team

- Pavithran and HariVishnu V -- build lead on this client project (BuildWithUs)

---

## 10. Open Questions

All previously open auth questions are now resolved (see Section 4.1):
- [x] Token expiry — both access and refresh tokens set to 30 minutes (see flag in 4.1 re: refresh token UX implication)
- [x] Refresh token storage — hashed in MongoDB, not stored raw
- [x] Logout — invalidates the refresh token immediately, not left to passively expire

No open items remaining at this stage.

---

## 11. API Endpoints

Every endpoint requires a valid JWT **except** the three auth endpoints used to obtain one (`register`, `login`, `refresh`). "JWT + ADMIN" means the token must also carry the `ADMIN` role.

### Auth (`/api/auth`)
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public (no token exists yet) |
| POST | `/api/auth/login` | Public (no token exists yet) |
| POST | `/api/auth/refresh` | Public (no token exists yet) |
| POST | `/api/auth/logout` | JWT |

### Products (`/api/products`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/products` | JWT |
| GET | `/api/products/:id` | JWT |
| POST | `/api/products` | JWT + ADMIN |
| PATCH | `/api/products/:id` | JWT + ADMIN |
| DELETE | `/api/products/:id` | JWT + ADMIN |

### Categories (`/api/categories`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/categories` | JWT |
| POST | `/api/categories` | JWT + ADMIN |
| PATCH | `/api/categories/:id` | JWT + ADMIN |
| DELETE | `/api/categories/:id` | JWT + ADMIN |

### Cart (`/api/cart`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/cart` | JWT |
| POST | `/api/cart` | JWT |
| PATCH | `/api/cart/:itemId` | JWT |
| DELETE | `/api/cart/:itemId` | JWT |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/wishlist` | JWT |
| POST | `/api/wishlist` | JWT |
| DELETE | `/api/wishlist/:itemId` | JWT |

### Orders (`/api/orders`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/orders` | JWT |
| GET | `/api/orders/:id` | JWT |
| POST | `/api/orders` | JWT |
| PATCH | `/api/orders/:id/status` | JWT + ADMIN |
| GET | `/api/orders/admin/all` | JWT + ADMIN |

### Payment / Razorpay (`/api/payment`)
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/payment/create-order` | JWT |
| POST | `/api/payment/verify` | JWT |

### Gold/Silver Rates (`/api/rates`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/rates` | JWT |
| PATCH | `/api/rates` | JWT + ADMIN |

### Quote Requests (`/api/quotes`)
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/quotes` | JWT |
| GET | `/api/quotes` | JWT + ADMIN |

### Users (`/api/users`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/users/me` | JWT |
| PATCH | `/api/users/me` | JWT |
| GET | `/api/users/me/addresses` | JWT |
| POST | `/api/users/me/addresses` | JWT |
| PATCH | `/api/users/me/addresses/:id` | JWT |
| DELETE | `/api/users/me/addresses/:id` | JWT |
| GET | `/api/users` | JWT + ADMIN |
| PATCH | `/api/users/:id/role` | JWT + ADMIN |

### Reviews (`/api/reviews`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/reviews/:productId` | JWT |
| POST | `/api/reviews` | JWT |

### Admin Dashboard (`/api/admin-dashboard`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/admin-dashboard/revenue` | JWT + ADMIN |
| GET | `/api/admin-dashboard/sales-by-category` | JWT + ADMIN |
| GET | `/api/admin-dashboard/best-selling` | JWT + ADMIN |
| GET | `/api/admin-dashboard/most-wishlisted` | JWT + ADMIN |
