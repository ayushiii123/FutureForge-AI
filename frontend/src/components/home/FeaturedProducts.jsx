import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../products/ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({ sort: "latest" });
      setProducts(data.slice(0, 8));
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-12 px-5">

      <h2 className="text-3xl font-bold mb-8">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
};

export default FeaturedProducts;