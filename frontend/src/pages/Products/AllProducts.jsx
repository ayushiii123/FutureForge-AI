import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";
import PromoBillboard from "../../components/common/PromoBillboard";
const AllProducts = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
const [sortBy, setSortBy] = useState("featured");
const [condition, setCondition] = useState("All");
const [imageSearchResults, setImageSearchResults] = useState(null);
const [imageSearchMessage, setImageSearchMessage] = useState("");
const [imageSearchAnalysis, setImageSearchAnalysis] = useState(null);
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
useEffect(() => {
  const state = location.state;

  if (Array.isArray(state?.imageSearchResults)) {
    setImageSearchResults(state.imageSearchResults);
    setImageSearchMessage(state.imageSearchMessage || "");
    setImageSearchAnalysis(state.imageSearchAnalysis || null);

    setSearch("");
    setCategory("All");
    setCondition("All");
    setSortBy("featured");
  } else {
    setImageSearchResults(null);
    setImageSearchMessage("");
    setImageSearchAnalysis(null);
  }
}, [location.key]);
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
      const params = {};

      if (category && category !== "All") {
        params.category = category;
      }

      const data = await getProducts(params);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  loadProducts();
}, [category]);

  useEffect(() => {
let data = [...(imageSearchResults ?? products)];

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
    // Filter by product condition
if (condition !== "All") {
  data = data.filter(
    (item) =>
      item.condition?.toLowerCase() === condition.toLowerCase()
  );
}
// Sort products
if (sortBy === "price-low") {
  data.sort((a, b) => a.price - b.price);
} else if (sortBy === "price-high") {
  data.sort((a, b) => b.price - a.price);
} else if (sortBy === "newest") {
  data.sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  );
}
    setFilteredProducts(data);
  }, [search, category, products, sortBy,condition,imageSearchResults,]);


   return (
  <div className="max-w-7xl mx-auto py-10 px-5">
    <PromoBillboard />

    {/* Existing search, filters and product listing ka code yahan same rahega */}

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
        <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-slate-200 p-3 rounded-xl w-full lg:w-64 shadow-sm focus:border-indigo-500 focus:outline-none"
>
  <option value="featured">Sort By: Featured</option>
  <option value="price-low">Price: Low to High</option>
  <option value="price-high">Price: High to Low</option>
  <option value="newest">Newest First</option>
</select>
<select
  value={condition}
  onChange={(e) => setCondition(e.target.value)}
  className="border border-slate-200 p-3 rounded-xl w-full lg:w-64 shadow-sm focus:border-indigo-500 focus:outline-none"
>
  <option value="All">All Conditions</option>
  <option value="new">New</option>
  <option value="refurbished">Refurbished</option>
</select>
      </div>

{imageSearchResults !== null && (
  <div className="mb-6 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-5 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <h2 className="text-xl font-bold text-violet-800">
            AI Image Search Results
          </h2>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {imageSearchMessage ||
            `Found ${imageSearchResults.length} matching products.`}
        </p>

        {imageSearchAnalysis && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              imageSearchAnalysis.productType,
              imageSearchAnalysis.brand,
              imageSearchAnalysis.model,
            ]
              .filter(Boolean)
              .map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {item}
                </span>
              ))}
          </div>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Results are based on AI-identified product details.
          Matches may not be exact.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setImageSearchResults(null);
          setImageSearchMessage("");
          setImageSearchAnalysis(null);
          setSearch("");
          setCategory("All");
          setCondition("All");
          setSortBy("featured");
        }}
        className="shrink-0 rounded-xl border border-violet-300 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        Clear Image Search
      </button>
    </div>
  </div>
)}
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
