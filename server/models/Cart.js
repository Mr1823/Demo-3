import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  img: { type: String },
  image: { type: String },
  category: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

export const Cart = mongoose.model("Cart", CartSchema);
