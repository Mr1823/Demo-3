import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const seedInitialData = async () => {
  try {
    const { Product } = await import("../models/Product.js");
    const { Category } = await import("../models/Category.js");
    const { GoldRate } = await import("../models/GoldRate.js");

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Database is empty. Seeding initial products, categories, and gold rates...");

      // Insert Gold Rate
      await GoldRate.create({
        rate: 7250,
        silverRate: 95,
        updatedAt: new Date(),
      });

      // Insert Categories
      await Category.create({ categoryName: "Gold", productCount: 3 });
      await Category.create({ categoryName: "Silver", productCount: 2 });
      await Category.create({ categoryName: "Diamond", productCount: 2 });

      // Insert Products — aligned with PRD data model
      const productsData = [
        {
          productId: "p1",
          name: "Heritage Gold Jhumkas",
          category: "Gold",
          metalType: "gold",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR11r-g8PlrD7Zwlr32afm3GRDrkSMeVRMLm1cDzLqUbhkhDahlz-8lG9jN8jsTisFRLuAqJNS0HVXz66W1b3aoNPqqK9_N-T69cPuNST70vHTztbBqHfJe9k__qhqCPuddv61jvMUxXusUmamA6igY0jeb-R00wiLH49B4OK0v2qAFPVWcQN27OPEhmdJv5BnoNvV4BM-BbT6V-LOPwrN8mCj1-Of7lRsoS02OBrgd7VBdpGhT-n8337I4Om9k-7GI2XZmBUXHuM",
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
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbm-HRclagi0AY7a8udpMrhWXiUejiQQr-zhk-v6t8Mh28SfnwoO8US1heB2mVPr46wWpZk9NiistE9XRmQrHbMrUnkc3b21pDuDLlkw4nsh1us3R6cA7n_vK56DJ7e354HRtA1ieBBBJgeRmaisdHxYMF9VK6ejkOwY9Yjl44IXG6MniSvYk-wiiBzyRxlgF2Q16G9X3gcVwyUh4Zt-DuXp5UXuGXPfdDc5Ix-tyeB0loXFsP1Qlnf6t1jFijmw2InqrG9Cjr0JI",
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
          metalType: "silver",
          isQuoteOnly: false,
          isFixedPrice: true,
        },
        {
          productId: "p3",
          name: "Imperial Diamond Necklace",
          category: "Diamond",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEw0eHEOMfDfEprzl9jMO8Ew-gsX4uwvib9WwPf_Q6jku84LY1ad1UbfIWWs6Ilq1UbPBpz93aP-fw2oJhoBkDe9XRPm-7XBq_1lPSgfRYs8mD8yNB9FpGm4oqA82-wQVzCFZI-WKMisBe3QUOYSFvvCnTr55pu1TyDm4g7yKqSSiEMYsbuJF8dk8uJebKJce4vz-cderAzp7SFdei2HkwMAsbOqoE2lg4kYDqMdwyicbCGHLLuRHhDq8QwfBmOec8szESZ8VYTeg",
          description: "Exquisite diamond and precious gemstone necklace with brilliant layout. An opulent piece that glows with high-end luxury.",
          rating: 5,
          isFlashSale: false,
          flashSale: false,
          featured: true,
          newArrival: true,
          stock: 2,
          sold: 5,
          isQuoteOnly: true,     // Quote-only product — no price displayed
          isFixedPrice: false,
          metalType: "gold",
        },
        {
          productId: "p4",
          name: "Vintage Gold Pendant",
          category: "Gold",
          metalType: "gold",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFlTJYdSisv1NFqwAz_rlwE5juFxNn26tlwKjhXPREwwXwKPdcm7-kX07zEzrXOKncdfcpJAF5UfQM4eqXKTg_AdP0IzZ0_lmj__K9Yw30_SyerQkI1juPzwYmSzKL5hgcmLLR-5h93crlhHeo6Jo5KMIidvh94NK_6Jf7NkfF2cwWYxqJGNNA8auP0i4f8fdYcWhLiUyPk5SXrGyQO0zFagELeYQKFpkFbul2Wbd-3956sPVuAYCi1cuVss5vINUihrg_hWLW6NA",
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
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR00zZuU61PvNxYkRH2m1dMxfwDzLNy7ZjUJ-SPuUOQsxsgIpa_31LpHMsWbM1MpZopatS0ApQUaUnOt4a6xI1B8RQ4AjjZ6N35jVmfKcahYBQGx11YE4L3SPpuiRaPURD3VJRj9e_IiHjwYr6MRVwSd-tYoWFPmTNtHp9Gl3W3i_pmtSOcSUwzZlwLlTJTGj5rc_l1JSqLzg09KnSQUjJhlCMjd9KYZks5lsJvGUphlLYJFIAC9PlLfSmvrbujMyHtH2SPXDYIJg",
          description: "A gorgeous set of matching diamond engagement/wedding bands featuring brilliant cuts.",
          rating: 4.9,
          isFlashSale: true,
          flashSale: true,
          featured: false,
          newArrival: false,
          stock: 5,
          sold: 14,
          isQuoteOnly: true,     // Quote-only product
          isFixedPrice: false,
          metalType: "gold",
        }
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
