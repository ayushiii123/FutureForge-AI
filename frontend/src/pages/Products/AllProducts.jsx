import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";

const AllProducts = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categoryMap = {
    camera: "Cameras",
    cameras: "Cameras",
    cameraS: "Cameras",
    phone: "Smartphones",
    phones: "Smartphones",
    smartphone: "Smartphones",
    smartphones: "Smartphones",
    tablet: "Tablets",
    tablets: "Tablets",
    "smart watch": "Smart Watches",
    smartwatch: "Smart Watches",
    "smart watches": "Smart Watches",
    "smart watches": "Smart Watches",
    watch: "Smart Watches",
    headphones: "Headphones",
    headphone: "Headphones",
    earbuds: "Headphones",
    laptop: "Laptops",
    laptops: "Laptops",
    accessories: "Accessories",
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    const urlCategory = params.get("category") || "";
    setSearch(keyword);
    if (urlCategory) setCategory(urlCategory);
  }, [location.search]);

  // If user typed a category name as keyword (e.g. "camera"), treat it as category filter
  useEffect(() => {
    if (!search) return;
    const term = search.trim().toLowerCase();
    const mapped = categoryMap[term];
    if (mapped) {
      setCategory(mapped);
      setSearch("");
      // update URL so links remain consistent
      const params = new URLSearchParams(location.search);
      params.delete("keyword");
      params.set("category", mapped);
      window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
    }
  }, [search]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = {
          keyword: search || undefined,
        };
        if (category && category !== "All") params.category = category;

        const data = await getProducts(params);
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, [search, category]);

  useEffect(() => {
    let data = [...products];

    if (search) {
      const query = search.toLowerCase();

      // If any product names contain the query, show only those exact name matches
      const nameMatches = data.filter((item) => (item.name || "").toLowerCase().includes(query));
      if (nameMatches.length > 0) {
        data = nameMatches;
      } else {
        // otherwise search across name, brand, category and description
        data = data.filter((item) => {
          const searchable = `${item.name || ""} ${item.brand || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
          return searchable.includes(query);
        });
      }
    }

    if (category !== "All") {
      data = data.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
    }

    setFilteredProducts(data);
  }, [search, category, products]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-100">TechRevive</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Discover premium devices</h1>
            <p className="text-indigo-100 mt-3 max-w-2xl">
              Browse curated refurbished and new gadgets with trusted quality and attractive pricing.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <div className="text-5xl mb-3">🔎</div>
          <h2 className="text-xl font-semibold text-slate-700">No products matched your search</h2>
          <p className="text-slate-500 mt-2">Try a different keyword or switch categories to explore more items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;