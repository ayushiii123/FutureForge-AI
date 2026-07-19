import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist } from "../../services/wishlistService";
import ProductCard from "../../components/products/ProductCard";
import { useAuth } from "../../context/AuthContext";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setProducts([]);
      return;
    }

    loadWishlist();
  }, [isLoggedIn]);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setProducts(data.map((item) => item.product));
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
      {!isLoggedIn ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-700">Please log in to view your wishlist</h2>
          <p className="text-slate-500 mt-2">Sign in to save and manage your favorite items.</p>
          <Link
            to="/login"
            className="mt-5 inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      ) : products.length === 0 ? (
        <h2 className="text-center text-gray-500">Wishlist is Empty</h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
