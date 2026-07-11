import express from "express";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const mockUser = {
    id: `u-${Date.now()}`,
    email,
    name: email.split("@")[0] || "User",
    role: email.includes("admin") ? "ADMIN" : "USER",
    photoURL: "/placeholder-user.png",
  };

  res.json({ success: true, user: mockUser });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { email, name } = req.body;
  res.json({
    success: true,
    user: {
      id: `u-${Date.now()}`,
      email,
      name: name || "New User",
      role: "USER",
    },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out cleanly" });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  res.json({ success: false, message: "No active session" });
});

export default router;
