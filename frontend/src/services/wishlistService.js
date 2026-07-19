import api from "./api";

// Get Wishlist
export const getWishlist = async () => {
  try {
    const res = await api.get("/wishlist");
    return res.data.wishlist || [];
  } catch (error) {
    if (error.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

// Add to Wishlist
export const addToWishlist = async (productId) => {
  const res = await api.post("/wishlist", {
    product: productId,
  });

  return res.data;
};

// Remove from Wishlist
export const removeFromWishlist = async (wishlistId) => {
  const res = await api.delete(`/wishlist/${wishlistId}`);
  return res.data;
};