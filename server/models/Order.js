import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String },          // Firebase UID
  email: { type: String, required: true },
  name: { type: String },

  // Structured line items (PRD §5)
  items: [{
    productId: { type: String, required: true },
    name: { type: String },
    image: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number },
    weight: { type: Number },
    metalType: { type: String, enum: ["gold", "silver"] },
    category: { type: String },
  }],

  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  orderStatus: { type: String, default: "processing" },

  // Razorpay (PRD §4.1)
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentStatus: { type: String },
  paymentMethod: { type: String },

  shippingAddress: { type: Object },
  createdAt: { type: Date, default: Date.now },

  // Legacy field — kept for backward compat
  products: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);
