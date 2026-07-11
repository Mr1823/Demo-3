import express from "express";

const router = express.Router();

const orders = [];

// GET /api/orders
router.get("/", (req, res) => {
  const { email } = req.query;
  if (email) {
    return res.json(orders.filter((o) => o.email === email));
  }
  res.json(orders);
});

// POST /api/orders
router.post("/", (req, res) => {
  const newOrder = {
    _id: `order-${Date.now()}`,
    orderId: req.body.orderId || `ord-${Date.now()}`,
    ...req.body,
    date: new Date(),
    orderStatus: "processing",
  };
  orders.push(newOrder);
  res.json({ insertedId: newOrder._id, success: true });
});

// DELETE /api/delete-cart-items?email=user@gmail.com
router.delete("/delete-cart-items", (req, res) => {
  res.json({ deletedCount: 5, success: true });
});

export default router;
