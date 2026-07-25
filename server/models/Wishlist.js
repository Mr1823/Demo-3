import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  img: { type: String },
  image: { type: String },
  category: { type: String },
  price: { type: Number },
  addedAt: { type: Date, default: Date.now },
});

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
