import express from "express";
import { GoldRate } from "../models/GoldRate.js";

const router = express.Router();

// GET /api/gold-rate — fetch latest gold/silver rate
router.get("/", async (req, res) => {
  try {
    const rate = await GoldRate.findOne().sort({ updatedAt: -1 });
    if (!rate) {
      return res.json({ rate: 0, silverRate: 0, updatedAt: new Date() });
    }
    res.json(rate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gold rate" });
  }
});

// PATCH /api/gold-rate — update gold/silver rate (admin-only)
router.patch("/", async (req, res) => {
  try {
    const { rate, silverRate } = req.body;
    let goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    if (!goldRate) {
      goldRate = new GoldRate({ rate: rate || 0, silverRate: silverRate || 0 });
    } else {
      if (rate !== undefined) goldRate.rate = rate;
      if (silverRate !== undefined) goldRate.silverRate = silverRate;
      goldRate.updatedAt = Date.now();
    }
    await goldRate.save();
    res.json({ success: true, data: goldRate });
  } catch (error) {
    res.status(500).json({ error: "Failed to update gold rate" });
  }
});

export default router;
