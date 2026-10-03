import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
const [stockFilter, setStockFilter] = useState("all");
  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      alert("Product Deleted Successfully");
      loadProducts();
    }
  };

 const filteredProducts = products.filter((item) => {
  const query = search.toLowerCase();

  const matchesSearch =
    String(item.name || "").toLowerCase().includes(query) ||
    String(item.brand || "").toLowerCase().includes(query);

  const stock = Number(item.stock ?? 0);

  const matchesStock =
    stockFilter === "all" ||
    (stockFilter === "low" && stock >= 1 && stock <= 5) ||
    (stockFilter === "out" && stock === 0) ||
    (stockFilter === "healthy" && stock > 5);

  return matchesSearch && matchesStock;
});
const lowStockProducts = products.filter(
  (item) => Number(item.stock) <= 5
);
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Products ({filteredProducts.length})
        </h1>

        <Link
          to="/admin/add-product"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </Link>

      </div>
{lowStockProducts.length > 0 && (
  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl">⚠️</span>

      <div>
        <h2 className="font-bold text-red-700">
          Low Stock Alert
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {lowStockProducts.length} product(s) have 5 or fewer
          units remaining.
        </p>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      {lowStockProducts.map((item) => (
        <span
          key={item._id}
          className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700"
        >
          {item.name}: {item.stock} left
        </span>
      ))}
    </div>
  </div>
)}
      <input
        type="text"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 border-violet-500 bg-[linear-gradient(135deg,_#ffffff_0%,_#f9f4ff_100%)] rounded-lg px-4 py-2 w-full mb-6 shadow-[0_8px_24px_rgba(91,61,245,0.12)] focus:border-[#5b3df5] focus:outline-none focus:ring-4 focus:ring-violet-200"
      />
<select
  value={stockFilter}
  onChange={(e) => setStockFilter(e.target.value)}
  aria-label="Filter products by stock status"
  className="w-full mb-6 rounded-lg border border-violet-300 bg-white px-4 py-3 focus:border-violet-500 focus:outline-none sm:w-72"
>
  <option value="all">All Stock Status</option>
  <option value="low">Low Stock (1–5)</option>
  <option value="out">Out of Stock (0)</option>
  <option value="healthy">Healthy Stock (6+)</option>
</select>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No Products Found
        </div>
      ) : (
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>

                <td>{item.name}</td>

                <td>{item.brand}</td>

                <td>₹{item.price}</td>

                <td>
                  <span
                    className={
                      item.stock <= 5
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                  >
                    {item.stock}
                  </span>
                </td>

                <td className="space-x-2">

                  <Link
                    to={`/admin/edit-product/${item._id}`}
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default ProductList;