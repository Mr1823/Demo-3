import express from "express";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { validate, newsletterSchema } from "../middleware/validate.js";
import { publicFormLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// POST /api/newsletter — subscribe an email (public)
router.post("/", publicFormLimiter, validate(newsletterSchema), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({ success: true, message: "You're already subscribed" });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// GET /api/newsletter — list all subscribers (admin only)
router.get("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

export default router;
