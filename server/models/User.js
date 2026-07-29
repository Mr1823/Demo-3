import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  fullName: { type: String },
  phone: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true }, // Not required for OTP-based customers
  passwordHash: { type: String }, // bcrypt hash — never store plaintext
  phone: { type: String, unique: true, sparse: true }, // unique and required for customers
  otpHash: { type: String }, // For MSG91 OTP
  otpExpiresAt: { type: Date },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  photoURL: { type: String },
  addresses: { type: [AddressSchema], default: [] },
  // Legacy field kept for backward compat
  shippingAddress: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", UserSchema);
