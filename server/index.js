import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import wishlistRouter from "./routes/wishlist.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import categoriesRouter from "./routes/categories.js";
import reviewsRouter from "./routes/reviews.js";
import adminRouter from "./routes/admin.js";
// Removed dead goldRate.js import
import ratesRouter from "./routes/rates.js";
import quotesRouter from "./routes/quotes.js";
import paymentRouter from "./routes/payment.js";
import adminDashboardRouter from "./routes/adminDashboard.js";
import connectDB from "./db/connect.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Normalize URL prefix for Vercel Serverless (if Vercel stripped /api)
app.use((req, res, next) => {
  if (!req.url.startsWith("/api") && req.url !== "/favicon.ico") {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/refresh", authLimiter);
app.use("/api", apiLimiter);

// ─── API Routes ──────────────────────────────────────────────────────────────
// Auth — public endpoints (JWT issued here)
app.use("/api/auth", authRouter);

// All routes below require JWT (enforced in each router via verifyJWT middleware)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rates", ratesRouter);
app.use("/api/quotes", quotesRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin-dashboard", adminDashboardRouter);

// Legacy gold-rate route (backward compat — also served at /api/rates)
// Removed dead /api/gold-rate mounts

// Navigation notifications endpoint
app.get("/api/nav-notifications", (req, res) => {
  res.json([
    { id: 1, message: "Welcome to Sri Ram Jewellery! Timeless gold and silver, crafted for every celebration." },
    { id: 2, message: "Free insured shipping on all orders above ₹50,000." },
  ]);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Only listen when running locally (not in Vercel serverless)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 API Server running seamlessly on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
