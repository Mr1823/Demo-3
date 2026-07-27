import express from "express";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { sendWhatsAppAlert } from "../utils/whatsapp.js";

const router = express.Router();

// POST /api/quotes — submit a quote request
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { productId, productName, productImage, customerName, customerMobile } = req.body;

    if (!productId || !customerName || !customerMobile) {
      return res.status(400).json({
        error: "productId, customerName, and customerMobile are required",
      });
    }

    const quote = await QuoteRequest.create({
      productId,
      productName,
      productImage,
      customerName,
      customerMobile,
    });

    // Send WhatsApp alert to admin (non-blocking)
    sendWhatsAppAlert({
      customerName,
      customerMobile,
      productName: productName || productId,
    }).catch((err) => {
      console.warn("WhatsApp alert failed (non-critical):", err.message);
    });

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(500).json({ error: "Failed to submit quote request" });
  }
});

// GET /api/quotes — list all quote requests (admin only)
router.get("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quote requests" });
  }
});

export default router;
