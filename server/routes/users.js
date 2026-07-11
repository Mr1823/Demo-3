import express from "express";

const router = express.Router();

const users = {
  "user@gmail.com": {
    id: "u-1",
    name: "Jewellery Connoisseur",
    email: "user@gmail.com",
    role: "USER",
    photoURL: "/placeholder-user.png",
    shippingAddress: {
      street: "123 Diamond Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 9876543210",
    },
  },
};

// GET /api/users/me?email=user@gmail.com
router.get("/me", (req, res) => {
  const { email } = req.query;
  if (email && users[email]) {
    return res.json({ success: true, data: users[email] });
  }
  res.json({
    success: true,
    data: {
      id: "guest-id",
      name: "Guest User",
      email: email || "guest@jewelstore.com",
      role: "USER",
      photoURL: "/placeholder-user.png",
      shippingAddress: {},
    },
  });
});

// PUT /api/users/me
router.put("/me", (req, res) => {
  const { email, name, shippingAddress } = req.body;
  if (email && users[email]) {
    users[email].name = name || users[email].name;
    users[email].shippingAddress = shippingAddress || users[email].shippingAddress;
    return res.json({ success: true, data: users[email] });
  }
  res.json({ success: true, message: "Profile updated" });
});

export default router;
