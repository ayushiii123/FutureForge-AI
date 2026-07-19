import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);

export default router;