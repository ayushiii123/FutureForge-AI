import api from "./api";

// Add Review
export const addReview = async ({ productId, rating, comment }) => {
  const res = await api.post(`/products/${productId}/review`, {
    productId,
    rating,
    comment,
  });
  return res.data;
};

// Get Product Reviews
export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data.reviews;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/reviews/${id}`, reviewData);
  return res.data;
};
