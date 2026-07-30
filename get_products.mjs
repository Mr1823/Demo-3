import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sriramjewellerydpm_db_user:Admin%401234@cluster0.q12uggh.mongodb.net/jewellery_db?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Get the specific product
  const targetProduct = await db.collection("products").findOne({ name: "Royal Diamond Rings Set" });
  
  // Get all products
  const allProducts = await db.collection("products").find({}).toArray();
  
  // Group by image URLs to find duplicates
  const imageCounts = {};
  allProducts.forEach(p => {
    const mainImg = p.img || "";
    if (mainImg) {
      if (!imageCounts[mainImg]) imageCounts[mainImg] = [];
      imageCounts[mainImg].push({ id: p._id.toString(), name: p.name, category: p.category });
    }
  });
  
  const duplicatedImages = Object.entries(imageCounts)
    .filter(([url, prods]) => prods.length > 1)
    .map(([url, prods]) => ({ url, products: prods }));

  console.log("=== TARGET PRODUCT ===");
  console.log(JSON.stringify(targetProduct, null, 2));
  
  console.log("\n=== DUPLICATED IMAGES ===");
  console.log(JSON.stringify(duplicatedImages, null, 2));

  process.exit(0);
}
run().catch(console.error);
