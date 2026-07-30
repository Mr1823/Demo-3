import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Category } from "../models/Category.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();



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

// ─── Cloudinary Signed Upload ────────────────────────────────────────────────
// Signs a direct-to-Cloudinary upload so the API secret never reaches the browser.
router.get("/cloudinary-signature", verifyJWT, requireAdmin, (req, res) => {
  if (!process.env.CLOUDINARY_URL) {
    return res.status(503).json({ error: "Cloudinary is not configured" });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    cloudinary.config().api_secret
  );

  res.json({
    signature,
    timestamp,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
  });
});

export default router;
