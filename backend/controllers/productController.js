import path from "path";
import Product from "../models/Product.js";

const fallbackProducts = [
  {
    _id: "fallback-1",
    name: "iPhone 14 Pro",
    brand: "Apple",
    category: "Smartphones",
    condition: "new",
    description: "Latest Apple smartphone with dynamic island and pro camera system.",
    price: 129999,
    originalPrice: 149999,
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
  },
  {
    _id: "fallback-2",
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    condition: "new",
    description: "Thin and light laptop with the powerful M2 chip.",
    price: 99999,
    originalPrice: 119999,
    stock: 8,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500",
  },
  {
    _id: "fallback-3",
    name: "Galaxy S23 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    condition: "refurbished",
    description: "Certified refurbished premium Android smartphone in excellent condition.",
    price: 74999,
    originalPrice: 99999,
    stock: 6,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
  },
  {
    _id: "fallback-4",
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    condition: "refurbished",
    description: "Refurbished ultrabook with excellent battery life and premium design.",
    price: 69999,
    originalPrice: 89999,
    stock: 5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
  },
  {
    _id: "fallback-5",
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Smart Watches",
    condition: "new",
    description: "Advanced health tracking and seamless smartwatch experience.",
    price: 45999,
    originalPrice: 49999,
    stock: 10,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
  },
  {
    _id: "fallback-6",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    condition: "new",
    description: "Noise-cancelling headphones with premium sound quality.",
    price: 29999,
    originalPrice: 34999,
    stock: 9,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    _id: "fallback-7",
    name: "Canon EOS R10",
    brand: "Canon",
    category: "Cameras",
    condition: "refurbished",
    description: "Mirrorless camera with excellent image quality and 4K video.",
    price: 84999,
    originalPrice: 99999,
    stock: 4,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
  },
  {
    _id: "fallback-8",
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablets",
    condition: "new",
    description: "Premium Android tablet with vivid display and S Pen support.",
    price: 62999,
    originalPrice: 75999,
    stock: 7,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
  },
  {
    _id: "fallback-9",
    name: "Bose QuietComfort Earbuds",
    brand: "Bose",
    category: "Headphones",
    condition: "refurbished",
    description: "Compact earbuds with long battery life and great noise control.",
    price: 17999,
    originalPrice: 22999,
    stock: 8,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
  },
  {
    _id: "fallback-10",
    name: "Garmin Forerunner 255",
    brand: "Garmin",
    category: "Smart Watches",
    condition: "new",
    description: "Sport-focused smartwatch with GPS and fitness tracking features.",
    price: 32999,
    originalPrice: 37999,
    stock: 6,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  },
  {
    _id: "fallback-11",
    name: "Nikon Z50",
    brand: "Nikon",
    category: "Cameras",
    condition: "new",
    description: "Lightweight mirrorless camera with sharp images and fast autofocus.",
    price: 75999,
    originalPrice: 89999,
    stock: 5,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500",
  },
  {
    _id: "fallback-12",
    name: "ASUS Zenbook 14",
    brand: "ASUS",
    category: "Laptops",
    condition: "refurbished",
    description: "Slim and stylish laptop with excellent portability and performance.",
    price: 58999,
    originalPrice: 74999,
    stock: 5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500",
  },
];

const normalizeImagePath = (file) => {
  if (!file) return "";

  if (typeof file === "string") {
    const value = file.trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;
    const normalized = value.replace(/\\/g, "/");
    const fileName = path.basename(normalized);
    return fileName ? `/uploads/${fileName}` : "";
  }

  if (typeof file.path === "string") {
    const value = file.path.trim();
    if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;
    const normalized = value.replace(/\\/g, "/");
    const fileName = path.basename(normalized);
    return fileName ? `/uploads/${fileName}` : "";
  }

  if (typeof file.filename === "string" && file.filename.trim()) {
    return `/uploads/${file.filename}`;
  }

  return "";
};

const fallbackImageByCategory = {
  Smartphones: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&auto=format&fit=crop",
  ],
  Laptops: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&auto=format&fit=crop",
  ],
  "Smart Watches": [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551818012-1f70cd5b6d9b?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&auto=format&fit=crop",
  ],
  Headphones: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512499617640-c2f99912f9b6?w=1200&auto=format&fit=crop",
  ],
  Tablets: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580910051077-8e7f1a79a9d8?w=1200&auto=format&fit=crop",
  ],
  Cameras: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519183071298-a2962be54d7b?w=1200&auto=format&fit=crop",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585386959984-a4155222c2c3?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=1200&auto=format&fit=crop",
  ],
};

const legacyFallbackImageValues = new Set([
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
  "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500",
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500",
]);

const nameImageMap = [
  { keywords: ["iphone 14", "iphone 15", "iphone 13", "iphone"], image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop" },
  { keywords: ["macbook", "thinkpad", "zenbook", "xps", "laptop"], image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop" },
  { keywords: ["galaxy s", "pixel", "oneplus", "samsung", "google", "android"], image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop" },
  { keywords: ["watch", "fitbit", "garmin", "forerunner", "venu"], image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop" },
  { keywords: ["headphone", "earbud", "bose", "beats", "jabra", "sony wh", "quietcomfort"], image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop" },
  { keywords: ["ipad", "tab", "surface", "fire hd"], image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop" },
  { keywords: ["canon", "nikon", "camera", "sony alpha", "eos", "mirrorless"], image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop" },
];

const getNameBasedFallbackImage = (name = "", category = "") => {
  const normalizedName = String(name || "").toLowerCase();
  const matchedNameImage = nameImageMap.find((entry) => entry.keywords.some((keyword) => normalizedName.includes(keyword)));
  if (matchedNameImage) return matchedNameImage.image;

  const safeCategory = category?.trim() || "Accessories";
  const images = fallbackImageByCategory[safeCategory] || fallbackImageByCategory.Accessories;
  const index = (normalizedName ? normalizedName.charCodeAt(0) : safeCategory.length) % images.length;
  return images[index];
};

const isLegacyFallbackImage = (value) => {
  const normalized = String(value || "").trim();
  return Boolean(normalized && legacyFallbackImageValues.has(normalized));
};

export const resolveProductImage = (file, providedImage, name = "", category = "") => {
  const uploadedImage = normalizeImagePath(file);
  if (uploadedImage) return uploadedImage;

  if (typeof providedImage === "string") {
    const value = providedImage.trim();
    if (value && !isLegacyFallbackImage(value)) {
      if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;
      return normalizeImagePath(value);
    }
  }

  return getNameBasedFallbackImage(name, category);
};

const normalizeProductDocument = async (product) => {
  if (!product || typeof product !== "object") return product;

  const resolvedImage = resolveProductImage(null, product.image, product.name, product.category);
  const shouldPersist = Boolean(
    product._id &&
    !String(product._id).startsWith("fallback-") &&
    (!product.image || isLegacyFallbackImage(product.image)) &&
    resolvedImage !== product.image
  );

  if (shouldPersist) {
    try {
      await Product.findByIdAndUpdate(product._id, { image: resolvedImage }, { new: true });
    } catch (error) {
      console.warn("Could not persist normalized product image:", error.message);
    }
  }

  return {
    ...product,
    image: resolvedImage,
  };
};

const seedDemoProducts = async () => {
  const demoProducts = fallbackProducts.map((product) => ({
    ...product,
    _id: undefined,
  }));

  return Product.insertMany(demoProducts);
};

// Add Product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      image: resolveProductImage(req.file, req.body.image, req.body.name, req.body.category),
      condition: req.body.condition || "new",
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products (Search + Filter + Sort)
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    let products = [];

    try {
      const totalCount = await Product.countDocuments({});
      if (totalCount === 0) {
        const seededProducts = await seedDemoProducts();
        products = seededProducts;
      } else {
        let query = {};
        const trimmedKeyword = keyword?.trim();

        if (trimmedKeyword) {
          query.$or = [
            { name: { $regex: trimmedKeyword, $options: "i" } },
            { brand: { $regex: trimmedKeyword, $options: "i" } },
            { category: { $regex: trimmedKeyword, $options: "i" } },
            { description: { $regex: trimmedKeyword, $options: "i" } },
          ];
        }

        if (category) {
          query.category = { $regex: `^${category}$`, $options: "i" };
        }

        if (brand) {
          query.brand = brand;
        }

        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let productQuery = Product.find(query);

        switch (sort) {
          case "low":
            productQuery = productQuery.sort({ price: 1 });
            break;
          case "high":
            productQuery = productQuery.sort({ price: -1 });
            break;
          case "rating":
            productQuery = productQuery.sort({ rating: -1 });
            break;
          case "latest":
          case "newest":
            productQuery = productQuery.sort({ createdAt: -1 });
            break;
          default:
            productQuery = productQuery.sort({ createdAt: -1 });
        }

        products = await productQuery;
      }
    } catch (dbError) {
      console.warn("Using fallback demo products due to database issue:", dbError.message);
      products = fallbackProducts;
    }

    const normalizedProducts = await Promise.all(products.map(normalizeProductDocument));

    res.status(200).json({
      success: true,
      count: normalizedProducts.length,
      products: normalizedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: await normalizeProductDocument(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = resolveProductImage(req.file, req.body.image, req.body.name, req.body.category);
    } else if (Object.prototype.hasOwnProperty.call(req.body, "image")) {
      updateData.image = resolveProductImage(null, req.body.image, req.body.name, req.body.category);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};