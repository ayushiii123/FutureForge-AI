import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getSalesReport,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

router.get(
  "/sales-report",
  authMiddleware,
  adminMiddleware,
  getSalesReport
);

export default router;