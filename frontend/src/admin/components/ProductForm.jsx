import { useState } from "react";
import { addProduct } from "../../services/productService";

const ProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    condition: "new",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
const [preview, setPreview] = useState("");
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

    await addProduct(formData);

    alert("Product Added Successfully");
    setPreview("");

    setForm({
      name: "",
      brand: "",
      category: "",
      condition: "new",
      description: "",
      price: "",
      originalPrice: "",
      stock: "",
      image: "",
    });

    setImage(null);

  } catch (err) {
    console.log(err);
    alert("Error adding product");
  }
  finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="brand"
        value={form.brand}
        onChange={handleChange}
        placeholder="Brand"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full border p-3 rounded-lg"
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
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="originalPrice"
        type="number"
        value={form.originalPrice}
        onChange={handleChange}
        placeholder="Original Price"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full border p-3 rounded-lg"
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
    className="w-40 h-40 object-cover rounded-lg mt-4 border"
  />
)}

      <button
      disabled={loading}
        className="bg-[#5B3DF5] text-white px-8 py-3 rounded-lg"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;