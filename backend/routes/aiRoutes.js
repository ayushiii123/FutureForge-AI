
import express from "express";
import multer from "multer";
import {
  chatWithAI,
  searchProductsByImage,
} from "../controllers/aiController.js";

const router = express.Router();

// Dedicated in-memory upload for AI image search
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    }
  },
});

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AI route is working",
  });
});

// Existing AI chatbot routes
router.get("/chat", chatWithAI);
router.post("/chat", chatWithAI);
router.get("/", chatWithAI);
router.post("/", chatWithAI);

// New AI image search route
router.post(
  "/search-image",
  imageUpload.single("image"),
  searchProductsByImage
);

export default router;