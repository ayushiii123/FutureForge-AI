import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const chatWithAI = async (req, res) => {
  console.log("BODY:", req.body);

  try {
const { message } = req.body;

    const lowerMessage = message.toLowerCase();

    // Search Products
    if (
      lowerMessage.includes("laptop") ||
      lowerMessage.includes("mobile") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("headphone")
    ) {

      const keyword =
        lowerMessage.includes("laptop")
          ? "laptop"
          : lowerMessage.includes("mobile")
          ? "mobile"
          : lowerMessage.includes("phone")
          ? "phone"
          : "headphone";

      const products = await Product.find({
        name: {
          $regex: keyword,
          $options: "i",
        },
      }).limit(5);

      if (products.length > 0) {

        let reply = "Here are some products available:\n\n";

        products.forEach((item) => {
          reply += `• ${item.name}
₹${item.price}

`;
        });

        return res.json({
          success: true,
          reply,
        });
      }
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are TechRevive AI.

You are an AI shopping assistant.

You should answer professionally.

Website Features:

- Buy Products
- Sell Products
- Exchange Devices
- Refurbished Products
- Wishlist
- Razorpay
- Cash on Delivery
- Order Tracking
- Reviews
- AI Chatbot

User Question:

${message}
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    res.json({
      success: true,
      reply,
    });

 } catch (error) {
  console.error("Chat Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error: String(error),
  });

  }
};