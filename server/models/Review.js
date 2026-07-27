import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  location: { type: String },
  productId: { type: String },
  productName: { type: String },
  userId: { type: String },
  date: { type: Date, default: Date.now },
});

export const Review = mongoose.model("Review", ReviewSchema);
