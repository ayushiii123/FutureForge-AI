import { useState } from "react";
import { addReview } from "../services/reviewService";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addReview({
        productId,
        rating,
        comment,
      });

      alert("Review Added Successfully");

      setComment("");
      setRating(5);

      onReviewAdded();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold">
        Write a Review
      </h2>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded"
      >
        <option value={5}>⭐⭐⭐⭐⭐</option>
        <option value={4}>⭐⭐⭐⭐</option>
        <option value={3}>⭐⭐⭐</option>
        <option value={2}>⭐⭐</option>
        <option value={1}>⭐</option>
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded p-3"
        rows="4"
        required
      />

      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;