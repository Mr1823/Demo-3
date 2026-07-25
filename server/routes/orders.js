import express from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let orders;
    if (email) {
      orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();
    } else {
      orders = await Order.find().sort({ createdAt: -1 }).lean();
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      orderId: req.body.orderId || `ord-${Date.now()}`,
      ...req.body,
      orderStatus: "processing",
    });
    await newOrder.save();
    res.json({ insertedId: newOrder._id, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// DELETE /api/orders/delete-cart-items?email=user@gmail.com
// Actually clears the user's cart from MongoDB
router.delete("/delete-cart-items", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ deletedCount: 0, success: false });
    const result = await Cart.deleteMany({ email });
    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart items" });
  }
});

export default router;
