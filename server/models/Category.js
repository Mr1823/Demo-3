import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  categoryPic: { type: String },
  image: { type: String },
  productCount: { type: Number, default: 0 },
});

export const Category = mongoose.model("Category", CategorySchema);
