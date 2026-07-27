import { GoldRate } from "../models/GoldRate.js";

export const getRates = async () => {
  const rates = await GoldRate.find().lean();
  const rateMap = {};
  for (const r of rates) {
    if (r.metalType) rateMap[r.metalType] = r.ratePerGram;
  }
  return rateMap;
};
