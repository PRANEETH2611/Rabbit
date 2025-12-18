import mongoose, { connect } from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";
import products from "./data/products.js";
import { config } from "dotenv";

config();

// Connect to MongoDB
connect(process.env.MONGO_URI);

// Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create a default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Assign admin user ID to each product
    const userId = createdUser._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: userId,
    }));

    await Product.insertMany(sampleProducts);

    console.log("Products data seeded successfully 🌱");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
