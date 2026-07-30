import mongoose from "mongoose";

const QuoteRequestSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String },
  productImage: { type: String },
  isQuoteOnly: { type: Boolean, default: false },
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Contacted', 'Closed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export const QuoteRequest = mongoose.model("QuoteRequest", QuoteRequestSchema);
