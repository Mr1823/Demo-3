import express from "express";
import { Cart } from "../models/Cart.js";

const router = express.Router();

// GET /api/cart?email=user@gmail.com
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json([]);
    const userCart = await Cart.find({ email }).lean();
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// GET /api/cart/subtotal?email=user@gmail.com
router.get("/subtotal", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ subtotal: "0.00", totalItems: 0 });
    
    const userCart = await Cart.find({ email });
    const subtotal = userCart.reduce((acc, item) => acc + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
    
    res.json({
      subtotal: subtotal.toFixed(2),
      totalItems: userCart.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart subtotal" });
  }
});

// POST /api/cart
router.post("/", async (req, res) => {
  try {
    const { productId, email, name, img, image, category, price, quantity = 1 } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    let cartItem = await Cart.findOne({ email, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        productId,
        email,
        name,
        img: img || image || "/logo.png",
        image: img || image || "/logo.png",
        category: category || "Jewellery",
        price,
        quantity
      });
      await cartItem.save();
    }

    res.json({ insertedId: productId, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// DELETE /api/cart/:id?email=user@gmail.com
router.delete("/:id", async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;
    
    const result = await Cart.deleteMany({
      email,
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { productId: id }].filter(Boolean)
    });
    
    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from cart" });
  }
});

export default router;
