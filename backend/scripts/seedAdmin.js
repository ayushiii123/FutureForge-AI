import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/techrevive";

const adminData = {
  name: "Site Admin",
  email: "admin@techrevive.com",
  password: "Admin@1234",
  role: "admin",
  isVerified: true,
};

const run = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log("Connected to MongoDB for admin seeding.");

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log(`Admin user already exists: ${adminData.email}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminData.password, salt);

    const user = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashed,
      role: adminData.role,
      isVerified: adminData.isVerified,
    });

    await user.save();
    console.log(`Created admin user: ${adminData.email}`);
    console.log("Password:", adminData.password);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
