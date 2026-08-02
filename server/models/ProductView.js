import mongoose from "mongoose";

/**
 * One document per product view.
 *
 * Deliberately an event collection rather than a `viewCount` field on Product:
 * a bare counter cannot answer "most viewed this week" (the question the admin
 * chart actually asks), cannot be deduplicated per visitor, and cannot be
 * broken down by guest vs signed-in traffic. Storing events keeps all three
 * open at the cost of a TTL index to bound growth.
 */
const ProductViewSchema = new mongoose.Schema({
  productId: { type: String, required: true },

  // Denormalised so the admin aggregation does not need a $lookup, and so a
  // deleted product still reports the views it earned while it was listed.
  productName: { type: String },
  productImage: { type: String },
  category: { type: String },

  // Null for guests — browsing is open to them, so most views have no user.
  userId: { type: String, default: null },

  // Per-browser-session id used to deduplicate; guests have no userId, so this
  // is what distinguishes "one person refreshing" from "ten people looking".
  sessionId: { type: String, required: true },

  viewedAt: { type: Date, default: Date.now },
});

// Serves the dedupe lookup on write (the hot path: every product page load).
ProductViewSchema.index({ productId: 1, sessionId: 1, viewedAt: -1 });

// Serves the "trending in the last N days" aggregation.
ProductViewSchema.index({ viewedAt: -1 });

// Views older than 90 days answer no question the dashboard asks, so let Mongo
// reclaim them rather than growing this collection without bound.
ProductViewSchema.index({ viewedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const ProductView = mongoose.model("ProductView", ProductViewSchema);
