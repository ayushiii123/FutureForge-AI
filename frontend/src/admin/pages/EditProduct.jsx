import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleProduct,
  updateProduct,
} from "../../services/productService";

const EditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    condition: "new",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getSingleProduct(id);

        setForm({
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          condition: product.condition || "new",
          description: product.description || "",
          price: product.price || "",
          originalPrice: product.originalPrice || "",
          stock: product.stock || "",
        });

        setPreview(product.image || "");
      } catch (error) {
        console.log(error);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      await updateProduct(id, formData);

      alert("Product Updated Successfully");

      navigate("/admin/products");

    } catch (error) {
      console.log(error);
      alert("Failed to Update Product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="new">New</option>
          <option value="refurbished">Refurbished</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="originalPrice"
          value={form.originalPrice}
          onChange={handleChange}
          placeholder="Original Price"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>

      </form>

    </div>
  );
};

export default EditProduct;