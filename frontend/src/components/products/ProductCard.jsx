import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { addToWishlist } from "../../services/wishlistService";
import getProductImageUrl from "../../utils/imageUrl";

const ProductCard = ({ product }) => {
  const imageSource = product?.image || product?.img || "";
  const handleWishlist = async () => {
    try {
      await addToWishlist(product._id);
      alert("Added to Wishlist");
    } catch (error) {
      alert(error.response?.data?.message || "Please Login First");
    }
  };

  const img = getProductImageUrl(imageSource, product?.name || "Product");

  return (
    <div className="bg-[linear-gradient(135deg,_#ffffff_0%,_#f6edff_100%)] rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden border border-violet-200">

      <div className="relative">

        <img
          key={`${product?._id || product?.name || "product"}-${imageSource}`}
          src={img}
          alt={product?.name || "Product"}
          className="h-56 w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop`;
          }}
        />

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-violet-100 p-2 rounded-full shadow border border-violet-300"
        >
          <FaHeart className="text-[#5b3df5]" />
        </button>

        {product.condition && (
          <span className="absolute left-3 top-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {product?.condition || "new"}
          </span>
        )}

      </div>

      <div className="p-4">

        <h2 className="font-semibold text-lg truncate">
          {product?.name || "Product"}
        </h2>

        <p className="text-gray-500 text-sm">
          {product?.brand || "TechRevive"}
        </p>

        {product?.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-baseline gap-3 mt-3">
          <h3 className="text-2xl font-bold text-[#5b3df5]">₹{product?.price ?? 0}</h3>
          {Number(product?.originalPrice || 0) > 0 && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        <Link
          to={`/product/${product?._id || ""}`}
          className="mt-4 block bg-[#5b3df5] text-white text-center py-2 rounded-lg hover:bg-violet-700 transition"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default ProductCard;