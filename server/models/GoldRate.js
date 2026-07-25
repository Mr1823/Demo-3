import mongoose from "mongoose";

const GoldRateSchema = new mongoose.Schema({
  rate: { type: Number, required: true },
  silverRate: { type: Number },
  updatedAt: { type: Date, default: Date.now },
});

export const GoldRate = mongoose.model("GoldRate", GoldRateSchema);
