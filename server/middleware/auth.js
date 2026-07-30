import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "development" ? "fallback-dev-secret-change-in-production" : null);
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required outside development");
}

/**
 * Middleware: Verify JWT access token.
 * Attaches req.user = { userId, role } on success.
 */
export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid access token" });
  }
};

/**
 * Middleware: Require ADMIN role (must be used after verifyJWT).
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
