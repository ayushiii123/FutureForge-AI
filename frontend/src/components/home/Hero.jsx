
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight, FaRobot } from "react-icons/fa";
import { searchProductsByImage } from "../../services/aiService";
const heroImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop",
];

const Hero = () => {
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [search, setSearch] = useState("");
const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [imageSearchLoading, setImageSearchLoading] = useState(false);
const [imageSearchError, setImageSearchError] = useState("");
 const handleSearch = async (e) => {
  e.preventDefault();

  // Image search takes priority when an image is selected.
  if (selectedImage) {
    try {
      setImageSearchLoading(true);
      setImageSearchError("");

      const data = await searchProductsByImage(selectedImage);

      navigate("/products", {
        state: {
          imageSearchResults: data.products ?? [],
          imageSearchMessage: data.message ?? "",
          imageSearchAnalysis: data.analysis ?? null,
        },
      });
    } catch (error) {
      console.error("Image search failed:", error);

      setImageSearchError(
        error.response?.data?.message ||
          error.message ||
          "Image search failed. Please try again."
      );
    } finally {
      setImageSearchLoading(false);
    }

    return;
  }

  // Existing text search
  const query = search.trim();

  if (query) {
    navigate(`/products?keyword=${encodeURIComponent(query)}`);
  } else {
    navigate("/products");
  }
};
const handleImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setImageSearchError("Please select a JPG, PNG, or WEBP image.");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setImageSearchError("Image size must be 5 MB or less.");
    e.target.value = "";
    return;
  }

  setImageSearchError("");
  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));
};
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.35),_transparent_40%),linear-gradient(135deg,_#f5ebff_0%,_#e9dcff_45%,_#fbf7ff_100%)] py-20">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(109,40,217,0.16),transparent_70%)]" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.8),_transparent_70%)] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-flex items-center gap-2 bg-white/80 text-[#5b3df5] px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-violet-200 backdrop-blur">
            <FaRobot />
            Verified gadget marketplace
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mt-6 text-slate-900">
            Discover premium gadgets.
            <span className="block bg-gradient-to-r from-[#5b3df5] via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Sell with confidence.
            </span>
          </h1>

          <p className="text-slate-600 text-lg mt-6 max-w-xl">
            Browse the latest arrivals, certified refurbished devices,
            and seamless trade-in offers — all backed by secure checkout
            and fast delivery.
          </p>

          {/* FUNCTIONAL SEARCH */}

<form
  onSubmit={handleSearch}
  className="mt-8 bg-[linear-gradient(135deg,_#ffffff_0%,_#f6edff_100%)] shadow-[0_20px_60px_rgba(91,61,245,0.22)] rounded-3xl border-2 border-violet-500 focus-within:border-[#5b3df5] focus-within:ring-4 focus-within:ring-violet-200 overflow-hidden max-w-xl backdrop-blur"
>
  <div className="flex items-center gap-3 px-3 py-3">
    <FaSearch className="text-violet-400 shrink-0" />

    <input
      type="text"
      placeholder="Search gadgets, brands, categories..."
      className="flex-1 min-w-0 text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      disabled={imageSearchLoading}
    />

    {/* Image upload button */}
    <label
      htmlFor="hero-image-upload"
      title="Search using an image"
      className="shrink-0 cursor-pointer rounded-xl border border-violet-200 bg-white p-3 text-violet-600 transition hover:bg-violet-50 hover:border-violet-400"
    >
      <span className="flex items-center gap-1 text-sm font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="hidden sm:inline">Image</span>
      </span>
    </label>

    <input
      id="hero-image-upload"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageChange}
      className="hidden"
      disabled={imageSearchLoading}
    />

    <button
      type="submit"
      disabled={imageSearchLoading}
      className="shrink-0 bg-[#5b3df5] hover:bg-[#4c2fe0] disabled:opacity-60 text-white text-sm font-semibold px-4 sm:px-5 py-3 rounded-2xl transition duration-200"
    >
      {imageSearchLoading ? "Analyzing..." : "Search"}
    </button>
  </div>

  {/* Selected image preview */}
  {selectedImage && imagePreview && (
    <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-violet-200 bg-white p-3">
      <img
        src={imagePreview}
        alt="Selected gadget for image search"
        className="h-16 w-16 rounded-lg object-cover border"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700">
          Image selected
        </p>
        <p className="text-xs text-slate-500 truncate">
          {selectedImage.name}
        </p>
        <p className="text-xs text-violet-600">
          Click Search to find similar products
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }
          setSelectedImage(null);
          setImagePreview("");
          setImageSearchError("");
          const input = document.getElementById("hero-image-upload");
          if (input) input.value = "";
        }}
        disabled={imageSearchLoading}
        aria-label="Remove selected image"
        className="rounded-full px-3 py-2 text-lg font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        ×
      </button>
    </div>
  )}

  {/* Image search error */}
  {imageSearchError && (
    <p
      role="alert"
      className="mx-3 mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600"
    >
      {imageSearchError}
    </p>
  )}

  {/* Image search loading indicator */}
  {imageSearchLoading && (
    <div
      className="mx-3 mb-3 flex items-center gap-2 text-sm font-medium text-violet-700"
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-300 border-t-violet-700" />
      AI is analyzing your image and finding products...
    </div>
  )}
</form>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-2 bg-[#5b3df5] text-white px-7 py-3 rounded-2xl font-semibold hover:bg-[#4c2fe0] transition shadow-[0_12px_35px_rgba(91,61,245,0.25)]"
            >
              Browse New Arrivals
              <FaArrowRight />
            </button>

            <Link
              to="/refurbished"
              className="inline-flex items-center justify-center gap-2 border border-violet-400 text-slate-700 px-7 py-3 rounded-2xl hover:bg-[#f5ebff] transition"
            >
              Explore Refurbished
            </Link>
          </div>

          {/* MARKETPLACE STATISTICS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 text-slate-700">
            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">10K+</p>
              <p className="mt-2 text-sm text-slate-500">
                Devices sold
              </p>
            </div>

            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">4.9/5</p>
              <p className="mt-2 text-sm text-slate-500">
                Customer rating
              </p>
            </div>

            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">12 mo</p>
              <p className="mt-2 text-sm text-slate-500">
                Warranty coverage
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE CAROUSEL */}
        <div className="relative flex justify-center">
          <div className="absolute w-80 h-80 bg-violet-300 rounded-full blur-3xl opacity-40 animate-pulse" />

          <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/70 border border-violet-300 shadow-md animate-bounce [animation-duration:3s]" />

          <div className="absolute bottom-6 left-4 h-12 w-12 rounded-full bg-violet-200/70 blur-sm animate-pulse [animation-duration:2.5s]" />

          <div className="relative z-10 w-full max-w-[450px]">
            <div className="absolute top-10 left-8 z-20 rounded-2xl border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#5b3df5] shadow-lg backdrop-blur">
              AI-powered picks
            </div>

            <div className="h-[500px] overflow-hidden rounded-[32px] border border-violet-300 shadow-[0_24px_80px_rgba(91,61,245,0.2)] bg-violet-50">
              <img
                key={heroImages[currentImageIndex]}
                src={heroImages[currentImageIndex]}
                alt="Featured gadgets"
                className="h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
              />
            </div>

            {/* CAROUSEL INDICATORS */}
            <div className="mt-4 flex justify-center gap-2">
              {heroImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === index
                      ? "bg-violet-600 scale-110"
                      : "bg-violet-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
