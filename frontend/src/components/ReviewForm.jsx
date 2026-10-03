
import { useState } from "react";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { addReview } from "../services/reviewService";

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedComment = comment.trim();

    setSuccessMessage("");
    setErrorMessage("");

    if (!trimmedComment) {
      setErrorMessage("Please write your review before submitting.");
      return;
    }

    if (!productId) {
      setErrorMessage("Product information is missing.");
      return;
    }

    try {
      setSubmitting(true);

      await addReview({
        productId,
        rating,
        comment: trimmedComment,
      });

      setSuccessMessage("Your review has been submitted successfully!");
      setComment("");
      setRating(5);
      setHoverRating(0);

      if (typeof onReviewAdded === "function") {
        onReviewAdded();
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const displayedRating = hoverRating || rating;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <FaStar className="text-amber-400" />
            Customer Feedback
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Write a Review
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Share your experience with this product and help
            other customers make informed decisions.
          </p>
        </div>

        <div className="hidden rounded-xl bg-amber-50 px-4 py-3 text-center sm:block">
          <FaStar className="mx-auto text-2xl text-amber-400" />
          <p className="mt-1 text-xs font-semibold text-amber-800">
            Your opinion matters
          </p>
        </div>
      </div>

      {/* REVIEW FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STAR RATING */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-800">
            How would you rate this product?
          </label>

          <div
            className="flex flex-wrap items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={submitting}
                aria-label={`Rate ${star} out of 5 stars`}
                aria-pressed={rating === star}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(0)}
                onClick={() => {
                  setRating(star);
                  setHoverRating(0);
                  setErrorMessage("");
                }}
                className="rounded-md p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaStar
                  className={`text-3xl transition-colors sm:text-4xl ${
                    star <= displayedRating
                      ? "text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="mt-2 text-sm font-semibold text-amber-700">
            {ratingLabels[displayedRating]}
          </p>
        </div>

        {/* COMMENT */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label
              htmlFor="review-comment"
              className="text-sm font-semibold text-slate-800"
            >
              Your Review
            </label>

            <span className="text-xs text-slate-400">
              {comment.length}/1000
            </span>
          </div>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value.slice(0, 1000));
              setErrorMessage("");
              setSuccessMessage("");
            }}
            placeholder="What did you like or dislike about this product? Share your honest experience..."
            rows={5}
            maxLength={1000}
            required
            disabled={submitting}
            className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Please keep your feedback relevant, respectful,
            and based on your actual experience.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
          >
            ✓ {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Your feedback helps other shoppers.
          </p>

          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <FaPaperPlane />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewForm;