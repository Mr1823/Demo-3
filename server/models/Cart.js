import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String },
  name: { type: String, required: true },
  img: { type: String },
  image: { type: String },
  category: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

// Index for efficient user-based queries
CartSchema.index({ userId: 1, productId: 1 });

export const Cart = mongoose.model("Cart", CartSchema);
