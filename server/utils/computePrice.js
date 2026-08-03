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
  // Quote-only products have no price.
  //
  // isFixedPrice is deliberately not consulted. The guard used to bail out when
  // it was false, which is backwards: "not a fixed price" means the piece
  // should be priced from the live metal rate, not that it has no price. The
  // effect was that most products fell through to the stored `price` field —
  // the making charge — and showed that to the customer as the entire price,
  // omitting metal value, wastage and GST.
  if (product.isQuoteOnly) {
    return undefined;
  }

  const weight = product.weight || 0;
  if (weight === 0) {
    return { finalPrice: product.price, priceBreakdown: null };
  }

  // Get the appropriate metal rate
  const metalType = product.metalType || "gold";
  const ratePerGram = rateMap ? (rateMap[metalType] || 0) : 0;

  if (ratePerGram === 0) {
    console.error(`[computePrice] Data Error: Missing rate for metalType '${metalType}'. Product ID: ${product._id || product.productId}`);
    return undefined; // Degrade to quote-only rather than showing a stale price
  }

  const wastagePercent = product.wastagePercent || 0;
  const gstPercent = product.gstPercent || 0;

  const x = weight * ratePerGram;                    // Metal value
  const z = weight * (wastagePercent / 100) * ratePerGram; // Wastage value in ₹
  const subtotal = x + z;
  const gst = subtotal * (gstPercent / 100);
  const finalPrice = subtotal + gst;

  return {
    finalPrice: Math.round(finalPrice),
    priceBreakdown: {
      metalValue: Math.round(x),
      wastageValue: Math.round(z),
      gst: Math.round(gst),
      ratePerGram
    }
  };
};
