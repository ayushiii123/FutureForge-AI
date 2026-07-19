import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addWishlist
);

router.get(
  "/",
  authMiddleware,
  getWishlist
);

router.delete(
  "/:id",
  authMiddleware,
  removeWishlist
);

export default router;