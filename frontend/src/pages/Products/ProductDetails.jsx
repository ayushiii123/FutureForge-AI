
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheckCircle,
  FaChevronRight,
  FaMinus,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";

import {
  getSingleProduct,
  getProducts,
} from "../../services/productService";

import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import ProductCard from "../../components/products/ProductCard";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";
import getProductImageUrl from "../../utils/imageUrl";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const loadProduct = async () => {
    setLoading(true);

    try {
      const data = await getSingleProduct(id);
      setProduct(data);
      setQuantity(1);
      setRelatedProducts([]);

      if (!data) return;

      if (data.category) {
        try {
          const results = await getProducts({
            category: data.category,
          });

          const matching = Array.isArray(results)
            ? results.filter(
                (item) =>
                  String(item._id) !== String(data._id)
              )
            : [];

          setRelatedProducts(matching.slice(0, 4));
        } catch (error) {
          console.error("Related products error:", error);
        }
      }
    } catch (error) {
      console.error("Product details error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  loadProduct();

  // Save recently viewed product
  if (id) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("techrevive_recent_products") || "[]"
      );

      const recentProducts = Array.isArray(stored) ? stored : [];

      const updatedProducts = [
        id,
        ...recentProducts.filter(
          (productId) => String(productId) !== String(id)
        ),
      ].slice(0, 8);

      localStorage.setItem(
        "techrevive_recent_products",
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error("Recent products save error:", error);
    }
  }
}, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 font-medium text-slate-600">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <FaBoxOpen className="mx-auto text-5xl text-violet-300" />
        <h2 className="mt-5 text-2xl font-bold text-slate-800">
          Product not found
        </h2>
        <p className="mt-2 text-slate-500">
          This product may have been removed or is unavailable.
        </p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Explore Products
        </button>
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;
  const stock = Math.max(0, Number(product.stock) || 0);
  const warrantyMonths = Math.max(
    0,
    Number(product.warrantyMonths) || 0
  );
  const rating = Math.max(
    0,
    Math.min(5, Number(product.rating) || 0)
  );

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  const imageUrl = getProductImageUrl(
    product.image,
    product.name
  );

  const isRefurbished = product.condition === "refurbished";
  const isInStock = stock > 0;

  const returnPolicy =
    typeof product.returnPolicy === "string" &&
    product.returnPolicy.trim()
      ? product.returnPolicy
      : "";
// ===============================
// TECHREVIVE SCORE
// Listing-data-based quality score
// ===============================
const conditionScore =
  product.condition === "new"
    ? 96
    : product.condition === "refurbished"
    ? product.refurbishmentGrade === "A+"
      ? 95
      : product.refurbishmentGrade === "A"
      ? 92
      : product.refurbishmentGrade === "B"
      ? 86
      : product.refurbishmentGrade === "C"
      ? 78
      : 84
    : product.condition === "used"
    ? 76
    : 80;

const performanceScore =
  rating > 0 ? Math.round((rating / 5) * 100) : 82;

const valueScore =
  discount > 0
    ? Math.min(98, 74 + discount * 1.5)
    : price > 0
    ? 82
    : 70;

const trustScore =
  product.inspectionStatus === "Passed"
    ? 96
    : warrantyMonths > 0
    ? 90
    : product.condition === "new"
    ? 88
    : 78;

const techReviveScore = Math.round(
  conditionScore * 0.30 +
    performanceScore * 0.25 +
    valueScore * 0.25 +
    trustScore * 0.20
);
  const addSelectedQuantity = () => {
    if (!isInStock) return;

    // Current cart service adds one unit per call.
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }
  };

  const handleAddToCart = () => {
    addSelectedQuantity();
    alert(
      `${quantity} ${quantity === 1 ? "unit" : "units"} added to cart`
    );
  };

  const handleBuyNow = () => {
    if (!isInStock) return;
    addSelectedQuantity();
    navigate("/checkout");
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "delivery", label: "Delivery & Returns" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm"
        >
          <Link to="/" className="hover:text-violet-700">
            Home
          </Link>
          <FaChevronRight className="text-[9px]" />
          <Link
            to="/products"
            className="hover:text-violet-700"
          >
            Electronics
          </Link>
          <FaChevronRight className="text-[9px]" />
          <Link
            to={`/products?category=${encodeURIComponent(
              product.category || ""
            )}`}
            className="hover:text-violet-700"
          >
            {product.category || "Products"}
          </Link>
          <FaChevronRight className="text-[9px]" />
          <span className="max-w-[220px] truncate font-medium text-slate-700">
            {product.name}
          </span>
        </nav>

        {/* MAIN PRODUCT PANEL */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid items-start gap-7 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(350px,0.82fr)] lg:gap-9 lg:p-8">

            {/* LEFT: IMAGE GALLERY */}
            <div className="min-w-0">
              <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-3 sm:grid-cols-[74px_minmax(0,1fr)] sm:gap-4">

                {/* Single-image thumbnail: schema currently stores one image */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    aria-label="View product image"
                    className="overflow-hidden rounded-xl border-2 border-violet-500 bg-white p-1.5 shadow-sm"
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} thumbnail`}
                      className="aspect-square w-full rounded-lg object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                  </button>
                </div>

                {/* Main product image */}
                <div className="flex min-h-[310px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#f3f5f7] p-3 sm:min-h-[480px] sm:p-6">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-[480px] w-full object-contain transition duration-300 hover:scale-[1.035]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";
                    }}
                  />
                </div>
              </div>

              {/* GALLERY CAPTION */}
              <p className="mt-3 text-center text-xs text-slate-400">
                Product image
              </p>
            </div>

            {/* RIGHT: PRODUCT PURCHASE PANEL */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                  {isRefurbished ? "Refurbished" : "New"}
                </span>

                {product.inspectionStatus === "Passed" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                    <FaCheckCircle />
                    Inspection Passed
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Brand:{" "}
                <span className="font-semibold text-slate-700">
                  {product.brand || "Not specified"}
                </span>
              </p>

              {/* RATING */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < Math.round(rating)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {rating.toFixed(1)}
                </span>

                <a
                  href="#reviews"
                  className="text-sm text-violet-700 underline-offset-2 hover:underline"
                >
                  {product.numReviews || 0} reviews
                </a>
              </div>

              {/* PRODUCT FACTS */}
              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                <div>
                  <span className="text-slate-500">Category</span>
                  <p className="mt-0.5 font-semibold text-slate-800">
                    {product.category || "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Condition</span>
                  <p className="mt-0.5 font-semibold capitalize text-slate-800">
                    {product.condition || "Not specified"}
                  </p>
                </div>
              </div>

              {/* PRICE CARD */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                {discount > 0 && (
                  <div className="mb-2 text-sm font-bold text-red-600">
                    -{discount}% OFF
                  </div>
                )}

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {money(price)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-base text-slate-400 line-through">
                      {money(originalPrice)}
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <p className="mt-2 text-sm text-green-700">
                    You save{" "}
                    <strong>
                      {money(originalPrice - price)}
                    </strong>
                  </p>
                )}

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Applicable delivery charges and taxes, if any,
                  are shown at checkout.
                </p>
              </div>

              {/* AVAILABILITY */}
              <div className="mt-5 flex items-center gap-2">
                {isInStock ? (
                  <>
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      In Stock
                    </span>
                    <span className="text-xs text-slate-500">
                      ({stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold text-red-600">
                      Currently unavailable
                    </span>
                  </>
                )}
              </div>

              {/* QUANTITY */}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <label
                  htmlFor="product-quantity"
                  className="text-sm font-semibold text-slate-700"
                >
                  Quantity
                </label>

                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || !isInStock}
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                    className="p-3 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaMinus className="text-xs" />
                  </button>

                  <input
                    id="product-quantity"
                    aria-label="Product quantity"
                    type="number"
                    min="1"
                    max={stock}
                    value={quantity}
                    disabled={!isInStock}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isInteger(value) && value >= 1) {
                        setQuantity(Math.min(value, stock));
                      }
                    }}
                    className="w-12 border-x border-slate-300 py-2 text-center text-sm font-semibold outline-none disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={!isInStock || quantity >= stock}
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(stock, current + 1)
                      )
                    }
                    className="p-3 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* PURCHASE BUTTONS */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_48px]">
                <button
                  type="button"
                  disabled={!isInStock}
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-50"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>

                <button
                  type="button"
                  disabled={!isInStock}
                  onClick={handleBuyNow}
                  className="rounded-lg bg-violet-100 px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  aria-label="Save to wishlist"
                  onClick={async () => {
                    try {
                      await addToWishlist(product._id);
                      alert("Added to Wishlist");
                    } catch (error) {
                      alert(
                        error.response?.data?.message ||
                          "Please log in to add to wishlist"
                      );
                    }
                  }}
                  className="flex items-center justify-center rounded-lg border border-slate-300 p-3 text-red-500 transition hover:border-red-300 hover:bg-red-50"
                >
                  <FaHeart />
                </button>
              </div>

              {/* QUICK BENEFITS */}
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <FaTruck className="mt-1 text-lg text-violet-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Delivery details
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Check available delivery options and estimates
                      at checkout.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaShieldAlt className="mt-1 text-lg text-violet-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Warranty
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {warrantyMonths > 0
                        ? `${warrantyMonths} months as listed for this product.`
                        : "Not specified for this product."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
{/* TECHREVIVE SCORE */}
<div className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50">
  <div className="p-5 sm:p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
          TechRevive Score
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Product quality snapshot
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Calculated from listing condition, rating, value and available
          trust information.
        </p>
      </div>

      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-violet-100">
        <div className="text-center">
          <div className="text-2xl font-black text-violet-700">
            {techReviveScore}
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            / 100
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {/* Condition */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Condition
          </span>

          <span className="font-bold text-violet-700">
            {conditionScore}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${conditionScore}%` }}
          />
        </div>
      </div>

      {/* Performance */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Performance
          </span>

          <span className="font-bold text-violet-700">
            {performanceScore}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${performanceScore}%` }}
          />
        </div>
      </div>

      {/* Value */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Value for Money
          </span>

          <span className="font-bold text-violet-700">
            {Math.round(valueScore)}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${valueScore}%` }}
          />
        </div>
      </div>

      {/* Trust */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Trust & Verification
          </span>

          <span className="font-bold text-violet-700">
            {trustScore}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{ width: `${trustScore}%` }}
          />
        </div>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {product.inspectionStatus === "Passed" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
          <FaCheckCircle />
          Inspection Passed
        </span>
      )}

      {isRefurbished && product.refurbishmentGrade && (
        <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
          Grade {product.refurbishmentGrade}
        </span>
      )}

      {warrantyMonths > 0 && (
        <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
          {warrantyMonths}M Warranty
        </span>
      )}
    </div>
  </div>
</div>
        {/* PRODUCT DETAIL TABS */}
        <section className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <nav
              aria-label="Product information sections"
              className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 sm:px-5"
            >
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 border-b-2 px-3 py-4 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    activeTab === tab.id
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-slate-500 hover:text-violet-700"
                  }`}
                >
                  {tab.label}
                </a>
              ))}
            </nav>

            {/* DESCRIPTION */}
            <div id="description" className="scroll-mt-24 p-5 sm:p-7">
              <h2 className="text-xl font-bold text-slate-900">
                Product Description
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {product.description ||
                  "No product description available."}
              </p>
            </div>

            {/* SPECIFICATIONS */}
            <div
              id="specifications"
              className="scroll-mt-24 border-t border-slate-100 p-5 sm:p-7"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Specifications
              </h2>

              <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {[
                  ["Product", product.name],
                  ["Brand", product.brand],
                  ["Category", product.category],
                  ["Condition", product.condition],
                  [
                    "Warranty",
                    warrantyMonths > 0
                      ? `${warrantyMonths} months`
                      : "Not specified",
                  ],
                  ["Stock", stock > 0 ? `${stock} units` : "Unavailable"],
                  ...(isRefurbished
                    ? [
                        [
                          "Refurbishment Grade",
                          product.refurbishmentGrade || "Not specified",
                        ],
                        [
                          "Inspection Status",
                          product.inspectionStatus || "Not inspected",
                        ],
                      ]
                    : []),
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 text-sm sm:grid-cols-[180px_1fr]"
                  >
                    <span className="font-medium text-slate-500">
                      {label}
                    </span>
                    <span className="break-words font-semibold capitalize text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {isRefurbished && product.inspectionNotes && (
                <div className="mt-5 rounded-xl bg-violet-50 p-4">
                  <h3 className="font-semibold text-violet-800">
                    Inspection Notes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {product.inspectionNotes}
                  </p>
                </div>
              )}
            </div>

            {/* DELIVERY AND RETURNS */}
            <div
              id="delivery"
              className="scroll-mt-24 border-t border-slate-100 p-5 sm:p-7"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Delivery, Warranty & Return Policy
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <FaTruck className="text-xl text-violet-600" />
                  <h3 className="mt-3 font-semibold text-slate-800">
                    Delivery
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Available delivery options and estimated dates
                    are displayed during checkout.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <FaShieldAlt className="text-xl text-green-600" />
                  <h3 className="mt-3 font-semibold text-slate-800">
                    Warranty
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {warrantyMonths > 0
                      ? `${warrantyMonths} months warranty, as recorded for this product.`
                      : "Warranty details have not been specified."}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                  <FaUndo className="text-xl text-violet-600" />
                  <h3 className="mt-3 font-semibold text-slate-800">
                    Return Policy
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {returnPolicy ||
                      "A product-specific return policy has not been configured yet. Please check the applicable terms with the store before ordering."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Product Summary
              </h2>

              <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                <span className="text-slate-500">Price</span>
                <span className="font-bold text-slate-900">
                  {money(price)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
                <span className="text-slate-500">Condition</span>
                <span className="font-semibold capitalize text-slate-800">
                  {product.condition}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
                <span className="text-slate-500">Warranty</span>
                <span className="font-semibold text-slate-800">
                  {warrantyMonths > 0
                    ? `${warrantyMonths} mo`
                    : "Unspecified"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">Availability</span>
                <span
                  className={`font-semibold ${
                    isInStock
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {isInStock ? "In stock" : "Unavailable"}
                </span>
              </div>

              <p className="mt-3 rounded-lg bg-violet-50 p-3 text-xs leading-5 text-violet-800">
                Secure checkout is available through the store's
                existing checkout process.
              </p>
            </div>

            {isRefurbished && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-700" />
                  <h2 className="font-bold text-green-800">
                    Refurbishment Information
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-green-800">
                  Grade: {product.refurbishmentGrade || "Not specified"}
                </p>
                <p className="mt-1 text-sm leading-6 text-green-800">
                  Inspection: {product.inspectionStatus || "Not inspected"}
                </p>
              </div>
            )}
          </aside>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Discover more
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Customers also viewed
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                More products from the same category.
              </p>
            </div>

            {product.category && (
              <Link
                to={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-violet-700 hover:text-violet-900 sm:self-auto"
              >
                View All
                <FaChevronRight className="text-xs" />
              </Link>
            )}
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <FaBoxOpen className="mx-auto text-3xl text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No related products available
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Explore the catalogue for more products.
              </p>
              <Link
                to="/products"
                className="mt-4 inline-flex rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </section>

        {/* CUSTOMER REVIEWS */}
        <section
          id="reviews"
          className="mt-12 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Customer feedback
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Customer Reviews
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < Math.round(rating)
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {rating.toFixed(1)} / 5
              </span>
              <span className="text-sm text-slate-500">
                ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <ReviewForm
                productId={product._id}
                onReviewAdded={loadProduct}
              />
            </div>
            <div>
              <ReviewList productId={product._id} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;