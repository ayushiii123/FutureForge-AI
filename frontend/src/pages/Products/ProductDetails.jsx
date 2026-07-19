import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { getSingleProduct } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";
import getProductImageUrl from "../../utils/imageUrl";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const data = await getSingleProduct(id);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-2xl">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl">Product Not Found</div>;
  }

  const discount = product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const imageUrl = getProductImageUrl(product.image, product.name);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img src={imageUrl} alt={product.name} className="w-full h-[500px] object-cover rounded-xl shadow" onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";
          }} />
        </div>

        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-2">{product.brand}</p>

          <div className="flex items-center gap-3 mt-4">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"}
              />
            ))}
            <span>({product.numReviews || 0} Reviews)</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5 rounded-2xl border border-violet-200 bg-[linear-gradient(135deg,_#f8f3ff_0%,_#ffffff_100%)] px-5 py-4 shadow-sm">
            <div>
              <h2 className="text-4xl font-bold text-[#5b3df5]">₹{product.price}</h2>
              {product.originalPrice > 0 && (
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <p className="line-through text-gray-500">₹{product.originalPrice}</p>
                  <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">{discount}% OFF</span>
                </div>
              )}
            </div>
            <div className="rounded-full border border-violet-200 bg-white px-3 py-1 text-sm font-medium text-violet-700">
              Secure checkout • Fast delivery
            </div>
          </div>

          <p className="mt-8 text-gray-700 leading-8">{product.description}</p>

          <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 shadow-sm">
            <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Condition:</strong> {product.condition}</p>
              <p>
                <strong>Availability:</strong>{" "}
                <span className={product.stock > 0 ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </p>
              <p><strong>Warranty:</strong> 12-month TechRevive coverage</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(product);
                alert("Added To Cart");
              }}
              className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-3 text-base font-semibold text-white shadow-lg transition ${product.stock === 0 ? "cursor-not-allowed bg-gray-400" : "bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] hover:scale-[1.01]"}`}
            >
              <FaShoppingCart /> Add To Cart
            </button>

            <button
              onClick={() => {
                addToCart(product);
                navigate("/checkout");
              }}
              className="rounded-2xl bg-[linear-gradient(135deg,_#10b981_0%,_#059669_100%)] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Buy Now
            </button>

            <button
              onClick={async () => {
                try {
                  await addToWishlist(product._id);
                  alert("Added To Wishlist");
                } catch (error) {
                  alert(error.response?.data?.message || "Please log in to add to wishlist");
                }
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-red-400 px-8 py-3 text-base font-semibold text-red-500 transition hover:bg-red-50"
            >
              <FaHeart /> Save to Wishlist
            </button>
          </div>

          <div className="mt-16">
            <ReviewForm productId={product._id} onReviewAdded={loadProduct} />
            <ReviewList productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
