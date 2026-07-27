import mongoose from "mongoose";

const GoldRateSchema = new mongoose.Schema({
  metalType: { type: String, enum: ["gold", "silver"], required: true },
  ratePerGram: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const GoldRate = mongoose.model("GoldRate", GoldRateSchema);
