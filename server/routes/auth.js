import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { verifyJWT, JWT_SECRET } from "../middleware/auth.js";
import { otpLimiter, otpVerifyLimiter } from "../middleware/rateLimit.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Fail closed on every auth route if the signing secret is missing, rather than
// throwing at import time and crashing the entire API.
router.use((req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(503).json({ error: "Authentication is not configured on this server" });
  }
  next();
});

const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const BCRYPT_SALT_ROUNDS = 12;

// The fixed OTP that lets any caller sign in as any phone number. It exists so
// the app is usable while MSG91 is blocked on DLT registration, and it must
// stay off unless explicitly turned on.
const TEST_OTP = "123456";

// Fails CLOSED: only the exact string "true" enables it. A missing, empty or
// misspelt value — the realistic mistake of forgetting to set it on a server —
// leaves it off. Deliberately NOT keyed on NODE_ENV: the old code accepted the
// test OTP whenever MSG91 was unconfigured, which is exactly the production
// state, so production accepted 123456 for every number.
const isTestOtpEnabled = () => process.env.ALLOW_TEST_OTP === "true";

/**
 * Optional allowlist, e.g. TEST_OTP_PHONES="9363750806,9876543210".
 *
 * Unset means the bypass applies to every number, which also means every
 * existing customer account can be signed into by anyone who knows the phone
 * number. Setting it confines the bypass to demo handsets, so a shared
 * preview link cannot be used to reach a real account.
 */
const testOtpPhones = () =>
  (process.env.TEST_OTP_PHONES || "")
    .split(",")
    .map((s) => s.trim().replace(/^\+?91/, ""))
    .filter(Boolean);

const isTestOtpAllowedFor = (phone) => {
  if (!isTestOtpEnabled()) return false;
  const allowed = testOtpPhones();
  if (!allowed.length) return true; // no allowlist configured — applies to all
  return allowed.includes(String(phone).trim().replace(/^\+?91/, ""));
};

const isSmsConfigured = () =>
  Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID);

// Announce the bypass loudly at startup so an operator cannot leave it on by
// accident without seeing it in the logs.
if (isTestOtpEnabled()) {
  const scoped = testOtpPhones();
  console.warn(
    `⚠️  ALLOW_TEST_OTP=true — the fixed test OTP (123456) is accepted for ${
      scoped.length ? `these numbers only: ${scoped.join(", ")}` : "ALL phone numbers"
    }. This is an authentication bypass; turn it off before launch.`
  );
}

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

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const smsConfigured = isSmsConfigured();
    const testOtp = isTestOtpAllowedFor(phone);

    // Neither a real SMS channel nor the deliberate test bypass: there is no way
    // to deliver a code, so refuse rather than write an OTP nobody can receive.
    // The message reveals nothing about whether the number is registered.
    if (!smsConfigured && !testOtp) {
      return res.status(503).json({
        error: "OTP delivery is temporarily unavailable. Please try again later.",
      });
    }

    // Upsert user by phone
    let user = await User.findOne({ phone });

    // Admins sign in with email and password only. This path mints a token
    // carrying whatever role the record holds, so an admin with a phone number
    // set would otherwise be reachable by OTP — and by the test OTP whenever
    // that is enabled. Answer exactly as for any other number (no OTP is
    // stored, so nothing can be verified) rather than confirming the number
    // belongs to an administrator.
    if (user?.role === "ADMIN") {
      console.warn(`Refused OTP request for admin account (phone ${phone}) — admins use password sign-in.`);
      return res.json({ success: true, message: "OTP sent successfully" });
    }

    const otp = smsConfigured
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : TEST_OTP;

    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    if (!user) {
      user = new User({ phone, role: "USER" });
    }
    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    if (smsConfigured) {
      try {
        await axios.post(
          `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${phone}&authkey=${authKey}&otp=${otp}`,
          {}
        );
      } catch (smsError) {
        console.error("MSG91 Error:", smsError?.response?.data || smsError.message);
        // The OTP is stored; if delivery failed the user simply cannot verify.
        // We do not fall back to the test code here.
      }
    } else {
      // Reached only when testOtp is on. Keep it visible in the logs.
      console.warn(
        `⚠️  [TEST OTP] MSG91 not configured — accepting fixed OTP for ${phone} because ALLOW_TEST_OTP=true.`
      );
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

    // Second layer: even if a record somehow carries a valid OTP (set before
    // the account was promoted, or written directly), this path must never
    // issue an admin token. Same generic message — no confirmation of role.
    if (user.role === "ADMIN") {
      console.warn(`Refused OTP verification for admin account (phone ${phone}).`);
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
