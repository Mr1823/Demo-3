import mongoose from 'mongoose';
import { Product } from './server/models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const p = await Product.findOne({ "price": { $type: "object" } }).lean();
  console.log("Product with object price:", p);
  const p2 = await Product.findOne().lean();
  console.log("Any product:", p2.price, typeof p2.price);
  process.exit(0);
}
run();
