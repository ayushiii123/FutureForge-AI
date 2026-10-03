const STORAGE_KEY = "techrevive_compare";
const MAX_COMPARE_ITEMS = 3;

const notifyCompareUpdate = () => {
  window.dispatchEvent(new Event("techrevive:compare-updated"));
};

// Get saved comparison products
export const getCompareProducts = () => {
  try {
    const products = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Compare storage error:", error);
    return [];
  }
};

// Add product to comparison
export const addToCompare = (product) => {
  if (!product?._id) {
    return {
      success: false,
      message: "Invalid product.",
    };
  }

  const products = getCompareProducts();

  if (products.some((item) => item._id === product._id)) {
    return {
      success: false,
      message: "Product already added.",
    };
  }

  if (products.length >= MAX_COMPARE_ITEMS) {
    return {
      success: false,
      message: "You can compare up to 3 products.",
    };
  }

  const compareItem = {
    _id: product._id,
    name: product.name || "",
    brand: product.brand || "",
    category: product.category || "",
    condition: product.condition || "",
    price: product.price ?? 0,
    originalPrice: product.originalPrice ?? 0,
    description: product.description || "",
    image: product.image || product.img || "",
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...products, compareItem])
    );

    notifyCompareUpdate();

    return {
      success: true,
      message: "Product added to comparison.",
    };
  } catch (error) {
    console.error("Unable to save comparison:", error);

    return {
      success: false,
      message: "Could not save product.",
    };
  }
};

// Remove product from comparison
export const removeFromCompare = (productId) => {
  const products = getCompareProducts();

  const updatedProducts = products.filter(
    (item) => item._id !== productId
  );

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    notifyCompareUpdate();
    return updatedProducts;
  } catch (error) {
    console.error("Unable to update comparison:", error);
    return products;
  }
};

// Clear comparison list
export const clearCompare = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyCompareUpdate();
    return true;
  } catch (error) {
    console.error("Unable to clear comparison:", error);
    return false;
  }
};

// Listen for comparison list updates
export const subscribeToCompare = (callback) => {
  window.addEventListener("techrevive:compare-updated", callback);

  return () => {
    window.removeEventListener("techrevive:compare-updated", callback);
  };
};