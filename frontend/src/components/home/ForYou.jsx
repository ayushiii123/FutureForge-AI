import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../products/ProductCard";

const ForYou = () => {
  const [products, setProducts] = useState([]);
  const [recentIds, setRecentIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("techrevive_recent_products") || "[]"
        );

        const safeRecentIds = Array.isArray(stored) ? stored : [];
        setRecentIds(safeRecentIds);

        const data = await getProducts({ sort: "latest" });

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("For You products error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const recommendedProducts = useMemo(() => {
    if (!products.length) return [];

    if (recentIds.length) {
      const recentProducts = recentIds
        .map((id) =>
          products.find(
            (product) => String(product._id) === String(id)
          )
        )
        .filter(Boolean);

      const recentProductIds = new Set(
        recentProducts.map((product) => String(product._id))
      );

      const additionalProducts = products.filter(
        (product) => !recentProductIds.has(String(product._id))
      );

      return [...recentProducts, ...additionalProducts].slice(0, 4);
    }

    return products.slice(0, 4);
  }, [products, recentIds]);

  if (!loading && recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-6 shadow-sm ring-1 ring-violet-100 sm:p-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
              Smart Recommendations
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              ✨ Picked For You
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {recentIds.length
                ? "Based on the products you recently explored."
                : "Explore products and we'll personalize this section for you."}
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm font-semibold text-violet-700 shadow-sm backdrop-blur">
            AI-style discovery
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-2xl bg-white/80"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ForYou;