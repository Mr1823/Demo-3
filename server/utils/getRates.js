import { GoldRate } from "../models/GoldRate.js";
import { isRateStale } from "./rateGuards.js";

export const getRates = async () => {
  const rates = await GoldRate.find().lean();
  const rateMap = {};
  for (const r of rates) {
    if (r.metalType) rateMap[r.metalType] = r.ratePerGram;
  }
  return rateMap;
};

/**
 * Rates plus the metadata needed to decide whether they can still be trusted.
 * Kept separate from getRates() so existing pricing callers are untouched.
 *
 * @returns {{ rateMap: Object, updatedAt: Object, staleMetals: string[] }}
 */
export const getRateStatus = async () => {
  const rates = await GoldRate.find().lean();
  const rateMap = {};
  const updatedAt = {};
  const staleMetals = [];

  for (const r of rates) {
    if (!r.metalType) continue;
    rateMap[r.metalType] = r.ratePerGram;
    updatedAt[r.metalType] = r.updatedAt || null;
    if (isRateStale(r.updatedAt)) staleMetals.push(r.metalType);
  }

  return { rateMap, updatedAt, staleMetals };
};

/**
 * Which metals in a basket cannot currently be priced. A stale rate is worse
 * than no rate: it yields a confident, wrong number that the customer is then
 * charged. Refusing is the safe failure.
 *
 * Products with no weight are priced from a stored figure rather than the live
 * rate, so they are unaffected.
 */
export const findStaleMetalsForProducts = (products, staleMetals) => {
  if (!staleMetals.length) return [];
  const affected = new Set();
  for (const product of products) {
    if (!product || product.isQuoteOnly || !product.weight) continue;
    const metal = product.metalType || "gold";
    if (staleMetals.includes(metal)) affected.add(metal);
  }
  return [...affected];
};
