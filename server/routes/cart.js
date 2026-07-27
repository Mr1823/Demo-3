import express from "express";
import { Cart } from "../models/Cart.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

// GET /api/cart — user's cart items
router.get("/", verifyJWT, async (req, res) => {
  try {
    const userCart = await Cart.find({ userId: req.user.userId }).lean();
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// GET /api/cart/subtotal
router.get("/subtotal", verifyJWT, async (req, res) => {
  try {
    const userCart = await Cart.find({ userId: req.user.userId });
    const subtotal = userCart.reduce((acc, item) =>
      acc + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

    res.json({
      subtotal: subtotal.toFixed(2),
      totalItems: userCart.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart subtotal" });
  }
});

// POST /api/cart — add item to cart
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { productId, name, img, image, category, price, quantity = 1 } = req.body;

    let cartItem = await Cart.findOne({ userId: req.user.userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        productId,
        userId: req.user.userId,
        email: req.user.email,
        name,
        img: img || image || "/logo.png",
        image: img || image || "/logo.png",
        category: category || "Jewellery",
        price,
        quantity,
      });
      await cartItem.save();
    }

    res.json({ insertedId: productId, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PATCH /api/cart/:itemId — update cart item quantity
router.patch("/:itemId", verifyJWT, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findOne({
      userId: req.user.userId,
      $or: [
        { _id: req.params.itemId.match(/^[0-9a-fA-F]{24}$/) ? req.params.itemId : null },
        { productId: req.params.itemId }
      ].filter(Boolean)
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity !== undefined) {
      if (quantity <= 0) {
        await cartItem.deleteOne();
        return res.json({ success: true, message: "Item removed from cart" });
      }
      cartItem.quantity = quantity;
    }

    await cartItem.save();
    res.json({ success: true, data: cartItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/:itemId — remove item from cart
router.delete("/:itemId", verifyJWT, async (req, res) => {
  try {
    const result = await Cart.deleteMany({
      userId: req.user.userId,
      $or: [
        { _id: req.params.itemId.match(/^[0-9a-fA-F]{24}$/) ? req.params.itemId : null },
        { productId: req.params.itemId }
      ].filter(Boolean)
    });

    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from cart" });
  }
});

export default router;
