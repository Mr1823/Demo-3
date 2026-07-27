import express from "express";
import { GoldRate } from "../models/GoldRate.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/gold-rate — fetch latest gold/silver rate (legacy backward compat)
router.get("/", verifyJWT, async (req, res) => {
  try {
    // Try new per-metal format first
    const rates = await GoldRate.find().lean();

    let goldRate = 0;
    let silverRate = 0;
    let updatedAt = new Date();

    for (const r of rates) {
      if (r.metalType === "gold") {
        goldRate = r.ratePerGram;
        updatedAt = r.updatedAt;
      } else if (r.metalType === "silver") {
        silverRate = r.ratePerGram;
      }
    }

    // Legacy fallback
    if (rates.length === 1 && rates[0].rate) {
      goldRate = rates[0].rate;
      silverRate = rates[0].silverRate || 0;
      updatedAt = rates[0].updatedAt;
    }

    res.json({ rate: goldRate, silverRate, updatedAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gold rate" });
  }
});

// PATCH /api/gold-rate — update gold/silver rate (admin-only, legacy compat)
router.patch("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { rate, silverRate } = req.body;

    if (rate !== undefined) {
      await GoldRate.findOneAndUpdate(
        { metalType: "gold" },
        { metalType: "gold", ratePerGram: rate, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    if (silverRate !== undefined) {
      await GoldRate.findOneAndUpdate(
        { metalType: "silver" },
        { metalType: "silver", ratePerGram: silverRate, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    const updatedRates = await GoldRate.find().lean();
    res.json({ success: true, data: updatedRates });
  } catch (error) {
    res.status(500).json({ error: "Failed to update gold rate" });
  }
});

export default router;
