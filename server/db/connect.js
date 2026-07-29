import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const seedInitialData = async () => {
  try {
    const { Product } = await import("../models/Product.js");
    const { Category } = await import("../models/Category.js");
    const { GoldRate } = await import("../models/GoldRate.js");
    const { User } = await import("../models/User.js");

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Database is empty. Seeding initial products, categories, gold rates, and admin user...");

      // ─── Seed Admin User with bcrypt-hashed password ─────────────────────
      const bcrypt = await import("bcrypt");
      const adminPassword = process.env.ADMIN_PASSWORD || "Buildwith@us";
      const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

      const existingAdmin = await User.findOne({ email: "admin@buildwithus" });
      if (!existingAdmin) {
        await User.create({
          name: "Admin",
          email: "admin@buildwithus",
          passwordHash: adminPasswordHash,
          role: "ADMIN",
          photoURL: "/placeholder-user.png",
        });
        console.log(`   ✅ Admin user created: admin@buildwithus (password: ${adminPassword})`);
      }

      // ─── Seed test user ──────────────────────────────────────────────────
      const testPassword = process.env.TEST_USER_PASSWORD || "TestUser@123";
      const testPasswordHash = await bcrypt.hash(testPassword, 12);

      const existingTestUser = await User.findOne({ email: "user@test.com" });
      if (!existingTestUser) {
        await User.create({
          name: "Test User",
          email: "user@test.com",
          passwordHash: testPasswordHash,
          role: "USER",
          photoURL: "/placeholder-user.png",
        });
        console.log(`   ✅ Test user created: user@test.com (password: ${testPassword})`);
      }

      // ─── Insert Gold/Silver Rates (per-metal format) ─────────────────────
      await GoldRate.create({
        metalType: "gold",
        ratePerGram: 7250,
        updatedAt: new Date(),
      });
      await GoldRate.create({
        metalType: "silver",
        ratePerGram: 95,
        updatedAt: new Date(),
      });

      // ─── Insert Categories ───────────────────────────────────────────────
      await Category.create({ categoryName: "Gold", productCount: 3 });
      await Category.create({ categoryName: "Silver", productCount: 2 });
      await Category.create({ categoryName: "Diamond", productCount: 2 });

      // ─── Insert Products — aligned with PRD data model ───────────────────
      const productsData = [
        {
          productId: "p1",
          name: "Heritage Gold Jhumkas",
          category: "Gold",
          metalType: "gold",
          img: "/images/p1-jhumkas.jpg",
          description: "Intricately designed gold Jhumka earrings featuring tiny gold beads and detailed filigree work. A timeless addition to your jewelry box.",
          rating: 5,
          isFlashSale: false,
          flashSale: false,
          featured: true,
          newArrival: true,
          stock: 12,
          sold: 25,
          weight: 12.5,
          wastagePercent: 12,
          gstPercent: 3,
          isQuoteOnly: false,
          isFixedPrice: true,
        },
        {
          productId: "p2",
          name: "Artisanal Textured Silver Bracelet",
          category: "Silver",
          metalType: "silver",
          img: "/images/p2-bracelet.jpg",
          description: "A moody, elegant textured silver bracelet with intricate engravings. Perfect for daily wear or special occasions.",
          rating: 4.8,
          isFlashSale: true,
          flashSale: true,
          featured: true,
          newArrival: false,
          stock: 8,
          sold: 19,
          weight: 22.0,
          wastagePercent: 10,
          gstPercent: 3,
          isQuoteOnly: false,
          isFixedPrice: true,
        },
        {
          productId: "p3",
          name: "Imperial Diamond Necklace",
          category: "Diamond",
          img: "/images/p3-necklace.jpg",
          description: "Exquisite diamond and precious gemstone necklace with brilliant layout. An opulent piece that glows with high-end luxury.",
          rating: 5,
          isFlashSale: false,
          flashSale: false,
          featured: true,
          newArrival: true,
          stock: 2,
          sold: 5,
          isQuoteOnly: true,
          isFixedPrice: false,
          metalType: "gold",
        },
        {
          productId: "p4",
          name: "Vintage Gold Pendant",
          category: "Gold",
          metalType: "gold",
          img: "/images/p4-pendant.jpg",
          description: "Traditional gold pendant with heritage markings. Evokes antique artistry.",
          rating: 4.6,
          isFlashSale: false,
          flashSale: false,
          featured: false,
          newArrival: true,
          stock: 15,
          sold: 10,
          weight: 6.2,
          wastagePercent: 8,
          gstPercent: 3,
          isQuoteOnly: false,
          isFixedPrice: true,
        },
        {
          productId: "p5",
          name: "Royal Diamond Rings Set",
          category: "Diamond",
          img: "/images/p5-rings.jpg",
          description: "A gorgeous set of matching diamond engagement/wedding bands featuring brilliant cuts.",
          rating: 4.9,
          isFlashSale: true,
          flashSale: true,
          featured: false,
          newArrival: false,
          stock: 5,
          sold: 14,
          isQuoteOnly: true,
          isFixedPrice: false,
          metalType: "gold",
        },
      ];

      await Product.insertMany(productsData);
      console.log("🎉 Seeding complete successfully!");
    }
  } catch (err) {
    console.error("❌ Failed to seed data:", err);
  }
};

const connectDB = async () => {
  let mongoURI = process.env.MONGODB_URI;

  try {
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined.");
    }
    console.log("Connecting to MongoDB at:", mongoURI);
    const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed (${error.message}). Falling back to in-memory MongoDB...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryURI = mongoServer.getUri();
      console.log("Starting in-memory MongoDB server at:", inMemoryURI);
      const conn = await mongoose.connect(inMemoryURI);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      await seedInitialData();
    } catch (fallbackError) {
      console.error(`❌ In-memory MongoDB fallback failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
