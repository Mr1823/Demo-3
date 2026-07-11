import express from "express";

const router = express.Router();

// In-memory cart store keyed by email (for ultra-fast development/testing)
const carts = {};

// GET /api/cart?email=user@gmail.com
router.get("/", (req, res) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  const userCart = carts[email] || [];
  res.json(userCart);
});

// GET /api/cart/subtotal?email=user@gmail.com
router.get("/subtotal", (req, res) => {
  const { email } = req.query;
  const userCart = carts[email] || [];
  const subtotal = userCart.reduce((acc, item) => acc + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
  res.json({
    subtotal: subtotal.toFixed(2),
    totalItems: userCart.length,
  });
});

// POST /api/cart
router.post("/", (req, res) => {
  const { productId, email, name, img, image, category, price, quantity = 1 } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  if (!carts[email]) carts[email] = [];
  const existing = carts[email].find((p) => p.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    carts[email].push({
      _id: productId,
      productId,
      email,
      name,
      img: img || image || "/logo.png",
      image: img || image || "/logo.png",
      category: category || "Jewellery",
      price,
      quantity,
      addedAt: new Date(),
    });
  }

  res.json({ insertedId: productId, success: true });
});

// DELETE /api/cart/:id?email=user@gmail.com
router.delete("/:id", (req, res) => {
  const { email } = req.query;
  const { id } = req.params;
  if (carts[email]) {
    carts[email] = carts[email].filter((p) => p._id !== id && p.productId !== id);
  }
  res.json({ deletedCount: 1, success: true });
});

export default router;
