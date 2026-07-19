import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const buildFallbackReply = (message, productsForAI, compareProducts) => {
  const lowerMessage = message.toLowerCase();

  if (compareProducts.length > 0) {
    return `I found these options for your comparison: ${compareProducts
      .map((item) => `${item.name} — ₹${item.price}`)
      .join(" | ")}.`;
  }

  if (productsForAI.length === 0) {
    return "I don't see matching products right now, but I can help you browse our latest refurbished gadgets.";
  }

  const topProducts = productsForAI.slice(0, 3);
  const productList = topProducts
    .map((item) => `${item.name} — ₹${item.price} (${item.rating || 0}★)`)
    .join(" | ");

  if (lowerMessage.includes("budget") || lowerMessage.includes("under")) {
    return `These are great budget-friendly picks: ${productList}`;
  }

  if (lowerMessage.includes("laptop")) {
    return `Here are laptop options I recommend: ${productList}`;
  }

  if (lowerMessage.includes("mobile") || lowerMessage.includes("phone")) {
    return `Here are mobile options I recommend: ${productList}`;
  }

  if (lowerMessage.includes("headphone")) {
    return `Here are headphone options I recommend: ${productList}`;
  }

  if (lowerMessage.includes("refurbished")) {
    return `Here are quality refurbished picks: ${productList}`;
  }

  return `I recommend starting with: ${productList}`;
};

export const chatWithAI = async (req, res) => {
  try {
    const message = req.body?.message || req.query?.message || "";

    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const lowerMessage = message.toLowerCase();
    let filteredProducts = [];
    let compareProducts = [];

    if (lowerMessage.includes("compare")) {
      const searchTerm = lowerMessage.replace("compare", "").trim();
      compareProducts = await Product.find({
        $or: [
          { name: { $regex: searchTerm || ".", $options: "i" } },
          { brand: { $regex: searchTerm || ".", $options: "i" } },
          { category: { $regex: searchTerm || ".", $options: "i" } },
        ],
      })
        .select("name brand category price rating stock image condition")
        .limit(2);
    }

    const budgetMatch = lowerMessage.match(/under\s*₹?\s*(\d+)/i);
    if (budgetMatch) {
      const budget = Number(budgetMatch[1]);
      filteredProducts = await Product.find({ price: { $lte: budget } }).select(
        "name brand category price rating stock image condition"
      );
    }

    if (lowerMessage.includes("laptop")) {
      filteredProducts = await Product.find({ category: /laptop/i }).select(
        "name brand category price rating stock image condition"
      );
    }

    if (lowerMessage.includes("mobile") || lowerMessage.includes("phone")) {
      filteredProducts = await Product.find({ category: /mobile|phone/i }).select(
        "name brand category price rating stock image condition"
      );
    }

    if (lowerMessage.includes("headphone")) {
      filteredProducts = await Product.find({ category: /headphone/i }).select(
        "name brand category price rating stock image condition"
      );
    }

    if (lowerMessage.includes("watch")) {
      filteredProducts = await Product.find({ category: /watch/i }).select(
        "name brand category price rating stock image condition"
      );
    }

    if (lowerMessage.includes("refurbished")) {
      filteredProducts = await Product.find({ condition: "refurbished" }).select(
        "name brand category price rating stock image condition"
      );
    }

    const products = await Product.find().select(
      "name brand category price rating stock image condition"
    );

    const productsForAI = filteredProducts.length > 0 ? filteredProducts : products;

    let orders = [];
    if (req.user) {
      orders = await Order.find({ user: req.user.id }).select(
        "orderStatus totalAmount paymentStatus"
      );
    }

    let reply = buildFallbackReply(message, productsForAI, compareProducts);

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
You are TechRevive AI Shopping Assistant.
Available Products:
${JSON.stringify(productsForAI.slice(0, 8))}
User Orders:
${JSON.stringify(orders)}
User Question:
${message}
Rules:
- Recommend products only from the database.
- Mention price and rating.
- Keep answers short and friendly.
`;

        const result = await model.generateContent(prompt);
        const aiReply = result.response.text();

        if (aiReply && aiReply.trim()) {
          reply = aiReply;
        }
      } catch (geminiError) {
        console.warn("Gemini unavailable, using fallback response", geminiError.message);
      }
    }

    return res.json({
      success: true,
      reply,
      products: compareProducts.length > 0 ? compareProducts : productsForAI.slice(0, 4),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};