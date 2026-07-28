import mongoose from "mongoose";
import { Wishlist } from "./server/models/Wishlist.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const doc = new Wishlist({
        productId: "test_product_123",
        userId: "test_user_456",
        name: "Test Product",
        price: 100
      });
      await doc.save();
      console.log("Success!");
      await Wishlist.deleteOne({ _id: doc._id });
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  });
