import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,updateReview
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Review
router.post("/", authMiddleware, addReview);

// Get Reviews of a Product
router.get("/:productId", getProductReviews);
router.delete("/:id", authMiddleware, deleteReview);
router.put("/:id", authMiddleware, updateReview);

export default router;