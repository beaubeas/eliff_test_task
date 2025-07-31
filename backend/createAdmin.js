require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel.js");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB Database");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({
      email: "admin@resolveit.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    // Create admin user
    const adminUser = new userModel({
      userName: "System Administrator",
      age: 30,
      gender: "Other",
      street: "123 Admin Street",
      city: "Admin City",
      zipCode: "12345",
      email: "admin@resolveit.com",
      phoneNumber: "+1234567890",
      photoUri: "/uploads/users/default-admin.jpg", // You can add a default image later
      password: hashedPassword,
      role: 1, // Admin role
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@resolveit.com");
    console.log("Password: Admin123!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
