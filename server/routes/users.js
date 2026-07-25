import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// GET /api/users/me?email=user@gmail.com
router.get("/me", async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const user = await User.findOne({ email }).lean();
      if (user) {
        return res.json({ success: true, data: user });
      }
    }
    // Guest fallback
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// PUT /api/users/me
router.put("/me", async (req, res) => {
  try {
    const { email, name, shippingAddress } = req.body;
    if (email) {
      let user = await User.findOne({ email });
      if (user) {
        if (name) user.name = name;
        if (shippingAddress) user.shippingAddress = shippingAddress;
        await user.save();
        return res.json({ success: true, data: user });
      } else {
        // Optionally create the user if they don't exist
        user = new User({ email, name, shippingAddress });
        await user.save();
        return res.json({ success: true, data: user });
      }
    }
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

export default router;
