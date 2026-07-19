import ProductForm from "../components/ProductForm";

const AddProduct = () => {
  return (
    <div className="max-w-5xl mx-auto">

      <div className="bg-white shadow rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-6">
          Add New Product
        </h1>

        <ProductForm />

      </div>

    </div>
  );
};

export default AddProduct;