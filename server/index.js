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
import goldRateRouter from "./routes/goldRate.js";
import connectDB from "./db/connect.js";
import { User } from "./models/User.js";

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

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/gold-rate", goldRateRouter);
// Admin gold rate update uses same router but different path prefix
app.use("/api/admin/gold-rate", goldRateRouter);

// JWT endpoint for Firebase sync
app.post("/api/jwt", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  // Mock JWT token generation for dev
  const token = `mock-jwt-token-for-${email}-${Date.now()}`;
  res.json({ token, success: true });
});

// ─── User endpoint (used by useUserInfo hook) ────────────────────────────────
app.get("/api/user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json({
        _id: "guest-id",
        name: "Guest",
        email: "guest@jewelstore.com",
        role: "USER",
        admin: false,
        photoURL: "/placeholder-user.png",
        shippingAddress: {},
      });
    }

    // Check for admin dev bypass
    if (email === "admin@buildwithus") {
      // Ensure dev admin exists in DB
      let adminUser = await User.findOne({ email: "admin@buildwithus" });
      if (!adminUser) {
        adminUser = await User.create({
          email: "admin@buildwithus",
          name: "Admin",
          role: "ADMIN",
          photoURL: "/placeholder-user.png",
        });
      }
      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: "ADMIN",
        admin: true,
        photoURL: adminUser.photoURL || "/placeholder-user.png",
        shippingAddress: adminUser.shippingAddress || {},
      });
    }

    // Regular users — find or create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: email.split("@")[0],
        role: "USER",
        photoURL: "/placeholder-user.png",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      admin: user.role === "ADMIN",
      photoURL: user.photoURL || "/placeholder-user.png",
      shippingAddress: user.shippingAddress || {},
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

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
