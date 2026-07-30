import express from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { computePrice } from "../utils/computePrice.js";
import { getRates } from "../utils/getRates.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── User Orders ─────────────────────────────────────────────────────────────

// GET /api/orders — user's own orders
router.get("/", verifyJWT, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/admin/all — all orders (admin only)
router.get("/admin/all", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id — single order
router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // Users can only see their own orders, admins can see all
    if (req.user.role !== "ADMIN" && order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view this order" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /api/orders — create order with server-side price verification
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { items, shippingAddress, name, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Server-side price verification (PRD: price never trusted from frontend)
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
        return res.status(400).json({ error: `Quote-only products cannot be ordered directly: ${product.name}` });
      }

      const priceData = computePrice(product, rateMap);
      const serverPrice = priceData ? priceData.finalPrice : (product.price || 0);
      const quantity = item.quantity || 1;
      const lineTotal = serverPrice * quantity;

      // Calculate GST for this item
      const gstPercent = product.gstPercent || 0;
      const priceBeforeGst = serverPrice / (1 + gstPercent / 100);
      const itemGst = (serverPrice - priceBeforeGst) * quantity;
      gstAmount += itemGst;

      totalAmount += lineTotal;

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

    const newOrder = new Order({
      orderId: `ORD-${Date.now()}`,
      userId: req.user.userId,
      email: req.user.email,
      name: name || undefined,
      items: verifiedItems,
      totalAmount: Math.round(totalAmount),
      gstAmount: Math.round(gstAmount),
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "pending",
      orderStatus: "processing",
    });

    await newOrder.save();

    // Clear cart after successful order
    await Cart.deleteMany({ userId: req.user.userId });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PATCH /api/orders/:id/status — admin update order status
router.patch("/:id/status", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// PATCH /api/orders/:id/cancel — user cancels their own order (within 7 days, while still processing)
router.patch("/:id/cancel", verifyJWT, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to cancel this order" });
    }
    if (order.orderStatus !== "processing") {
      return res.status(400).json({ error: "Only processing orders can be cancelled" });
    }

    const diffInDays = (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffInDays > 7) {
      return res.status(400).json({ error: "No orders can be cancelled after 7 days of ordering" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// DELETE /api/orders/delete-cart-items — clear user's cart
router.delete("/delete-cart-items", verifyJWT, async (req, res) => {
  try {
    const result = await Cart.deleteMany({ userId: req.user.userId });
    res.json({ deletedCount: result.deletedCount, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart items" });
  }
});

export default router;
