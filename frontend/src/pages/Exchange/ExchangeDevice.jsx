import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";

const ExchangeDevice = () => {
	const [products, setProducts] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [form, setForm] = useState({
		name: "",
		email: "",
		device: "",
		condition: "",
	});

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const data = await getProducts({ sort: "latest" });
				setProducts(data.slice(0, 4));
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingProducts(false);
			}
		};

		loadProducts();
	}, []);

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		alert("Exchange request submitted. We'll contact you soon.");
		setForm({ name: "", email: "", device: "", condition: "" });
	};

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">Exchange Your Device</h1>

			<div className="mb-10 rounded-3xl bg-slate-50 p-8 shadow-sm">
				<h2 className="text-2xl font-semibold mb-4">Suggested Devices for Exchange</h2>
				{loadingProducts ? (
					<div className="text-center py-10">Loading products...</div>
				) : products.length === 0 ? (
					<div className="text-center text-gray-500 py-10">No exchange products available right now.</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				)}
			</div>

			<form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
				<input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="w-full border p-3 rounded" />
				<input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-3 rounded" />
				<input name="device" value={form.device} onChange={handleChange} placeholder="Device Model" className="w-full border p-3 rounded" />
				<select name="condition" value={form.condition} onChange={handleChange} className="w-full border p-3 rounded">
					<option value="">Select Condition</option>
					<option value="new">New</option>
					<option value="refurbished">Refurbished</option>
					<option value="used">Used</option>
				</select>
				<button className="bg-indigo-600 text-white px-6 py-3 rounded">Submit Exchange Request</button>
			</form>
		</div>
	);
};

export default ExchangeDevice;
