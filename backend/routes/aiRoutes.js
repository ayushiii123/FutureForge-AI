import express from "express";
import { chatWithAI } from "../controllers/aiController.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "AI route is working" });
});

router.get("/chat", chatWithAI);
router.post("/chat", chatWithAI);
router.get("/", chatWithAI);
router.post("/", chatWithAI);

export default router;