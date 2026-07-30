import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sriramjewellerydpm_db_user:Admin%401234@cluster0.q12uggh.mongodb.net/jewellery_db?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const categories = ["Earrings", "Rings", "Bangles", "Chains"];
  for (const cat of categories) {
    const p = await db.collection("products").findOne({ category: cat });
    console.log(cat, p ? p.images[0] : "None");
  }
  process.exit(0);
}
run().catch(console.error);
