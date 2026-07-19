import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";

const Refurbished = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        const refurbishedOnly = data.filter((p) => p.condition === "refurbished");
        setProducts(refurbishedOnly);
        setFilteredProducts(refurbishedOnly);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((item) => {
        const searchable = `${item.name || ""} ${item.brand || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
        return searchable.includes(query);
      });
    }

    if (category !== "All") {
      result = result.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
    }

    setFilteredProducts(result);
  }, [search, category, products]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] p-8 text-white shadow-xl mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-100">TechRevive AI</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Refurbished gadgets, reimagined for value</h1>
        <p className="text-violet-100 mt-3 max-w-2xl">
          Explore a curated collection of professionally checked refurbished phones, laptops, tablets, watches, cameras, and accessories.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search refurbished gadgets..."
          className="border-2 border-violet-500 bg-[linear-gradient(135deg,_#ffffff_0%,_#f9f4ff_100%)] p-3 rounded-xl w-full lg:w-80 shadow-[0_8px_24px_rgba(91,61,245,0.12)] focus:border-[#5b3df5] focus:outline-none focus:ring-4 focus:ring-violet-200"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-200 p-3 rounded-xl w-full lg:w-64 shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          <option>All</option>
          <option>Smartphones</option>
          <option>Laptops</option>
          <option>Tablets</option>
          <option>Accessories</option>
          <option>Smart Watches</option>
          <option>Headphones</option>
          <option>Cameras</option>
        </select>
      </div>

      <div className="mb-6 text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> refurbished products
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          No refurbished products match your current search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Refurbished;
