import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "../admin/routes/AdminRoutes";
import PageState from "../components/common/PageState";
import Wishlist from "../pages/Wishlist/Wishlist";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AllProducts from "../pages/Products/AllProducts";
import ProductDetails from "../pages/Products/ProductDetails";
import Refurbished from "../pages/Products/Refurbished";
import ExchangeDevice from "../pages/Exchange/ExchangeDevice";
import SellDevice from "../pages/SellDevice/SellDevice";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import MyOrders from "../pages/Orders/MyOrder";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectRoute";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={isLoggedIn ? <AllProducts /> : <Navigate to="/login" replace />} />
      <Route path="/refurbished" element={isLoggedIn ? <Refurbished /> : <Navigate to="/login" replace />} />
      <Route path="/exchange" element={isLoggedIn ? <ExchangeDevice /> : <Navigate to="/login" replace />} />
      <Route path="/sell-device" element={isLoggedIn ? <SellDevice /> : <Navigate to="/login" replace />} />
      <Route path="/product/:id" element={isLoggedIn ? <ProductDetails /> : <Navigate to="/login" replace />} />
      <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        path="/home"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route path="/wishlist" element={<Wishlist />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <PageState
            title="Oops! Page not found"
            message="The page you’re looking for may have been moved or removed. Use the buttons below to go back or head home."
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;