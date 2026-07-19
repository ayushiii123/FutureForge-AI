import express from "express";
import {
  login,
  register,
  getProfile,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/profile", authMiddleware, getProfile);

export default router;