import mongoose from "mongoose";
import { Cart } from "./server/models/Cart.js";
import { Product } from "./server/models/Product.js";

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:50303/");
  
  // Find all quote only products
  const quoteProducts = await Product.find({ isQuoteOnly: true }).lean();
  const quoteIds = quoteProducts.map(p => p.productId);
  
  const result = await Cart.deleteMany({ productId: { $in: quoteIds } });
  console.log(`Deleted ${result.deletedCount} quote-only items from carts.`);

  process.exit(0);
}
run();
