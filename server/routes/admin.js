import express from "express";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Category } from "../models/Category.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ─── Users ───────────────────────────────────────────────────────────────────
router.get("/users", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/users/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-passwordHash");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get("/orders", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



// ─── Categories ──────────────────────────────────────────────────────────────
router.get("/categories", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const { Product } = await import("../models/Product.js");
    
    // Add itemCount to each category by querying the Product collection
    for (let cat of categories) {
      cat.itemCount = await Product.countDocuments({ category: cat.categoryName });
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json({ success: true, insertedId: category._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.patch("/categories/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ─── Total Spent (per user) ─────────────────────────────────────────────────
router.get("/total-spent", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: "$email", totalSpent: { $sum: "$totalAmount" } } },
      { $project: { email: "$_id", totalSpent: 1, _id: 0 } },
      { $sort: { totalSpent: -1 } },
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total spent" });
  }
});

export default router;
