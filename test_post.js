import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const token = jwt.sign(
  { userId: "test_user_456", role: "USER", email: "test@example.com" },
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production",
  { expiresIn: "1h" }
);

fetch("http://localhost:5000/api/wishlist", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: "product_1",
    name: "Golden Ring",
    price: 100,
    category: "Rings"
  })
}).then(res => res.json()).then(console.log).catch(console.error);
