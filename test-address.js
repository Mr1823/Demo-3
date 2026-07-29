import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { User } = await import('./server/models/User.js');
    
    // Find the current user to get an email
    const user = await User.findOne();
    if (!user) {
      console.log("No user found in DB to test");
      process.exit(0);
    }
    
    console.log("Found user:", user.email);

    // Simulate what the route does
    try {
      const email = user.email;
      const reqBody = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        streetAddress: "123 Test St",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
        postalCode: "600001",
        number: "+91 9999999999"
      };

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { shippingAddress: reqBody } },
        { new: true, runValidators: true }
      );
      
      console.log("Update success?", !!updatedUser);
    } catch (e) {
      console.log("Error during update:", e.message);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
