import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const buildFallbackReply = (message, productsForAI, compareProducts) => {
  const lowerMessage = message.toLowerCase().trim();

  if (compareProducts.length > 0) {
    return `I found these products for comparison: ${compareProducts
      .map(
        (item) =>
          `${item.name} — ₹${item.price} (${item.rating || 0}★)`
      )
      .join(" | ")}.`;
  }

  if (productsForAI.length === 0) {
    if (lowerMessage.includes("laptop")) {
      return "I couldn't find any matching laptops in the current catalogue.";
    }

    if (
      lowerMessage.includes("mobile") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("smartphone")
    ) {
      return "I couldn't find any matching smartphones in the current catalogue.";
    }

    if (lowerMessage.includes("headphone")) {
      return "I couldn't find any matching headphones in the current catalogue.";
    }

    if (lowerMessage.includes("watch")) {
      return "I couldn't find any matching watches in the current catalogue.";
    }

    return "I couldn't find any matching products in the current catalogue.";
  }

  const topProducts = productsForAI.slice(0, 4);

  const productList = topProducts
    .map(
      (item) =>
        `${item.name} — ₹${item.price} (${item.rating || 0}★)`
    )
    .join(" | ");

  const isRefurbished = lowerMessage.includes("refurbished");

  const isNew =
    lowerMessage.includes("new product") ||
    lowerMessage.includes("new phone") ||
    lowerMessage.includes("new mobile") ||
    lowerMessage.includes("new laptop");

  const isLaptop = lowerMessage.includes("laptop");

  const isMobile =
    lowerMessage.includes("mobile") ||
    lowerMessage.includes("phone") ||
    lowerMessage.includes("smartphone");

  const isHeadphone =
    lowerMessage.includes("headphone") ||
    lowerMessage.includes("headphones") ||
    lowerMessage.includes("earbuds") ||
    lowerMessage.includes("earphone");

  const isWatch =
    lowerMessage.includes("watch") ||
    lowerMessage.includes("smartwatch");

  const hasBudget =
    lowerMessage.includes("under") ||
    lowerMessage.includes("below") ||
    lowerMessage.includes("less than") ||
    lowerMessage.includes("upto") ||
    lowerMessage.includes("up to");

  // Refurbished + category
  if (isRefurbished && isLaptop) {
    return `Here are refurbished laptop options from TechRevive: ${productList}`;
  }

  if (isRefurbished && isMobile) {
    return `Here are refurbished smartphone options from TechRevive: ${productList}`;
  }

  if (isRefurbished && isHeadphone) {
    return `Here are refurbished headphone options from TechRevive: ${productList}`;
  }

  if (isRefurbished && isWatch) {
    return `Here are refurbished smartwatch options from TechRevive: ${productList}`;
  }

  if (isRefurbished) {
    return `Here are refurbished products available on TechRevive: ${productList}`;
  }

  // New + category
  if (isNew && isLaptop) {
    return `Here are new laptop options from TechRevive: ${productList}`;
  }

  if (isNew && isMobile) {
    return `Here are new smartphone options from TechRevive: ${productList}`;
  }

  // Category
  if (isLaptop) {
    return `Here are laptop options from TechRevive: ${productList}`;
  }

  if (isMobile) {
    return `Here are mobile options from TechRevive: ${productList}`;
  }

  if (isHeadphone) {
    return `Here are headphone options from TechRevive: ${productList}`;
  }

  if (isWatch) {
    return `Here are smartwatch options from TechRevive: ${productList}`;
  }

  // Budget
  if (hasBudget) {
    return `Here are some options within your requested budget: ${productList}`;
  }

  return `Here are some products I found for you: ${productList}`;
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

    const lowerMessage = message.toLowerCase().trim();

    // --------------------------------------------------
    // FILTERS
    // --------------------------------------------------

    const filters = [];
    let compareProducts = [];

    // --------------------------------------------------
    // BUDGET
    // Examples:
    // under 80000
    // below 50000
    // less than 70000
    // upto 80000
    // --------------------------------------------------

    const budgetMatch = lowerMessage.match(
      /(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i
    );

    if (budgetMatch) {
      const budget = Number(
        budgetMatch[1].replace(/,/g, "")
      );

      if (!Number.isNaN(budget)) {
        filters.push({
          price: { $lte: budget },
        });
      }
    }

    // --------------------------------------------------
    // LAPTOP
    // --------------------------------------------------

    if (lowerMessage.includes("laptop")) {
      filters.push({
        $or: [
          { name: /laptop/i },
          { brand: /laptop/i },
          { category: /laptop/i },
          { description: /laptop/i },
        ],
      });
    }

    // --------------------------------------------------
    // MOBILE / PHONE
    // --------------------------------------------------

    if (
      lowerMessage.includes("mobile") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("smartphone")
    ) {
      filters.push({
        $or: [
          { name: /mobile|phone|smartphone/i },
          { brand: /mobile|phone|smartphone/i },
          { category: /mobile|phone|smartphone/i },
          { description: /mobile|phone|smartphone/i },
        ],
      });
    }

    // --------------------------------------------------
    // HEADPHONES
    // --------------------------------------------------

    if (
      lowerMessage.includes("headphone") ||
      lowerMessage.includes("headphones") ||
      lowerMessage.includes("earbuds") ||
      lowerMessage.includes("earphone")
    ) {
      filters.push({
        $or: [
          { name: /headphone|headphones|earbuds|earphone/i },
          { brand: /headphone|headphones|earbuds|earphone/i },
          { category: /headphone|headphones|earbuds|earphone/i },
          { description: /headphone|headphones|earbuds|earphone/i },
        ],
      });
    }

    // --------------------------------------------------
    // WATCH
    // --------------------------------------------------

    if (
      lowerMessage.includes("watch") ||
      lowerMessage.includes("smartwatch")
    ) {
      filters.push({
        $or: [
          { name: /watch|smartwatch/i },
          { brand: /watch|smartwatch/i },
          { category: /watch|smartwatch/i },
          { description: /watch|smartwatch/i },
        ],
      });
    }

    // --------------------------------------------------
    // REFURBISHED
    // --------------------------------------------------

    if (lowerMessage.includes("refurbished")) {
      filters.push({
        condition: "refurbished",
      });
    }

    // --------------------------------------------------
    // NEW PRODUCTS
    // --------------------------------------------------

    if (
      lowerMessage.includes("new phone") ||
      lowerMessage.includes("new mobile") ||
      lowerMessage.includes("new laptop") ||
      lowerMessage.includes("new product")
    ) {
      filters.push({
        condition: "new",
      });
    }

    // --------------------------------------------------
    // COMPARE PRODUCTS
    // Example:
    // compare iPhone 14 and Galaxy S23
    // compare iPhone vs Samsung
    // --------------------------------------------------

    if (lowerMessage.includes("compare")) {
      const compareText = lowerMessage
        .replace(/\bcompare\b/i, "")
        .trim();

      const terms = compareText
        .split(/\s+(?:and|vs|versus|with)\s+/i)
        .map((term) => term.trim())
        .filter(Boolean)
        .slice(0, 2);

      for (const term of terms) {
        const product = await Product.findOne({
          $or: [
            { name: { $regex: term, $options: "i" } },
            { brand: { $regex: term, $options: "i" } },
            { category: { $regex: term, $options: "i" } },
          ],
        }).select(
          "name brand category price rating stock image condition"
        );

        if (
          product &&
          !compareProducts.some(
            (item) =>
              String(item._id) === String(product._id)
          )
        ) {
          compareProducts.push(product);
        }
      }
    }

    // --------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------

    let filteredProducts = [];
console.log("CHAT FILTERS:", JSON.stringify(filters, null, 2));
    if (filters.length > 0) {
      filteredProducts = await Product.find({
        $and: filters,
      })
        .select(
          "name brand category price rating stock image condition"
        )
        .sort({
          rating: -1,
          createdAt: -1,
        })
        .limit(12);
        console.log(
  "FILTERED PRODUCTS:",
  filteredProducts.map((p) => ({
    name: p.name,
    category: p.category,
    condition: p.condition,
    price: p.price,
  }))
);
    }

    // --------------------------------------------------
    // BEST / TOP / RECOMMENDED
    // --------------------------------------------------

    const askingForBest =
      lowerMessage.includes("best") ||
      lowerMessage.includes("top") ||
      lowerMessage.includes("recommended") ||
      lowerMessage.includes("recommend");

    if (
      askingForBest &&
      filters.length === 0 &&
      compareProducts.length === 0
    ) {
      filteredProducts = await Product.find()
        .select(
          "name brand category price rating stock image condition"
        )
        .sort({
          rating: -1,
          createdAt: -1,
        })
        .limit(12);
    }

    // --------------------------------------------------
    // ALL PRODUCTS
    // --------------------------------------------------

    const products = await Product.find()
      .select(
        "name brand category price rating stock image condition"
      )
      .sort({
        rating: -1,
        createdAt: -1,
      });

    // IMPORTANT:
    // If a specific filter was requested, DO NOT fall back
    // to all products when there are zero matches.
    const hasSpecificRequest =
      filters.length > 0 ||
      compareProducts.length > 0 ||
      askingForBest;

    const productsForAI = hasSpecificRequest
      ? filteredProducts
      : products;

    // --------------------------------------------------
    // USER ORDERS
    // --------------------------------------------------

    let orders = [];

    if (req.user) {
      orders = await Order.find({
        user: req.user.id,
      }).select(
        "orderStatus totalAmount paymentStatus"
      );
    }

    // --------------------------------------------------
    // FALLBACK RESPONSE
    // --------------------------------------------------

    let reply = buildFallbackReply(
      message,
      productsForAI,
      compareProducts
    );

    // --------------------------------------------------
    // GEMINI
    // --------------------------------------------------

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-3.8-flash",
        });

        const prompt = `
You are TechRevive AI, a friendly electronics shopping assistant.

User Question:
${message}

Available Products:
${JSON.stringify(productsForAI.slice(0, 10))}

Comparison Products:
${JSON.stringify(compareProducts)}

User Orders:
${JSON.stringify(orders)}

Instructions:
- Understand the user's shopping intent.
- Recommend products ONLY from the provided database.
- Never invent products.
- For budget queries, NEVER recommend a product above the requested budget.
- Mention product name, price and rating when useful.
- For "best" or "top" queries, prefer higher-rated products.
- For comparison queries, compare only the supplied comparison products.
- If there are no matching products, clearly say that no matching products were found.
- Keep the response short, friendly and useful.
- Do not mention MongoDB, API, backend or internal implementation.
`;

        const result = await model.generateContent(prompt);
        const aiReply = result.response.text();

        if (aiReply && aiReply.trim()) {
          reply = aiReply;
        }
      } catch (geminiError) {
        console.warn(
          "Gemini unavailable, using fallback response:",
          geminiError.message
        );
      }
    }

    return res.json({
      success: true,
      reply,
      products:
        compareProducts.length > 0
          ? compareProducts
          : productsForAI.slice(0, 4),
    });
  } catch (error) {
    console.error("CHAT AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Search products using an uploaded image
export const searchProductsByImage = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Please upload a gadget image.",
      });
    }

    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: "AI image search is currently unavailable.",
      });
    }

   const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash",
});

    const prompt = `
Analyze the uploaded image for an electronic gadget.

Identify its likely:
- Product type
- Brand, if recognizable
- Model, if recognizable
- Distinctive visual features

Do not guess an exact model when the image is unclear.
Return ONLY valid JSON in this format:
{
  "productType": "",
  "brand": "",
  "model": "",
  "searchTerms": []
}

Use short, useful search terms for matching products.
If the image is not an electronic gadget, return empty
strings and an empty searchTerms array.
`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const rawText = result.response.text().trim();

    const jsonText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const analysis = JSON.parse(jsonText);

    const searchTerms = [
      analysis.brand,
      analysis.model,
      analysis.productType,
      ...(Array.isArray(analysis.searchTerms)
        ? analysis.searchTerms
        : []),
    ]
      .filter((term) => typeof term === "string")
      .map((term) => term.trim())
      .filter((term) => term.length > 0)
      .filter((term, index, array) =>
        array.findIndex(
          (item) => item.toLowerCase() === term.toLowerCase()
        ) === index
      )
      .slice(0, 8);

    if (searchTerms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No identifiable gadget found in the image.",
        analysis,
        count: 0,
        products: [],
      });
    }

    // Escape special regex characters from AI-generated terms.
    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchableFields = [
      "name",
      "brand",
      "category",
      "description",
    ];

    const productQuery = {
      $or: searchTerms.flatMap((term) =>
        searchableFields.map((field) => ({
          [field]: {
            $regex: escapeRegex(term),
            $options: "i",
          },
        }))
      ),
    };

    const products = await Product.find(productQuery)
      .select(
        "name brand category price originalPrice condition stock rating image refurbishmentGrade warrantyMonths"
      )
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      message:
        products.length > 0
          ? "Matching products found."
          : "No matching products found in the catalogue.",
      analysis,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("IMAGE SEARCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Image search failed. Please try again.",
    });
  }
};