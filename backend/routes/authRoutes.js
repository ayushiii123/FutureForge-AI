
import express from "express";
import {
  login,
  register,
  verifyOTP,
  getProfile,
  changePassword,
  resendOTP
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
// Protected Route
router.get("/profile", authMiddleware, getProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
