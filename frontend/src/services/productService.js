import api from "./api";

const fallbackProducts = [
  {
    _id: "fallback-1",
    name: "iPhone 14 Pro",
    brand: "Apple",
    category: "Smartphones",
    condition: "new",
    description: "Premium flagship smartphone with advanced camera and stunning display.",
    price: 129999,
    originalPrice: 149999,
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-2",
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    condition: "new",
    description: "Lightweight performance laptop for work, study, and creativity.",
    price: 99999,
    originalPrice: 119999,
    stock: 8,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-3",
    name: "Galaxy S23 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    condition: "refurbished",
    description: "Certified premium Android phone with excellent build quality.",
    price: 74999,
    originalPrice: 99999,
    stock: 6,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-4",
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    condition: "refurbished",
    description: "Slim ultrabook with strong battery life and premium styling.",
    price: 69999,
    originalPrice: 89999,
    stock: 5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-13",
    name: "iPhone 13 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    condition: "refurbished",
    description: "Refurbished flagship with excellent camera system and battery life.",
    price: 65999,
    originalPrice: 89999,
    stock: 7,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-14",
    name: "Lenovo ThinkPad X1",
    brand: "Lenovo",
    category: "Laptops",
    condition: "refurbished",
    description: "Business-class laptop with premium keyboard and strong performance.",
    price: 56999,
    originalPrice: 79999,
    stock: 4,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-15",
    name: "Samsung Galaxy Tab S8",
    brand: "Samsung",
    category: "Tablets",
    condition: "refurbished",
    description: "Versatile tablet with a vivid display and S Pen support.",
    price: 44999,
    originalPrice: 62999,
    stock: 6,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-16",
    name: "Apple Watch Series 8",
    brand: "Apple",
    category: "Smart Watches",
    condition: "refurbished",
    description: "Health tracking smartwatch with premium build quality and comfort.",
    price: 28999,
    originalPrice: 37999,
    stock: 5,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-17",
    name: "Sony WH-1000XM4",
    brand: "Sony",
    category: "Headphones",
    condition: "refurbished",
    description: "Iconic noise-cancelling headphones with exceptional sound quality.",
    price: 22999,
    originalPrice: 29999,
    stock: 7,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    _id: "fallback-18",
    name: "Canon EOS R50",
    brand: "Canon",
    category: "Cameras",
    condition: "refurbished",
    description: "Lightweight mirrorless camera for creators and travel photography.",
    price: 59999,
    originalPrice: 75999,
    stock: 3,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
  },
  {
    _id: "fallback-19",
    name: "Google Pixel 7 Pro",
    brand: "Google",
    category: "Smartphones",
    condition: "refurbished",
    description: "Clean Android experience with flagship photography and smooth performance.",
    price: 47999,
    originalPrice: 64999,
    stock: 6,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-20",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Accessories",
    condition: "refurbished",
    description: "Premium wireless mouse designed for speed, comfort, and productivity.",
    price: 7999,
    originalPrice: 10999,
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-21",
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    condition: "refurbished",
    description: "Premium comfort headphones with immersive audio and strong noise control.",
    price: 26999,
    originalPrice: 34999,
    stock: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop",
  },
  {
    _id: "fallback-22",
    name: "Garmin Venu 3",
    brand: "Garmin",
    category: "Smart Watches",
    condition: "refurbished",
    description: "Feature-rich fitness smartwatch with bright display and GPS tracking.",
    price: 24999,
    originalPrice: 32999,
    stock: 5,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1551818012-1f70cd5b6d9b?w=1200&auto=format&fit=crop",
  },
];

const getFallbackImage = (name = "", category = "") => {
  const normalizedName = String(name || "").toLowerCase();

  if (normalizedName.includes("iphone")) {
    return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("macbook") || normalizedName.includes("thinkpad") || normalizedName.includes("zenbook") || normalizedName.includes("xps") || normalizedName.includes("laptop")) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("galaxy") || normalizedName.includes("pixel") || normalizedName.includes("oneplus") || normalizedName.includes("samsung") || normalizedName.includes("android")) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("watch") || normalizedName.includes("fitbit") || normalizedName.includes("garmin") || normalizedName.includes("forerunner") || normalizedName.includes("venu")) {
    return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("headphone") || normalizedName.includes("earbud") || normalizedName.includes("bose") || normalizedName.includes("beats") || normalizedName.includes("jabra") || normalizedName.includes("sony wh") || normalizedName.includes("quietcomfort")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("ipad") || normalizedName.includes("tab") || normalizedName.includes("surface") || normalizedName.includes("fire hd")) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop";
  }

  if (normalizedName.includes("canon") || normalizedName.includes("nikon") || normalizedName.includes("camera") || normalizedName.includes("sony alpha") || normalizedName.includes("eos") || normalizedName.includes("mirrorless")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop";
  }

  const categoryImages = {
    Smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop",
    Laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop",
    "Smart Watches": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop",
    Headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop",
    Tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop",
    Cameras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop",
    Accessories: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&auto=format&fit=crop",
  };

  const safeCategory = category?.trim() || "Accessories";
  return categoryImages[safeCategory] || categoryImages.Accessories;
};

const normalizeProducts = (items = []) =>
  items.map((product) => ({
    ...product,
    image: product?.image || getFallbackImage(product?.name, product?.category),
  }));

// Get All Products
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get("/products", {
      params,
    });

    const products = Array.isArray(response.data?.products) ? response.data.products : [];
    return products.length > 0 ? normalizeProducts(products) : normalizeProducts(fallbackProducts);
  } catch (error) {
    console.error("Failed to load products, showing fallback catalog:", error.message);
    return normalizeProducts(fallbackProducts);
  }
};

// Get Single Product
export const getSingleProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    if (response.data?.product) {
      return normalizeProducts([response.data.product])[0] || null;
    }
  } catch (error) {
    console.warn("Product lookup failed, trying fallback catalog:", error.message);
  }

  const fallbackProduct = fallbackProducts.find((item) => item._id === id || item._id === String(id));
  return fallbackProduct ? normalizeProducts([fallbackProduct])[0] : null;
};

// Add Product
export const addProduct = async (formData) => {
  const response = await api.post(
    "/products/add",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update Product
export const updateProduct = async (id, formData) => {
  const response = await api.put(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};