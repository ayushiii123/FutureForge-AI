import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/create-order",
  authMiddleware,
  createRazorpayOrder
);
router.post(
  "/verify-payment",
  authMiddleware,
  verifyRazorpayPayment
);

export default router;