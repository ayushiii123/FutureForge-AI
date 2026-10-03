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
const exactProductImages = {
  "iPhone 11 Pro":
    "https://www.apple.com/newsroom/images/product/iphone/lifestyle/Apple_iPhone-11-Pro_Most-Powerful-Advanced_091019_big.jpg.large.jpg",

  "iPhone 18 Pro":
    "/uploads/products/iphone-18-pro.jpg",
    "iPhone 14 Pro":
  "/uploads/products/iphone-14-pro.jpg",
  "iPhone 15 Pro":
  "/uploads/products/iphone-15-pro.jpg",
  "iPhone 15 Pro Max":
  "/uploads/products/iphone-15-pro-max.jpg",
  "iPhone 12":
  "/uploads/products/iphone-12.jpg",
  "Vivo Y300":
  "/uploads/products/vivo-y300.jpg",
  "Vivo Y300":
  "/uploads/products/vivo-y300.jpg",

"Vivo T2 Pro":
  "/uploads/products/vivo-t2-pro.jpg",

"Vivo T2":
  "/uploads/products/vivo-t2.jpg",

"Vivo T3":
  "/uploads/products/vivo-t3.jpg",

"Vivo T3x":
  "/uploads/products/vivo-t3x.jpg",

"Vivo V25":
  "/uploads/products/vivo-v25.jpg",

"Vivo V27":
  "/uploads/products/vivo-v27.jpg",

"Vivo V29 Pro":
  "/uploads/products/vivo-v29-pro.jpg",

"Vivo V29":
  "/uploads/products/vivo-v29.jpg",

"Vivo V30":
  "/uploads/products/vivo-v30.jpg",

"Vivo V40":
  "/uploads/products/vivo-v40.jpg",

"Vivo Y100":
  "/uploads/products/vivo-y100.jpg",

"Vivo Y27":
  "/uploads/products/vivo-y27.jpg",

"Vivo Y200":
  "/uploads/products/vivo-y200.jpg",
  "Vivo Y200e":
  "/uploads/products/vivo-y200e.jpg",

"Vivo Y200 Pro":
  "/uploads/products/vivo-y200-pro.png",
  "OnePlus 10T":
  "/uploads/products/oneplus-10t.webp",

"OnePlus Nord 2T":
  "/uploads/products/oneplus-nord-2t.webp",

"OnePlus 11R":
  "/uploads/products/oneplus-11r.webp",

"OnePlus 8T":
  "/uploads/products/oneplus-8t.webp",

"OnePlus 9 Pro":
  "/uploads/products/oneplus-9-pro.webp",

"OnePlus Nord CE 3 Lite":
  "/uploads/products/oneplus-nord-ce-3-lite.webp",

"OnePlus Nord CE 3":
  "/uploads/products/oneplus-nord-ce-3.webp",

"OnePlus Nord 3":
  "/uploads/products/oneplus-nord-3.webp",

"OnePlus 10 Pro":
  "/uploads/products/oneplus-10-pro.webp",

"OnePlus 11":
  "/uploads/products/oneplus-11.webp",

"OnePlus Buds 3":
  "/uploads/products/oneplus-buds-3.webp",

"OnePlus Nord 4":
  "/uploads/products/oneplus-nord-4.webp",

"OnePlus Nord CE 4":
  "/uploads/products/oneplus-nord-ce-4.webp",

"OnePlus 12R":
  "/uploads/products/oneplus-12r.webp",

"OnePlus 12":
  "/uploads/products/oneplus-12.webp",
  "Dell Inspiron 15":
  "/uploads/products/dell-inspiron-15.png",

"Lenovo IdeaPad Slim 5":
  "/uploads/products/lenovo-ideapad-slim-5.avif",

"HP Pavilion 14":
  "/uploads/products/hp-pavilion-14.avif",

"ASUS Zenbook 14":
  "/uploads/products/asus-zenbook-14.avif",

"MacBook Air M2":
  "/uploads/products/macbook-air-m2.jpg",

"Dell XPS 13":
  "/uploads/products/dell-xps-13.jpg",
  "Samsung Galaxy Tab S9 FE":
  "/uploads/products/samsung-galaxy-tab-s9-fe.avif",

"Samsung Galaxy Tab S9":
  "/uploads/products/samsung-galaxy-tab-s9.avif",
  "Garmin Forerunner 255":
  "/uploads/products/garmin-forerunner-255.jpg",

"Apple Watch Series 9":
  "/uploads/products/apple-watch-series-9.jpg",

"Nikon Z50":
  "/uploads/products/nikon-z50.jpg",

"Canon EOS R10":
  "/uploads/products/canon-eos-r10.jpg",

"Bose QuietComfort Earbuds":
  "/uploads/products/bose-quietcomfort-earbuds.jpg",

"Sony WH-1000XM5":
  "/uploads/products/sony-wh-1000xm5.jpg",
};
const curatedProductImages = {
  Apple: [
    "https://images.unsplash.com/photo-1496248051939-0382a018e59a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1744487347462-db8ad9f942a3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1602476807282-c315d616b46c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1569144157590-5d41c725e9bd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587310285959-d768493970b6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1693657652720-ab97ca98dd0c?auto=format&fit=crop&w=1200&q=80",
  ],
};

const nameImageMap = [
  { keywords: ["iphone 14", "iphone 15", "iphone 13", "iphone"], image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop" },
  { keywords: ["macbook", "thinkpad", "zenbook", "xps", "laptop"], image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop" },
  { keywords: ["galaxy s", "pixel", "oneplus", "samsung", "google", "android"], image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop" },
  { keywords: ["watch", "fitbit", "garmin", "forerunner", "venu"], image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop" },
  { keywords: ["headphone", "earbud", "bose", "beats", "jabra", "sony wh", "quietcomfort"], image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop" },
  { keywords: ["ipad", "tab", "surface", "fire hd"], image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop" },
  { keywords: ["canon", "nikon", "camera", "sony alpha", "eos", "mirrorless"], image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop" },
];

const getNameBasedFallbackImage = (name = "", category = "", brand = "") => {
  const normalizedName = String(name || "").trim().toLowerCase();
  const normalizedBrand = String(brand || "").trim().toLowerCase();
  const normalizedCategory = String(category || "accessories")
    .trim()
    .toLowerCase();

  let hash = 0;

  const key = `${normalizedBrand}-${normalizedName}`;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  const lock = hash || 1;

  let searchTerm = normalizedCategory;

  if (normalizedCategory === "smartphones") {
    searchTerm = `${normalizedBrand} smartphone`;
  } else if (normalizedCategory === "laptops") {
    searchTerm = `${normalizedBrand} laptop`;
  } else if (normalizedCategory === "tablets") {
    searchTerm = `${normalizedBrand} tablet`;
  } else if (normalizedCategory === "headphones") {
    searchTerm = `${normalizedBrand} headphones`;
  } else if (normalizedCategory === "smart watches") {
    searchTerm = `${normalizedBrand} smartwatch`;
  } else if (normalizedCategory === "cameras") {
    searchTerm = `${normalizedBrand} camera`;
  } else {
    searchTerm = `${normalizedBrand} gadget`;
  }

  return `https://loremflickr.com/800/600/${encodeURIComponent(
    searchTerm
  )}?lock=${lock}`;
};

const isLegacyFallbackImage = (value) => {
  const normalized = String(value || "").trim();
  return Boolean(normalized && legacyFallbackImageValues.has(normalized));
};

export const resolveProductImage = (
  file,
  providedImage,
  name = "",
  category = "",
  brand = ""
) => {
  const uploadedImage = normalizeImagePath(file);

  if (uploadedImage) {
    return uploadedImage;
  }


const normalizedProductName = String(name || "")
  .replace(/\u200B/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();
console.log(
  "ONEPLUS KEYS:",
  Object.keys(exactProductImages).filter((key) =>
    key.toLowerCase().includes("oneplus")
  )
);
const onePlusExactImages = {
  "oneplus 10t": "/uploads/products/oneplus-10t.webp",
  "oneplus nord 2t": "/uploads/products/oneplus-nord-2t.webp",
  "oneplus 11r": "/uploads/products/oneplus-11r.webp",
  "oneplus 8t": "/uploads/products/oneplus-8t.webp",
  "oneplus 9 pro": "/uploads/products/oneplus-9-pro.webp",
  "oneplus nord ce 3 lite": "/uploads/products/oneplus-nord-ce-3-lite.webp",
  "oneplus nord ce 3": "/uploads/products/oneplus-nord-ce-3.webp",
  "oneplus nord 3": "/uploads/products/oneplus-nord-3.webp",
  "oneplus 10 pro": "/uploads/products/oneplus-10-pro.webp",
  "oneplus 11": "/uploads/products/oneplus-11.webp",
  "oneplus buds 3": "/uploads/products/oneplus-buds-3.webp",
  "oneplus nord 4": "/uploads/products/oneplus-nord-4.webp",
  "oneplus nord ce 4": "/uploads/products/oneplus-nord-ce-4.webp",
  "oneplus 12r": "/uploads/products/oneplus-12r.webp",
  "oneplus 12": "/uploads/products/oneplus-12.webp",
  "oneplus buds 3": "/uploads/products/oneplus-buds-3.jpg",
};
const accessoryExactImages = {
  "garmin forerunner 255":
    "/uploads/products/garmin-forerunner-255.jpg",

  "apple watch series 9":
    "/uploads/products/apple-watch-series-9.jpg",

  "nikon z50":
    "/uploads/products/nikon-z50.jpg",

  "canon eos r10":
    "/uploads/products/canon-eos-r10.jpg",

  "oneplus buds 3":
    "/uploads/products/oneplus-buds-3.jpg",

  "bose quietcomfort earbuds":
    "/uploads/products/bose-quietcomfort-earbuds.jpg",

  "sony wh-1000xm5":
    "/uploads/products/sony-wh-1000xm5.jpg",
};
console.log("ACCESSORY DEBUG:", {
  name,
  normalizedProductName,
  mappedImage: accessoryExactImages[normalizedProductName],
});
if (accessoryExactImages[normalizedProductName]) {
  return accessoryExactImages[normalizedProductName];
}


const exactEntry = Object.entries(exactProductImages).find(
  ([productName]) =>
    productName
      .replace(/\u200B/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase() === normalizedProductName
);
console.log("EXACT IMAGE DEBUG:", {
  name,
  normalizedProductName,
  exactEntry,
});

if (exactEntry) {
  return exactEntry[1];
}
  const normalizedBrand = String(brand || "").trim();

  // Use curated product photos when available
  const curatedImages = curatedProductImages[normalizedBrand];

  if (curatedImages?.length) {
    const key = `${normalizedBrand}-${name}-${category}`.toLowerCase();

    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }

    const index = hash % curatedImages.length;

    return curatedImages[index];
  }

  // Existing image for products that don't have curated images yet
  if (typeof providedImage === "string") {
    const value = providedImage.trim();

    if (value) {
      if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) {
        return value;
      }

      return normalizeImagePath(value);
    }
  }

  return getNameBasedFallbackImage(name, category, brand);
};
const normalizeProductDocument = async (product) => {
  if (!product || typeof product !== "object") {
    return product;
  }

  const plainProduct =
    typeof product.toObject === "function"
      ? product.toObject()
      : product;

  const resolvedImage = resolveProductImage(
  null,
  plainProduct.image,
  plainProduct.name,
  plainProduct.category,
  plainProduct.brand
);

  const shouldPersist = Boolean(
  plainProduct._id &&
  !String(plainProduct._id).startsWith("fallback-") &&
  resolvedImage &&
  resolvedImage !== plainProduct.image
);
console.log(
  "IMAGE NORMALIZATION:",
  plainProduct.name,
  "OLD:",
  plainProduct.image,
  "NEW:",
  resolvedImage
);
  if (shouldPersist) {
    try {
      await Product.findByIdAndUpdate(
        plainProduct._id,
        { image: resolvedImage },
        { new: true }
      );
    } catch (error) {
      console.warn(
        "Could not persist normalized product image:",
        error.message
      );
    }
  }

  return {
    ...plainProduct,
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
    console.log("GET PRODUCTS CONTROLLER HIT:", req.query);
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
      return res.status(200).json({
        success: true,
        message: "normalized",
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
