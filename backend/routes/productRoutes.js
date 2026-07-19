import express from "express";
import {
  addProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { addReview } from "../controllers/reviewController.js";

import upload from "../middleware/upload.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getSingleProduct);

// Add Product (Admin Only)
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addProduct
);

// Update Product (Admin Only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

// Delete Product (Admin Only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

// Add Review (Logged-in User)
router.post(
  "/:id/review",
  authMiddleware,
  addReview
);

export default router;