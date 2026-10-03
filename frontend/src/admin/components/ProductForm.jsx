import { useState } from "react";
import { addProduct } from "../../services/productService";

const ProductForm = () => {
 const [form, setForm] = useState({
  name: "",
  brand: "",
  category: "",
  condition: "new",
  refurbishmentGrade: "",
  warrantyMonths: "0",
  inspectionStatus: "Not Inspected",
  inspectionNotes: "",
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
      refurbishmentGrade: "",
warrantyMonths: "0",
inspectionStatus: "Not Inspected",
inspectionNotes: "",
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
{/* Warranty */}
<input
  name="warrantyMonths"
  type="number"
  min="0"
  value={form.warrantyMonths}
  onChange={handleChange}
  placeholder="Warranty (months)"
  className="w-full border p-3 rounded-lg"
/>

{/* Refurbished Product Inspection */}
{form.condition === "refurbished" && (
  <div className="space-y-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
    <h3 className="text-lg font-bold text-violet-800">
      Refurbishment & Inspection
    </h3>

    <label className="block text-sm font-semibold text-slate-700">
      Refurbishment Grade
      <select
        name="refurbishmentGrade"
        value={form.refurbishmentGrade}
        onChange={handleChange}
        className="mt-2 w-full border p-3 rounded-lg bg-white"
      >
        <option value="">Select Grade</option>
        <option value="A">Grade A - Excellent</option>
        <option value="B">Grade B - Good</option>
        <option value="C">Grade C - Fair</option>
      </select>
    </label>

    <label className="block text-sm font-semibold text-slate-700">
      Inspection Status
      <select
        name="inspectionStatus"
        value={form.inspectionStatus}
        onChange={handleChange}
        className="mt-2 w-full border p-3 rounded-lg bg-white"
      >
        <option value="Not Inspected">Not Inspected</option>
        <option value="Passed">Passed</option>
        <option value="Needs Review">Needs Review</option>
      </select>
    </label>

    <label className="block text-sm font-semibold text-slate-700">
      Inspection Notes
      <textarea
        name="inspectionNotes"
        value={form.inspectionNotes}
        onChange={handleChange}
        placeholder="Enter actual inspection observations..."
        rows={3}
        className="mt-2 w-full border p-3 rounded-lg bg-white"
      />
    </label>
  </div>
)}
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