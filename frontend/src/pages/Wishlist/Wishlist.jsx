
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaArrowLeft,
  FaArrowRight,
  FaShoppingBag,
  FaTrashAlt,
  FaRedo,
  FaHeartBroken,
} from "react-icons/fa";

import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import ProductCard from "../../components/products/ProductCard";
import { useAuth } from "../../context/AuthContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadWishlist = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const data = await getWishlist();
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your wishlist. Please try again."
      );
      setWishlistItems([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setWishlistItems([]);
      setLoading(false);
      setError("");
      setSuccessMessage("");
      return;
    }

    loadWishlist(true);
  }, [isLoggedIn, loadWishlist]);

  const handleRemove = async (entry) => {
    if (!entry?._id) {
      setError("Wishlist item ID is unavailable.");
      return;
    }

    const productName =
      entry.product?.name || "this product";

    const confirmed = window.confirm(
      `Remove ${productName} from your wishlist?`
    );

    if (!confirmed) return;

    try {
      setRemovingId(entry._id);
      setError("");
      setSuccessMessage("");

      await removeFromWishlist(entry._id);

      setWishlistItems((previous) =>
        previous.filter((item) => item._id !== entry._id)
      );

      setSuccessMessage(
        `${productName} has been removed from your wishlist.`
      );
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      setError(
        err.response?.data?.message ||
          "Could not remove this product. Please try again."
      );
    } finally {
      setRemovingId("");
    }
  };

  const products = wishlistItems.filter(
    (item) =>
      item?.product &&
      typeof item.product === "object" &&
      item.product._id
  );

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f6f7fb] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Loading your wishlist...
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your saved products.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* TOP NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {/* HEADER */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-violet-50">
                <FaHeart />
                TECHREVIVE FAVORITES
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                All your favorite gadgets in one place.
                Save products you love and return to them whenever
                you're ready to shop.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center self-start rounded-2xl border border-white/20 bg-white/10 sm:self-center">
              <FaHeart className="text-2xl" />
              <span className="mt-1 text-sm font-bold">
                {products.length}{" "}
                {products.length === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>
        </section>

        {/* LOGIN REQUIRED */}
        {!isLoggedIn ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
              <FaHeart className="text-4xl text-violet-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Sign in to view your wishlist
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Log in to save your favorite gadgets, manage
              your wishlist and revisit products whenever you like.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaArrowLeft />
                Go Back
              </button>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700"
              >
                Login to Your Account
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => loadWishlist(true)}
                  className="font-bold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              >
                ✓ {successMessage}
              </div>
            )}

            {/* TOOLBAR */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Saved Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {products.length > 0
                    ? `${products.length} ${
                        products.length === 1
                          ? "product"
                          : "products"
                      } saved to your wishlist`
                    : "Your favorite products will appear here."}
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => loadWishlist(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
              >
                <FaRedo />
                Refresh
              </button>
            </div>

            {/* EMPTY WISHLIST */}
            {products.length === 0 ? (
              <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
                  <FaHeartBroken className="text-4xl text-violet-400" />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  Your wishlist is empty
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  You haven't saved any products yet.
                  Browse our collection and tap the wishlist
                  button on products you love.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FaArrowLeft />
                    Go Back
                  </button>

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700"
                  >
                    <FaShoppingBag />
                    Explore Products
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </section>
            ) : (
              /* WISHLIST PRODUCT GRID */
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((entry) => {
                  const product = entry.product;
                  const isRemoving = removingId === entry._id;

                  return (
                    <article
                      key={entry._id || product._id}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg sm:p-4"
                    >
                      {/* PRODUCT CARD */}
                      <div className="min-w-0 flex-1">
                        <ProductCard product={product} />
                      </div>

                      {/* WISHLIST ACTIONS */}
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                            <FaHeart />
                            Saved to Wishlist
                          </span>

                          {product.condition && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-600">
                              {product.condition}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:from-violet-700 hover:to-indigo-700"
                          >
                            View Product
                            <FaArrowRight className="text-[10px]" />
                          </Link>

                          <button
                            type="button"
                            disabled={isRemoving || !entry._id}
                            onClick={() => handleRemove(entry)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaTrashAlt />
                            {isRemoving
                              ? "Removing..."
                              : "Remove from Wishlist"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700"
          >
            <FaArrowLeft className="text-xs" />
            Back to Previous Page
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            Continue Shopping
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Wishlist;