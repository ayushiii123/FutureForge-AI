import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat Route Working Successfully"
  });
});

export default router;