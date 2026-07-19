import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
const router = express.Router();

// User
router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);

// Admin
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export default router;