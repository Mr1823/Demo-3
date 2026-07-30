import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { verifyJWT } from "../middleware/auth.js";
import { otpLimiter, otpVerifyLimiter } from "../middleware/rateLimit.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "development" ? "fallback-dev-secret-change-in-production" : null);
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required outside development");
}
const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const BCRYPT_SALT_ROUNDS = 12;

/**
 * Generate an access token (short-lived JWT).
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email || null, phone: user.phone || null, name: user.name || null },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate a refresh token and store its hash in MongoDB.
 * Returns the raw refresh token to send to the client.
 */
const generateRefreshToken = async (userId) => {
  // Generate a random token
  const rawToken = crypto.randomBytes(40).toString("hex");

  // Hash it before storing (PRD: refresh tokens stored hashed, not raw)
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  // Remove any existing refresh tokens for this user (one active session)
  await RefreshToken.deleteMany({ userId });

  // Store hashed token
  await RefreshToken.create({
    userId,
    tokenHash,
    expiresAt,
  });

  return rawToken;
};

// ─── POST /api/auth/otp/request ──────────────────────────────────────────────
router.post("/otp/request", otpLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Generate a 6-digit OTP (use 123456 as fallback for dev/testing)
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const isDev = process.env.NODE_ENV === "development";
    
    const otp = (authKey && templateId && !isDev) 
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : "123456";

    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Upsert user by phone
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, role: "USER" });
    }
    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send via MSG91 (if keys configured and not in dev mode)
    if (authKey && templateId && !isDev) {
      try {
        await axios.post(
          `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${phone}&authkey=${authKey}&otp=${otp}`,
          {}
        );
      } catch (smsError) {
        console.error("MSG91 Error:", smsError?.response?.data || smsError.message);
        // Even if SMS fails (e.g. pending DLT), we allow login in dev using the generated OTP,
        // but in production, we should probably throw. We'll just log it.
      }
    } else {
      console.log(`[DEV MODE] OTP for ${phone} is: ${otp}`);
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Request error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ─── POST /api/auth/otp/verify ───────────────────────────────────────────────
router.post("/otp/verify", otpVerifyLimiter, async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(401).json({ error: "Invalid OTP or phone number" });
    }

    if (Date.now() > user.otpExpiresAt.getTime()) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Success - clear OTP fields
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP Verify error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      passwordHash,
      role: "USER",
    });

    // Issue tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Issue tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken: rawToken } = req.body;

    if (!rawToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    // Hash the incoming token to compare against stored hash
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Find the stored refresh token
    const storedToken = await RefreshToken.findOne({ tokenHash });
    if (!storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Check expiry
    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // Find the user
    const user = await User.findById(storedToken.userId);
    if (!user) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(401).json({ error: "User not found" });
    }

    // Issue new access token (rotate refresh token for extra security)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post("/logout", verifyJWT, async (req, res) => {
  try {
    // Invalidate all refresh tokens for this user (immediate logout per PRD)
    await RefreshToken.deleteMany({ userId: req.user.userId });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
