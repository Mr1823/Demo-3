import express from "express";

const router = express.Router();

const wishlists = {};

// GET /api/wishlist?email=user@gmail.com
router.get("/", (req, res) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  res.json(wishlists[email] || []);
});

// POST /api/wishlist?email=user@gmail.com
router.post("/", (req, res) => {
  const { productId, email = req.query.email, name, img, image, category, price } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  if (!wishlists[email]) wishlists[email] = [];
  const exists = wishlists[email].some((p) => p.productId === productId);

  if (!exists) {
    wishlists[email].push({
      _id: productId,
      productId,
      email,
      name,
      img: img || image || "/logo.png",
      image: img || image || "/logo.png",
      category: category || "Jewellery",
      price,
      addedAt: new Date(),
    });
  }

  res.json({ insertedId: productId, success: true });
});

// DELETE /api/wishlist?productId=prod-1&email=user@gmail.com
router.delete("/", (req, res) => {
  const { productId, email } = req.query;
  if (wishlists[email]) {
    wishlists[email] = wishlists[email].filter((p) => p._id !== productId && p.productId !== productId);
  }
  res.json({ deletedCount: 1, success: true });
});

export default router;
