import express from "express";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { computePrice } from "../utils/computePrice.js";
import { verifyJWT } from "../middleware/auth.js";
import { getRates } from "../utils/getRates.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

import Razorpay from "razorpay";

// Lazy-load Razorpay to avoid crashes if not installed or keys missing
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return null;
    }
    try {
      razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    } catch (e) {
      console.error("Failed to initialize Razorpay:", e);
      return null;
    }
  }
  return razorpayInstance;
};

// Use shared getRates from utils

// POST /api/payment/create-order — create a Razorpay order with server-verified price
router.post("/create-order", verifyJWT, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({
        error: "Payment system not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      });
    }

    const { items, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Server-side price verification
    const rateMap = await getRates();
    let totalAmount = 0;
    let gstAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        $or: [
          { _id: item.productId?.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null },
          { productId: item.productId }
        ].filter(Boolean)
      }).lean();

      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.isQuoteOnly) {
        return res.status(400).json({ error: `Quote-only products cannot be purchased: ${product.name}` });
      }

      const priceData = computePrice(product, rateMap);
      const serverPrice = priceData ? priceData.finalPrice : (product.price || 0);
      const quantity = item.quantity || 1;
      totalAmount += serverPrice * quantity;

      const gstPercent = product.gstPercent || 0;
      const priceBeforeGst = serverPrice / (1 + gstPercent / 100);
      gstAmount += (serverPrice - priceBeforeGst) * quantity;

      verifiedItems.push({
        productId: product.productId || product._id.toString(),
        name: product.name,
        image: product.img || product.image || (product.images && product.images[0]),
        quantity,
        unitPrice: serverPrice,
        weight: product.weight,
        metalType: product.metalType,
        category: product.category,
      });
    }

    totalAmount = Math.round(totalAmount);
    gstAmount = Math.round(gstAmount);

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `ORD-${Date.now()}`,
      notes: {
        userId: req.user.userId,
        email: req.user.email,
      },
    });

    // Create order in our DB with pending status
    const order = await Order.create({
      orderId: razorpayOrder.receipt,
      userId: req.user.userId,
      email: req.user.email,
      items: verifiedItems,
      totalAmount,
      gstAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment create-order error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST /api/payment/verify — verify Razorpay payment signature
router.post("/verify", verifyJWT, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed — invalid signature" });
    }

    // Update order with payment details
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "paid",
        orderStatus: "processing",
        paymentMethod: "razorpay",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

export default router;
