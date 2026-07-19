import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/ProductList";
import AddProduct from "../pages/AddProduct";
import Orders from "../pages/Order";
import EditProduct from "../pages/EditProduct";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>

        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="products"
          element={<ProductList />}
        />

        <Route
          path="add-product"
          element={<AddProduct />}
        />

        <Route
          path="orders"
          element={<Orders />}
        />

        <Route
          path="edit-product/:id"
          element={<EditProduct />}
        />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;