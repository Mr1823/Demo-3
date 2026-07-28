import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { Category } = await import('./server/models/Category.js');
    const categories = await Category.find({});
    console.log("Current Categories:", categories.map(c => c.categoryName));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
