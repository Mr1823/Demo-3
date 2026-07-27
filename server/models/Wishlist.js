import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String },
  name: { type: String, required: true },
  img: { type: String },
  image: { type: String },
  category: { type: String },
  price: { type: Number },
  addedAt: { type: Date, default: Date.now },
});

// Index for efficient user-based queries
WishlistSchema.index({ userId: 1, productId: 1 });

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
