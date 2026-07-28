import express from "express";
import { Wishlist } from "../models/Wishlist.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

// GET /api/wishlist — user's wishlist items
router.get("/", verifyJWT, async (req, res) => {
  try {
    const userWishlist = await Wishlist.find({ userId: req.user.userId }).lean();
    res.json(userWishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist — add item to wishlist
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { productId, name, img, image, category, price } = req.body;

    const exists = await Wishlist.findOne({ userId: req.user.userId, productId });

    if (!exists) {
      const wishlistItem = new Wishlist({
        productId,
        userId: req.user.userId,
        email: req.user.email,
        name,
        img: img || image || "/logo.png",
        image: img || image || "/logo.png",
        category: category || "Jewellery",
        price,
      });
      await wishlistItem.save();
    }

    res.json({ insertedId: productId, success: true });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/:itemId — remove item from wishlist
router.delete("/:itemId", verifyJWT, async (req, res) => {
  try {
    const result = await Wishlist.deleteMany({
      userId: req.user.userId,
      $or: [
        { _id: req.params.itemId.match(/^[0-9a-fA-F]{24}$/) ? req.params.itemId : null },
        { productId: req.params.itemId }
      ].filter(Boolean)
    });

    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from wishlist" });
  }
});

// DELETE /api/wishlist?productId=... — backward compat (query-param based)
router.delete("/", verifyJWT, async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ error: "productId required" });
    }

    const result = await Wishlist.deleteMany({
      userId: req.user.userId,
      $or: [
        { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null },
        { productId }
      ].filter(Boolean)
    });

    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from wishlist" });
  }
});

export default router;
