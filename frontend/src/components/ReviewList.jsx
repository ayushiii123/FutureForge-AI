import { useEffect, useState } from "react";
import { getProductReviews, deleteReview, updateReview } from "../services/reviewService";

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    loadReviews();
  };

  const handleEdit = async (review) => {
    const comment = prompt("Edit Comment", review.comment);
    if (comment === null) return;

    const rating = Number(prompt("Rating (1-5)", review.rating));
    if (rating < 1 || rating > 5) {
      return alert("Rating must be between 1 and 5");
    }

    await updateReview(review._id, { comment, rating });
    loadReviews();
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5">Customer Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border rounded-lg p-4 mb-4">
            <h3 className="font-bold">{review.user?.name}</h3>
            <p className="text-yellow-500 text-lg">{"⭐".repeat(review.rating)}</p>
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <p className="text-sm text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-3 mt-3">
              <button onClick={() => handleEdit(review)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit Review</button>
              <button onClick={() => handleDelete(review._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete Review</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;