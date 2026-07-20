import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("✗ MongoDB Connection Failed:");
    console.error(`Error: ${error.message}`);
    console.error("\n📋 Troubleshooting:");
    console.error("1. Check if MongoDB Atlas cluster is ACTIVE");
    console.error("2. Whitelist your IP in MongoDB Atlas → Security → Network Access");
    console.error("3. Verify credentials in .env file");
    console.warn("\n⚠️  Server running without database for now...\n");
  }
};

export default connectDB;