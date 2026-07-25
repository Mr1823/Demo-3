import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  photoURL: { type: String },
  shippingAddress: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", UserSchema);
