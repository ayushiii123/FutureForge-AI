import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { getProducts } from "../../services/productService";

const RefurbishedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({ category: "" });
      setProducts(data.filter((item) => item.condition === "refurbished").slice(0, 4));
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-[linear-gradient(180deg,_#f8f5ff_0%,_#ffffff_100%)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-500 font-semibold">Certified quality</p>
            <h2 className="text-4xl font-bold mt-2">
              Premium <span className="text-[#5B3DF5]">Refurbished</span> Deals
            </h2>
            <p className="text-gray-500 mt-2">Carefully tested gadgets with warranty and dependable performance.</p>
          </div>
          <Link to="/refurbished" className="text-[#5B3DF5] font-semibold hover:text-violet-700">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item._id} className="rounded-[24px] border border-violet-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f6edff_100%)] p-5 shadow-sm hover:shadow-lg transition">
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover rounded-2xl"
              />
              <h3 className="font-bold text-lg mt-4">{item.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.brand}</p>
              <div className="flex items-center gap-2 mt-3 text-yellow-500">
                <FaStar />
                <span className="text-sm font-semibold">{item.rating?.toFixed(1) || 0}</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-slate-900">₹{item.price}</span>
                <span className="ml-3 text-gray-400 line-through">₹{item.originalPrice || item.price}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-green-600">
                <FaCheckCircle />
                <span className="text-sm">12 Months Warranty</span>
              </div>
              <Link
                to={`/product/${item._id}`}
                className="mt-5 block bg-[#5B3DF5] text-white text-center py-3 rounded-xl hover:bg-purple-700 transition"
              >
                Buy Refurbished
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RefurbishedProducts;