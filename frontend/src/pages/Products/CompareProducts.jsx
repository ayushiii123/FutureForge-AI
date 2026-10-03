import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCompareProducts,
  removeFromCompare,
  clearCompare,
  subscribeToCompare,
} from "../../services/compareService";
import getProductImageUrl from "../../utils/imageUrl";

const CompareProducts = () => {
  const [products, setProducts] = useState(getCompareProducts);

  useEffect(() => {
    return subscribeToCompare(() => {
      setProducts(getCompareProducts());
    });
  }, []);

  const handleRemove = (id) => {
    removeFromCompare(id);
  };

  const handleClear = () => {
    if (window.confirm("Clear all compared products?")) {
      clearCompare();
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const features = [
    { label: "Brand", value: (p) => p.brand || "Not specified" },
    { label: "Category", value: (p) => p.category || "Not specified" },
    { label: "Condition", value: (p) => p.condition || "Not specified" },
    { label: "Price", value: (p) => formatPrice(p.price) },
    {
      label: "Original Price",
      value: (p) =>
        Number(p.originalPrice) > 0
          ? formatPrice(p.originalPrice)
          : "Not available",
    },
    {
      label: "Description",
      value: (p) => p.description || "No description available",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 p-8 text-white shadow-xl mb-8">
        <p className="text-sm uppercase tracking-widest text-indigo-100">
          TechRevive
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Compare Products
        </h1>
        <p className="text-indigo-100 mt-3">
          Compare devices side by side and find the right one for you.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <div className="text-5xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-slate-800">
            No products to compare
          </h2>
          <p className="text-slate-500 mt-2">
            Add products from the All Products page to compare them.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 bg-[#5b3df5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-slate-600 font-medium">
              Comparing {products.length} of 3 products
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-4 py-2 rounded-xl border border-violet-500 text-violet-700 font-semibold hover:bg-violet-50 transition"
              >
                + Add Products
              </Link>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-violet-200 shadow-sm bg-white">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="bg-violet-50">
                  <th className="p-4 text-left text-slate-700 w-40">
                    Features
                  </th>

                  {products.map((product) => (
                    <th
                      key={product._id}
                      className="p-4 text-center border-l border-violet-100 min-w-[190px]"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={getProductImageUrl(
                            product.image,
                            product.name || "Product"
                          )}
                          alt={product.name || "Product"}
                          className="w-32 h-32 object-contain rounded-xl bg-white"
                        />

                        <h2 className="font-bold text-slate-800 text-base">
                          {product.name}
                        </h2>

                        <button
                          onClick={() => handleRemove(product._id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>

                        <Link
                          to={`/product/${product._id}`}
                          className="text-sm bg-[#5b3df5] text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </th>
                  ))}

                  {Array.from({
                    length: 3 - products.length,
                  }).map((_, index) => (
                    <th
                      key={`empty-${index}`}
                      className="p-4 border-l border-violet-100 min-w-[190px]"
                    >
                      <Link
                        to="/products"
                        className="flex flex-col items-center justify-center min-h-52 border-2 border-dashed border-violet-200 rounded-xl text-violet-600 hover:bg-violet-50 transition"
                      >
                        <span className="text-4xl">+</span>
                        <span className="mt-2 text-sm font-semibold">
                          Add Product
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {features.map((feature) => (
                  <tr
                    key={feature.label}
                    className="border-t border-slate-200"
                  >
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50 align-top">
                      {feature.label}
                    </td>

                    {products.map((product) => (
                      <td
                        key={product._id}
                        className="p-4 text-center text-sm text-slate-600 border-l border-slate-100 align-top"
                      >
                        {feature.value(product)}
                      </td>
                    ))}

                    {Array.from({
                      length: 3 - products.length,
                    }).map((_, index) => (
                      <td
                        key={`empty-${index}`}
                        className="p-4 border-l border-slate-100"
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Product information is based on the details currently saved
            in your comparison list.
          </p>
        </>
      )}
    </div>
  );
};

export default CompareProducts;