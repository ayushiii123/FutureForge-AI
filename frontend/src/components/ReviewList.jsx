
import { useEffect, useState } from "react";
import {
  FaStar,
  FaUserCircle,
  FaEdit,
  FaTrashAlt,
  FaRegCommentDots,
  FaCheckCircle,
} from "react-icons/fa";

import {
  getProductReviews,
  deleteReview,
  updateReview,
} from "../services/reviewService";

const StarRating = ({ rating = 0, size = "text-sm" }) => {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          className={`${size} ${
            index < Math.round(value)
              ? "text-amber-400"
              : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
};

const formatReviewDate = (review) => {
  const dateValue = review.createdAt || review.updatedAt;

  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const loadReviews = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getProductReviews(productId);

      const reviewItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.reviews)
          ? data.reviews
          : [];

      setReviews(reviewItems);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load customer reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Math.max(0, Math.min(5, Number(review.rating) || 0)),
          0
        ) / totalReviews
      : 0;

  const getRatingCount = (star) =>
    reviews.filter(
      (review) => Math.round(Number(review.rating) || 0) === star
    ).length;

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setActionLoading(reviewId);
      setError("");

      await deleteReview(reviewId);
      await loadReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError(
        err.response?.data?.message ||
          "Unable to delete this review."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (review) => {
    const comment = window.prompt(
      "Edit your review",
      review.comment || ""
    );

    if (comment === null) return;

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError("Review comment cannot be empty.");
      return;
    }

    const ratingInput = window.prompt(
      "Enter your rating (1-5)",
      String(review.rating || 5)
    );

    if (ratingInput === null) return;

    const rating = Number(ratingInput);

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError("Rating must be a whole number between 1 and 5.");
      return;
    }

    try {
      setActionLoading(review._id);
      setError("");

      await updateReview(review._id, {
        comment: trimmedComment,
        rating,
      });

      await loadReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update this review."
      );
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-5">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-28 rounded-xl bg-slate-100" />
            <div className="h-28 rounded-xl bg-slate-100" />
          </div>
          <div className="h-24 rounded-xl bg-slate-100" />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Loading customer reviews...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
            <FaRegCommentDots />
            Customer Feedback
          </span>

          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Customer Reviews
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Genuine feedback shared by customers.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 sm:text-right">
          <p className="text-sm font-semibold text-slate-800">
            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Customer feedback
          </p>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* RATING SUMMARY */}
      {totalReviews > 0 ? (
        <div className="mb-7 grid gap-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 md:grid-cols-[180px_1fr] md:p-6">
          <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-5 text-center md:border-b-0 md:border-r md:pb-0 md:pr-5">
            <p className="text-5xl font-bold tracking-tight text-slate-900">
              {averageRating.toFixed(1)}
            </p>

            <div className="mt-3">
              <StarRating rating={averageRating} size="text-lg" />
            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
              out of 5
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* STAR DISTRIBUTION */}
          <div className="flex flex-col justify-center gap-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = getRatingCount(star);
              const percentage =
                totalReviews > 0
                  ? (count / totalReviews) * 100
                  : 0;

              return (
                <div
                  key={star}
                  className="grid grid-cols-[48px_1fr_35px] items-center gap-3"
                >
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    {star}
                    <FaStar className="text-amber-400" />
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-valuenow={Math.round(percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} star reviews`}
                  >
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-right text-xs font-medium text-slate-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-7 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
            <FaStar className="text-2xl text-violet-500" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            Be the first to review
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            No customer reviews yet. Share your experience using
            the review form above.
          </p>
        </div>
      )}

      {/* REVIEW CARDS */}
      {totalReviews > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Customer Experiences
            </h3>

            <span className="text-xs text-slate-500">
              Latest available reviews
            </span>
          </div>

          {reviews.map((review, index) => {
            const reviewerName =
              review.user?.name ||
              review.userName ||
              "Customer";

            const reviewerInitial =
              reviewerName.trim().charAt(0).toUpperCase() || "C";

            const reviewId =
              review._id || `${productId}-${index}`;

            const isVerified =
              review.verifiedPurchase === true;

            const isBusy = actionLoading === reviewId;

            return (
              <article
                key={reviewId}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-md sm:p-5"
              >
                {/* REVIEWER */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-lg font-bold text-violet-700">
                      {reviewerName === "Customer" ? (
                        <FaUserCircle />
                      ) : (
                        reviewerInitial
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">
                        {reviewerName}
                      </h4>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {formatReviewDate(review)}
                        </span>

                        {isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                            <FaCheckCircle />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <StarRating
                    rating={review.rating}
                    size="text-sm"
                  />
                </div>

                {/* REVIEW CONTENT */}
                <div className="mt-4 border-l-2 border-violet-200 pl-4">
                  <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                    {review.comment || "No written comment."}
                  </p>
                </div>

                {/* REVIEW ACTIONS */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    Rating: {Number(review.rating || 0)} / 5
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isBusy || !review._id}
                      onClick={() => handleEdit(review)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaEdit />
                      {isBusy ? "Saving..." : "Edit"}
                    </button>

                    <button
                      type="button"
                      disabled={isBusy || !review._id}
                      onClick={() => handleDelete(review._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* REFRESH */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={loadReviews}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
        >
          Refresh Reviews
        </button>
      </div>
    </section>
  );
};

export default ReviewList;