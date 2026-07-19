import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/techrevive";

const run = async () => {
  try {
    await mongoose.connect(MONGO);
    const products = await Product.find({}).limit(50).lean();
    console.log(`Found ${products.length} products:`);
    for (const p of products) {
      console.log(`- ${p.name} | category=${p.category} | price=${p.price} | image=${p.image || '<no image>'}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
