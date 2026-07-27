import express from "express";
import { Review } from "../models/Review.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

// GET /api/reviews/:productId — reviews for a specific product
router.get("/:productId", verifyJWT, async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET /api/reviews — all reviews (used by admin dashboard)
router.get("/", verifyJWT, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews — create a review (authenticated user)
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { productId, productName, review, rating } = req.body;

    if (!review || !rating) {
      return res.status(400).json({ error: "Review text and rating are required" });
    }

    const newReview = await Review.create({
      productId,
      productName,
      name: req.body.name || "Anonymous",
      review,
      rating: Number(rating),
      location: req.body.location || "",
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

export default router;
