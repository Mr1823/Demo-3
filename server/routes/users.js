import express from "express";
import { User } from "../models/User.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// ─── Current User Profile ────────────────────────────────────────────────────

// GET /api/users/me — get authenticated user's profile
router.get("/me", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: {
        ...user,
        admin: user.role === "ADMIN",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// PATCH /api/users/me — update authenticated user's profile
router.patch("/me", verifyJWT, async (req, res) => {
  try {
    const { name, phone, photoURL } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// ─── Addresses ───────────────────────────────────────────────────────────────

// PATCH /api/users/shipping-address
router.patch("/shipping-address", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { shippingAddress: req.body } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, modifiedCount: 1, data: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// PATCH /api/users/delete-address
router.patch("/delete-address", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOneAndUpdate(
      { email },
      { $unset: { shippingAddress: "" } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, modifiedCount: 1, data: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// GET /api/users/me/addresses
router.get("/me/addresses", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("addresses").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, data: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// POST /api/users/me/addresses
router.post("/me/addresses", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    };

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ error: "Failed to add address" });
  }
});

// PATCH /api/users/me/addresses/:id
router.patch("/me/addresses/:id", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // If setting as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// DELETE /api/users/me/addresses/:id
router.delete("/me/addresses/:id", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    address.deleteOne();
    await user.save();

    res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// ─── Admin User Management ──────────────────────────────────────────────────

// GET /api/users — admin list all users
router.get("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PATCH /api/users/:id/role — admin update user role
router.patch("/:id/role", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({ error: "Valid role (ADMIN or USER) is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
});

export default router;
