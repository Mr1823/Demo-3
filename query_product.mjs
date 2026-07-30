import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sriramjewellerydpm_db_user:Admin%401234@cluster0.q12uggh.mongodb.net/jewellery_db?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const products = await db.collection("products").find({ name: /Classic Necklaces/i }).toArray();
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}
run().catch(console.error);
