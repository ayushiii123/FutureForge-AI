import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import getProductImageUrl from "../../utils/imageUrl";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      loadWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    alert("Product added to Cart");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold mb-8">
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">

          <h2 className="text-2xl font-semibold mb-4">
            Your Wishlist is Empty ❤️
          </h2>

          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
          >
            Browse Products
          </Link>

        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4"
            >

              <img
                src={getProductImageUrl(item.product.image, item.product.name)}
                alt={item.product.name}
                className="w-full h-52 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";
                }}
              />

              <h2 className="font-bold text-lg mt-4">
                {item.product.name}
              </h2>

              <p className="text-gray-500">
                {item.product.brand}
              </p>

              <h3 className="text-indigo-600 font-bold text-xl mt-2">
                ₹{item.product.price}
              </h3>

              <div className="flex gap-2 mt-5">

                <button
                  onClick={() => moveToCart(item.product)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Wishlist;