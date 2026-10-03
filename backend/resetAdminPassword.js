import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// Hidden password input
const readHidden = (prompt) =>
  new Promise((resolve, reject) => {
    const stdin = process.stdin;

    if (!stdin.isTTY || !stdin.setRawMode) {
      reject(new Error("Run this script in an interactive terminal."));
      return;
    }

    process.stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();

    let value = "";

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
    };

    const onData = (buffer) => {
      const char = buffer.toString("utf8");

      if (char === "\u0003") {
        cleanup();
        process.stdout.write("\n");
        reject(new Error("Password reset cancelled."));
      } else if (char === "\r" || char === "\n") {
        cleanup();
        process.stdout.write("\n");
        resolve(value);
      } else if (char === "\u007f" || char === "\b") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else if (char >= " " && char !== "\u007f") {
        value += char;
        process.stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });

const resetAdminPassword = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from your environment.");
  }

  const email = "ayushi@example.com";

  const password = await readHidden(
    "Enter new admin password (minimum 6 characters): "
  );

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters.");
  }

  const confirmation = await readHidden("Confirm new password: ");

  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`Account not found: ${email}`);
  }

  if (user.role?.trim() !== "admin") {
    throw new Error("The specified account is not an admin.");
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  console.log(`Admin password reset successfully for ${email}.`);
};

resetAdminPassword()
  .catch((error) => {
    console.error("\nPassword reset failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });