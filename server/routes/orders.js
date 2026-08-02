import express from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { computePrice } from "../utils/computePrice.js";
import { getRates } from "../utils/getRates.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import {
  validate,
  createOrderSchema,
  orderStatusSchema,
  orderApprovalSchema,
} from "../middleware/validate.js";

const router = express.Router();

// How long after the owner approves an order it is promised for delivery.
// Single source of truth — the client displays this date, it never computes it.
export const DELIVERY_WINDOW_DAYS = 15;

// Statuses an order may not reach until the owner has approved it. "processing"
// is the resting state of a new order, and "cancelled" must stay available.
const REQUIRES_APPROVAL = ["shipped", "delivered"];

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
router.post("/", verifyJWT, validate(createOrderSchema), async (req, res) => {
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

    // Clear cart after successful order — but a "Buy Now" purchase bypasses the
    // cart entirely, so it must leave whatever the user had saved intact.
    if (!req.body.buyNow) {
      await Cart.deleteMany({ userId: req.user.userId });
    }

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PATCH /api/orders/:id/status — admin update order status
router.patch("/:id/status", verifyJWT, requireAdmin, validate(orderStatusSchema), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Enforced here rather than only in the admin UI: an unapproved order has
    // no delivery window, so it must not be able to reach a fulfilment status.
    if (REQUIRES_APPROVAL.includes(status) && order.approvalStatus !== "APPROVED") {
      return res.status(400).json({
        error: "Approve this order before marking it shipped or delivered",
      });
    }

    order.orderStatus = status;

    // Stamped once, on the first transition into delivered, so re-saving a
    // delivered order does not move the date the customer was shown.
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// PATCH /api/orders/:id/approval — owner approves or rejects an order (admin)
router.patch("/:id/approval", verifyJWT, requireAdmin, validate(orderApprovalSchema), async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Idempotent guard: re-approving would silently push the promised delivery
    // date back, after the customer has already been shown the first one.
    if (order.approvalStatus === approvalStatus) {
      return res.status(400).json({
        error: `This order is already ${approvalStatus.toLowerCase()}`,
      });
    }
    if (order.approvalStatus === "APPROVED" && approvalStatus === "REJECTED") {
      return res.status(400).json({ error: "An approved order cannot be rejected" });
    }

    if (approvalStatus === "APPROVED") {
      const approvedAt = new Date();
      order.approvalStatus = "APPROVED";
      order.approvedAt = approvedAt;
      // Computed server-side only — a client-supplied date is never trusted.
      order.expectedDeliveryDate = new Date(
        approvedAt.getTime() + DELIVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000
      );
      order.rejectionReason = null;
    } else {
      order.approvalStatus = "REJECTED";
      order.rejectionReason = rejectionReason || null;
      order.approvedAt = null;
      order.expectedDeliveryDate = null;
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Order approval error:", error);
    res.status(500).json({ error: "Failed to update order approval" });
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
