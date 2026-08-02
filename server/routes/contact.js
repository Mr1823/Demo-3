import express from "express";
import { ContactMessage } from "../models/ContactMessage.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { validate, contactSchema } from "../middleware/validate.js";
import { publicFormLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// POST /api/contact — submit a contact message (public — visitors may not be logged in)
router.post("/", publicFormLimiter, validate(contactSchema), async (req, res) => {
  try {
    // Presence and shape are already guaranteed by validate(contactSchema).
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, data: contactMessage });
  } catch (error) {
    console.error("Create contact message error:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

// GET /api/contact — list all contact messages (admin only)
router.get("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

export default router;
