import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // contactSchema already validated these two, but nothing declared them, so
  // Mongoose's strict mode dropped them while the route reported success.
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);
