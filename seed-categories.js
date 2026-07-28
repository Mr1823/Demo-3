import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { Category } = await import('./server/models/Category.js');
    
    const newCategories = [
      "Necklaces", 
      "Earrings", 
      "Bangles & Bracelets", 
      "Rings", 
      "Chains", 
      "Temple Jewellery", 
      "Mangalsutra", 
      "Nose Pins"
    ];

    for (const name of newCategories) {
      const exists = await Category.findOne({ categoryName: name });
      if (!exists) {
        await Category.create({ categoryName: name, productCount: 0 });
      }
    }
    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
