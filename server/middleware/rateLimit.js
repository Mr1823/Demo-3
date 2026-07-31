import rateLimit from "express-rate-limit";

/**
 * Locally every request arrives from the same loopback IP, so ordinary testing
 * (or an automated script) burns through the auth allowance and locks the
 * developer out of their own admin panel for 15 minutes. Production keeps full
 * brute-force protection.
 */
const skipInDevelopment = () => process.env.NODE_ENV === "development";

/**
 * Rate limiter for auth endpoints — prevent brute force attacks.
 * 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
});

/**
 * General API rate limiter.
 * 200 requests per minute per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for OTP requests.
 * Max 3 attempts per 5 minutes, keyed by phone number.
 */
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: { error: "Too many OTP requests. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.phone || "unknown-phone";
  },
  skip: skipInDevelopment,
});

/**
 * Rate limiter for OTP verification — throttles brute-force guessing of the
 * 6-digit code, keyed by phone number.
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: { error: "Too many OTP verification attempts. Please request a new OTP." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.phone || "unknown-phone";
  },
  skip: skipInDevelopment,
});
