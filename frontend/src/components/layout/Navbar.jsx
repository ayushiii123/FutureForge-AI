import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { getCartCount } from "../../services/cartService";
import { getWishlist } from "../../services/wishlistService";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);

useEffect(() => {
  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlistCount(data.length);
    } catch (err) {}
  };

  loadWishlist();
}, []);
  const [search, setSearch] = useState("");

  const cartCount = getCartCount();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      const term = search.trim().toLowerCase();
      const map = {
        camera: "Cameras",
        cameras: "Cameras",
        phone: "Smartphones",
        phones: "Smartphones",
        smartphone: "Smartphones",
        tablet: "Tablets",
        tablets: "Tablets",
        "smart watch": "Smart Watches",
        smartwatch: "Smart Watches",
        watch: "Smart Watches",
        headphones: "Headphones",
        earbuds: "Headphones",
        laptop: "Laptops",
        laptops: "Laptops",
        accessories: "Accessories",
      };

      if (map[term]) {
        navigate(`/products?category=${encodeURIComponent(map[term])}`);
      } else {
        navigate(`/products?keyword=${encodeURIComponent(search)}`);
      }
    }
  };

  return (
    <nav className="bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f0ff_100%)] shadow sticky top-0 z-50 border-b border-violet-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold text-slate-900">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#5b3df5_0%,_#8b5cf6_100%)] shadow-[0_8px_25px_rgba(91,61,245,0.25)]">
                <div className="absolute inset-0 rounded-2xl border border-white/40"></div>
                <span className="text-lg font-black tracking-[0.2em] text-white">T</span>
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse"></span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[0.95rem] font-black uppercase tracking-[0.32em] text-[#5b3df5]">TechRevive</span>
                <span className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.42em] text-slate-500">Aurelia AI</span>
              </div>
            </Link>
            <span className="hidden lg:inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm text-[#5b3df5] font-semibold border border-violet-200">
              Premium electronics, trusted resale
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-slate-700 font-medium">
            <Link to="/" className="transition text-[#5b3df5] hover:text-violet-700">Home</Link>
            <Link to="/products" className="transition text-[#5b3df5] hover:text-violet-700">Products</Link>
            <Link to="/refurbished" className="transition text-[#5b3df5] hover:text-violet-700">Refurbished</Link>
            <Link to="/sell-device" className="transition text-[#5b3df5] hover:text-violet-700">Sell Device</Link>
            <Link to="/exchange" className="transition text-[#5b3df5] hover:text-violet-700">Exchange</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-[#5b3df5] transition" title="Cart">
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative text-[#5b3df5] transition" title="Wishlist">
              <FaHeart className="text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/login" className="hidden lg:inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-[#5b3df5] hover:bg-violet-100 transition">
              <FaUserCircle />
              Login
            </Link>

            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 mt-4 px-4 py-3 bg-[linear-gradient(135deg,_#f7f0ff_0%,_#efe6ff_100%)] rounded-3xl border border-violet-300 shadow-sm">
          <div className="flex items-center gap-3 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8f2ff_100%)] rounded-3xl px-4 py-2 shadow-[0_8px_24px_rgba(91,61,245,0.12)] border-2 border-violet-500 focus-within:border-[#5b3df5] focus-within:ring-4 focus-within:ring-violet-200 w-full max-w-2xl">
            <FaSearch className="text-[#5b3df5]" />
            <input
              type="text"
              placeholder="Search products, brands, categories"
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <p className="text-sm text-[#5b3df5] font-medium">Free shipping · Secure checkout · 24/7 support</p>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t bg-white">
          <Link to="/" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Home</Link>
          <Link to="/products" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Products</Link>
          <Link to="/refurbished" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Refurbished</Link>
          <Link to="/sell-device" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Sell Device</Link>
          <Link to="/exchange" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Exchange</Link>
          <Link to="/login" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">Login</Link>
          <Link to="/my-orders" className="block px-4 py-4 text-[#5b3df5] hover:bg-violet-50">My Orders</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;