import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../products/ProductCard";

const NewArrivals = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({ sort: "latest" });
      setProducts(data.slice(0, limit));
    };

    fetchProducts();
  }, [limit]);

  return (
    <section className="max-w-7xl mx-auto py-16 px-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-500 font-semibold">Fresh arrivals</p>
          <h2 className="text-3xl font-bold mt-2">New Arrivals</h2>
        </div>
        <p className="text-slate-500">Recently added premium devices and accessories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
