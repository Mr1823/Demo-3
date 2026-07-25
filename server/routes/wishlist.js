import express from "express";
import { Wishlist } from "../models/Wishlist.js";

const router = express.Router();

// GET /api/wishlist?email=user@gmail.com
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json([]);
    const userWishlist = await Wishlist.find({ email }).lean();
    res.json(userWishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist?email=user@gmail.com
router.post("/", async (req, res) => {
  try {
    const { productId, email = req.query.email, name, img, image, category, price } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const exists = await Wishlist.findOne({ email, productId });

    if (!exists) {
      const wishlistItem = new Wishlist({
        productId,
        email,
        name,
        img: img || image || "/logo.png",
        image: img || image || "/logo.png",
        category: category || "Jewellery",
        price
      });
      await wishlistItem.save();
    }

    res.json({ insertedId: productId, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist?productId=prod-1&email=user@gmail.com
router.delete("/", async (req, res) => {
  try {
    const { productId, email } = req.query;
    
    const result = await Wishlist.deleteMany({
      email,
      $or: [{ _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }, { productId: productId }].filter(Boolean)
    });

    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from wishlist" });
  }
});

export default router;
