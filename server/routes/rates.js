import express from "express";
import { GoldRate } from "../models/GoldRate.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/rates — fetch current gold and silver rates
router.get("/", verifyJWT, async (req, res) => {
  try {
    const rates = await GoldRate.find().lean();

    // Build response object
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

    // Fallback: legacy single-document format
    if (rates.length === 1 && rates[0].rate) {
      goldRate = rates[0].rate;
      silverRate = rates[0].silverRate || 0;
      updatedAt = rates[0].updatedAt;
    }

    res.json({
      gold: { metalType: "gold", ratePerGram: goldRate, updatedAt },
      silver: { metalType: "silver", ratePerGram: silverRate, updatedAt },
      // Backward compat
      rate: goldRate,
      silverRate,
      updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

// PATCH /api/rates — update gold/silver rates (admin only)
router.patch("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { gold, silver, rate, silverRate: silverRateVal } = req.body;

    // Support both new format {gold: 7250, silver: 95} and legacy {rate: 7250, silverRate: 95}
    const goldRateValue = gold || rate;
    const silverRateValue = silver || silverRateVal;

    if (goldRateValue !== undefined) {
      await GoldRate.findOneAndUpdate(
        { metalType: "gold" },
        { metalType: "gold", ratePerGram: goldRateValue, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    if (silverRateValue !== undefined) {
      await GoldRate.findOneAndUpdate(
        { metalType: "silver" },
        { metalType: "silver", ratePerGram: silverRateValue, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    // Fetch updated rates
    const rates = await GoldRate.find().lean();

    res.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    console.error("Update rates error:", error);
    res.status(500).json({ error: "Failed to update rates" });
  }
});

export default router;
