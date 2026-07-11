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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);

// JWT endpoint for Firebase sync
app.post("/api/jwt", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  // Mock JWT token generation for dev
  const token = `mock-jwt-token-for-${email}-${Date.now()}`;
  res.json({ token, success: true });
});

// ─── User endpoint (used by useUserInfo hook) ────────────────────────────
app.get("/api/user", (req, res) => {
  const { email } = req.query;
  // Dev admin bypass
  if (email === "admin@buildwithus") {
    return res.json({
      _id: "dev-admin-uid",
      name: "Admin",
      email: "admin@buildwithus",
      role: "ADMIN",
      admin: true,
      photoURL: "/placeholder-user.png",
      shippingAddress: {},
    });
  }
  // Regular users
  res.json({
    _id: `u-${Date.now()}`,
    name: email ? email.split("@")[0] : "Guest",
    email: email || "guest@jewelstore.com",
    role: "USER",
    admin: false,
    photoURL: "/placeholder-user.png",
    shippingAddress: {},
  });
});

// ─── Admin endpoints ─────────────────────────────────────────────────────
app.get("/api/admin/users", (req, res) => {
  res.json([
    { _id: "dev-admin-uid", name: "Admin", email: "admin@buildwithus", role: "ADMIN", admin: true, photoURL: "/placeholder-user.png" },
    { _id: "u-1", name: "Jewellery Connoisseur", email: "user@gmail.com", role: "USER", admin: false, photoURL: "/placeholder-user.png" },
    { _id: "u-2", name: "Priya Sharma", email: "priya@example.com", role: "USER", admin: false, photoURL: "/placeholder-user.png" },
    { _id: "u-3", name: "Rahul Verma", email: "rahul@example.com", role: "USER", admin: false, photoURL: "/placeholder-user.png" },
  ]);
});

app.patch("/api/admin/users/:id", (req, res) => {
  res.json({ success: true, message: "User updated" });
});

app.delete("/api/admin/users/:id", (req, res) => {
  res.json({ success: true, message: "User deleted" });
});

app.get("/api/admin/orders", (req, res) => {
  res.json([
    { _id: "ord-1", orderId: "ORD-1001", email: "user@gmail.com", totalAmount: 45000, orderStatus: "delivered", date: "2026-07-01T10:00:00Z", products: [{ name: "Diamond Ring", quantity: 1, price: 45000 }] },
    { _id: "ord-2", orderId: "ORD-1002", email: "priya@example.com", totalAmount: 78000, orderStatus: "processing", date: "2026-07-05T14:30:00Z", products: [{ name: "Gold Necklace", quantity: 1, price: 78000 }] },
    { _id: "ord-3", orderId: "ORD-1003", email: "rahul@example.com", totalAmount: 12500, orderStatus: "shipped", date: "2026-07-08T09:15:00Z", products: [{ name: "Silver Earrings", quantity: 2, price: 6250 }] },
  ]);
});

app.patch("/api/admin/orders/:id", (req, res) => {
  res.json({ success: true, message: "Order updated" });
});

app.get("/api/admin/categories", (req, res) => {
  res.json([
    { _id: "cat-1", categoryName: "Rings", categoryPic: "/img/categories/1.jpg", productCount: 24 },
    { _id: "cat-2", categoryName: "Necklaces", categoryPic: "/img/categories/2.jpg", productCount: 18 },
    { _id: "cat-3", categoryName: "Earrings", categoryPic: "/img/categories/3.jpg", productCount: 32 },
    { _id: "cat-4", categoryName: "Bracelets", categoryPic: "/img/categories/4.jpg", productCount: 15 },
    { _id: "cat-5", categoryName: "Pendants", categoryPic: "/img/categories/5.jpg", productCount: 21 },
    { _id: "cat-6", categoryName: "Charms", categoryPic: "/img/categories/6.jpg", productCount: 9 },
    { _id: "cat-7", categoryName: "Bangles", categoryPic: "/img/categories/7.jpg", productCount: 12 },
    { _id: "cat-8", categoryName: "Bridal Sets", categoryPic: "/img/categories/8.jpg", productCount: 7 },
  ]);
});

app.post("/api/admin/categories", (req, res) => {
  res.json({ success: true, insertedId: `cat-${Date.now()}` });
});

app.patch("/api/admin/categories/:id", (req, res) => {
  res.json({ success: true, message: "Category updated" });
});

app.delete("/api/admin/categories/:id", (req, res) => {
  res.json({ success: true, message: "Category deleted" });
});

app.get("/api/admin/total-spent", (req, res) => {
  res.json([
    { email: "user@gmail.com", totalSpent: 125000 },
    { email: "priya@example.com", totalSpent: 234000 },
    { email: "rahul@example.com", totalSpent: 67500 },
  ]);
});

// ─── Admin Dashboard Stats ──────────────────────────────────────────────
app.get("/api/admin-dashboard/stats", (req, res) => {
  res.json({
    totalProducts: 138,
    totalOrders: 256,
    totalUsers: 1024,
    totalRevenue: 8750000,
    pendingOrders: 12,
    deliveredOrders: 230,
  });
});

app.get("/api/admin-dashboard/top-selling-categories", (req, res) => {
  res.json({
    totalCategories: 8,
    topCategories: [
      { categoryName: "Rings", totalSold: 89, revenue: 2450000 },
      { categoryName: "Necklaces", totalSold: 67, revenue: 3120000 },
      { categoryName: "Earrings", totalSold: 54, revenue: 890000 },
      { categoryName: "Bracelets", totalSold: 38, revenue: 760000 },
      { categoryName: "Pendants", totalSold: 29, revenue: 430000 },
    ],
  });
});

app.get("/api/admin-dashboard/income-stats", (req, res) => {
  res.json([
    { month: "Feb", income: 620000 },
    { month: "Mar", income: 890000 },
    { month: "Apr", income: 1150000 },
    { month: "May", income: 980000 },
    { month: "Jun", income: 1340000 },
    { month: "Jul", income: 1560000 },
  ]);
});

app.get("/api/admin-dashboard/popular-products", (req, res) => {
  res.json([
    { _id: "p-1", name: "18k Gold Diamond Solitaire Ring", price: 85000, totalSold: 34, image: "/img/products/1.jpg" },
    { _id: "p-2", name: "Pearl Drop Necklace", price: 42000, totalSold: 28, image: "/img/products/2.jpg" },
    { _id: "p-3", name: "Ruby Stud Earrings", price: 35000, totalSold: 25, image: "/img/products/3.jpg" },
    { _id: "p-4", name: "Platinum Tennis Bracelet", price: 125000, totalSold: 19, image: "/img/products/4.jpg" },
  ]);
});

app.get("/api/admin-dashboard/recent-reviews", (req, res) => {
  res.json([
    { _id: "r-1", productName: "Gold Diamond Ring", userName: "Priya S.", rating: 5, review: "Absolutely stunning! The craftsmanship is incredible.", date: "2026-07-10T08:30:00Z" },
    { _id: "r-2", productName: "Pearl Necklace", userName: "Rahul V.", rating: 4, review: "Beautiful piece, perfect for my wife's anniversary.", date: "2026-07-09T14:20:00Z" },
    { _id: "r-3", productName: "Silver Earrings", userName: "Anita K.", rating: 5, review: "Elegant and lightweight. Daily wear perfection.", date: "2026-07-08T11:45:00Z" },
  ]);
});

// Navigation notifications endpoint
app.get("/api/nav-notifications", (req, res) => {
  res.json([
    { id: 1, message: "Welcome to The Jewel Store! Enjoy 20% off on first purchase." },
    { id: 2, message: "Free express shipping on all orders above ₹50,000." },
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

