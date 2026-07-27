/**
 * Compute the price for a product based on the PRD §4.5 formula:
 *   X = weight × rate_per_gram       (metal value)
 *   Y = weight × wastage%            (wastage weight — not added to price)
 *   Z = Y × rate_per_gram            (wastage value in ₹)
 *   Final Price = X + Z + GST on (X+Z)
 *
 * @param {Object} product — the product document
 * @param {Object} rateMap — { gold: number, silver: number } rates per gram
 * @returns {number|undefined} — computed price, or undefined for quote-only products
 */
export const computePrice = (product, rateMap) => {
  // Quote-only products have no price
  if (product.isQuoteOnly || product.isFixedPrice === false) {
    return undefined;
  }

  const weight = product.weight || 0;
  if (weight === 0) {
    return product.price; // Truly fixed price product (no weight-based calc)
  }

  // Get the appropriate metal rate
  const metalType = product.metalType || "gold";
  let ratePerGram = 0;

  if (rateMap) {
    if (typeof rateMap === "object" && !rateMap.rate) {
      // New format: { gold: 7250, silver: 95 }
      ratePerGram = rateMap[metalType] || 0;
    } else if (rateMap.rate) {
      // Legacy format: { rate: 7250, silverRate: 95 }
      ratePerGram = metalType === "silver" ? (rateMap.silverRate || 0) : (rateMap.rate || 0);
    }
  }

  if (ratePerGram === 0) {
    return product.price; // Fallback to base price if no rate
  }

  const wastagePercent = product.wastagePercent || 0;
  const gstPercent = product.gstPercent || 0;

  const x = weight * ratePerGram;                    // Metal value
  const z = weight * (wastagePercent / 100) * ratePerGram; // Wastage value in ₹
  const subtotal = x + z;
  const gst = subtotal * (gstPercent / 100);
  const finalPrice = subtotal + gst;

  return Math.round(finalPrice);
};
