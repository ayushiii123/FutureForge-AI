
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaShoppingBag,
  FaTruck,
  FaRedo,
  FaTimesCircle,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

import {
  getMyOrders,
  cancelOrder,
} from "../../services/orderService";

import getProductImageUrl from "../../utils/imageUrl";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) =>
  String(status || "Pending").trim().toLowerCase();

const getOrderStatusClass = (status) => {
  switch (normalizeStatus(status)) {
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    case "shipped":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "confirmed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};

const getPaymentClass = (status) => {
  switch (normalizeStatus(status)) {
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "refunded":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

const progressSteps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const loadOrders = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setLoadError("");

      const data = await getMyOrders();
      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : [];

      setOrders(orderList);
    } catch (error) {
      console.error("Failed to load orders:", error);

      setLoadError(
        error.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch and background refresh
  useEffect(() => {
    loadOrders(true);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadOrders(false);
      }
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadOrders]);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      setActionError("");
      setSuccessMessage("");

      await cancelOrder(orderId);

      setSuccessMessage("Your order has been cancelled successfully.");
      await loadOrders(false);
    } catch (error) {
      console.error("Cancel order error:", error);

      setActionError(
        error.response?.data?.message ||
          "Could not cancel this order. Please try again."
      );
    } finally {
      setCancellingId("");
    }
  };

  const orderCount = orders.length;

  const totalSpent = orders.reduce((total, order) => {
    if (normalizeStatus(order.orderStatus) === "cancelled") {
      return total;
    }

    return total + (Number(order.totalAmount) || 0);
  }, 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Loading your orders...
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your order history.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* TOP NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {/* PAGE HEADER */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-violet-50">
                <FaBoxOpen />
                TECHREVIVE ACCOUNT
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                Track your purchases, review payment information
                and manage your eligible orders in one place.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 p-4 sm:self-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <FaShoppingBag className="text-2xl" />
              </div>

              <div>
                <p className="text-2xl font-bold">{orderCount}</p>
                <p className="text-xs text-violet-100">
                  {orderCount === 1 ? "Total Order" : "Total Orders"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR / SUCCESS MESSAGES */}
        {loadError && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{loadError}</span>
            <button
              type="button"
              onClick={() => loadOrders(true)}
              className="font-bold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
          >
            <FaCheckCircle className="mr-2 inline" />
            {successMessage}
          </div>
        )}

        {/* SUMMARY CARDS */}
        {orders.length > 0 && (
          <section className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <FaBoxOpen className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Orders
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {orderCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <FaCreditCard className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Order Value
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {money(totalSpent)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Excludes cancelled orders
                </p>
              </div>
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
              <FaBoxOpen className="text-4xl text-violet-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your order history will appear here after
              you complete a purchase. Explore our gadgets
              and find something you love.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaArrowLeft />
                Go Back
              </button>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700"
              >
                <FaShoppingBag />
                Explore Products
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </section>
        ) : (
          /* ORDER LIST */
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Your Order History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest order status and purchase details.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => loadOrders(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
              >
                <FaRedo />
                Refresh Orders
              </button>
            </div>

            {orders.map((order) => {
              const status = String(
                order.orderStatus || "Pending"
              );
              const statusKey = normalizeStatus(status);
              const isCancelled = statusKey === "cancelled";
              const isDelivered = statusKey === "delivered";
              const canCancel = ["pending", "confirmed"].includes(
                statusKey
              );
              const steps = progressSteps;
              const currentStep = steps.findIndex(
                (step) => normalizeStatus(step) === statusKey
              );
              const items = Array.isArray(order.items)
                ? order.items
                : [];
              const orderId = order._id;

              return (
                <article
                  key={orderId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ORDER HEADER */}
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                            <FaBoxOpen />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Order ID
                            </p>
                            <p className="mt-1 break-all text-xs font-semibold text-slate-800 sm:text-sm">
                              {orderId}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <FaCalendarAlt />
                            Order Date
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Order Total
                          </p>
                          <p className="mt-1 text-base font-bold text-violet-700">
                            {money(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-bold ${getOrderStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-bold ${getPaymentClass(
                            order.paymentStatus
                          )}`}
                        >
                          Payment: {order.paymentStatus || "Pending"}
                        </span>

                        {canCancel && (
                          <button
                            type="button"
                            disabled={cancellingId === orderId}
                            onClick={() => handleCancelOrder(orderId)}
                            className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === orderId
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ORDER TRACKING */}
                  {!isCancelled && (
                    <div className="px-4 pt-5 sm:px-6 sm:pt-6">
                      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
                        <div className="mb-5 flex items-center gap-2">
                          <FaTruck className="text-violet-600" />
                          <h3 className="font-bold text-slate-800">
                            Order Tracking
                          </h3>
                        </div>

                        <div className="grid grid-cols-4 gap-1">
                          {steps.map((step, index) => {
                            const reached =
                              currentStep >= 0 &&
                              currentStep >= index;

                            return (
                              <div
                                key={step}
                                className="relative flex min-w-0 flex-col items-center text-center"
                              >
                                {index < steps.length - 1 && (
                                  <div
                                    className={`absolute left-1/2 top-3.5 h-1 w-full ${
                                      currentStep > index
                                        ? "bg-violet-600"
                                        : "bg-slate-200"
                                    }`}
                                  />
                                )}

                                <div
                                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] ${
                                    reached
                                      ? "border-violet-600 bg-violet-600 text-white"
                                      : "border-slate-300 bg-white text-slate-400"
                                  }`}
                                >
                                  {reached ? (
                                    <FaCheckCircle />
                                  ) : (
                                    index + 1
                                  )}
                                </div>

                                <span
                                  className={`mt-3 break-words text-[10px] font-semibold sm:text-xs ${
                                    reached
                                      ? "text-violet-700"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <p className="mt-5 text-xs leading-5 text-slate-600">
                          Current status:{" "}
                          <span className="font-bold text-violet-700">
                            {status}
                          </span>
                          {isDelivered && (
                            <span className="ml-1 text-green-700">
                              — This order is marked as delivered.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CANCELLED NOTICE */}
                  {isCancelled && (
                    <div className="mx-4 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:mx-6">
                      <FaTimesCircle className="mt-0.5 shrink-0 text-xl text-red-600" />
                      <div>
                        <h3 className="font-bold text-red-700">
                          Order Cancelled
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-red-600">
                          This order has been cancelled.
                          Payment or refund status is shown above
                          according to the current order record.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ORDER CONTENT */}
                  <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_290px] sm:p-6">
                    {/* PRODUCTS */}
                    <div className="min-w-0">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          Ordered Products
                        </h3>
                        <span className="text-xs text-slate-500">
                          {items.length}{" "}
                          {items.length === 1 ? "product" : "products"}
                        </span>
                      </div>

                      {isCancelled ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                          Product details are hidden for this cancelled order.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <div
                              key={item._id || item.product || index}
                              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                            >
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                                <img
                                  src={getProductImageUrl(
                                    item.image,
                                    item.name
                                  )}
                                  alt={item.name || "Ordered product"}
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop";
                                  }}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                                  {item.name || "Product"}
                                </h4>
                                <p className="mt-1 text-xs text-slate-500">
                                  Quantity: {item.quantity || 1}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Unit price: {money(item.price)}
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Item Total
                                </p>
                                <p className="mt-1 text-base font-bold text-violet-700">
                                  {money(
                                    (Number(item.price) || 0) *
                                      (Number(item.quantity) || 0)
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PAYMENT AND ADDRESS */}
                    <div className="space-y-4">
                      {!isCancelled && (
                        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4">
                          <div className="flex items-center gap-2">
                            <FaCreditCard className="text-violet-600" />
                            <h3 className="text-sm font-bold text-slate-800">
                              Payment Summary
                            </h3>
                          </div>

                          <p className="mt-4 text-2xl font-bold text-violet-700">
                            {money(order.totalAmount)}
                          </p>

                          <div className="mt-3 space-y-2 border-t border-violet-100 pt-3 text-xs">
                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Method
                              </span>
                              <span className="text-right font-semibold text-slate-700">
                                {order.paymentMethod || "Not specified"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Payment Status
                              </span>
                              <span className="text-right font-semibold text-slate-700">
                                {order.paymentStatus || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SHIPPING ADDRESS */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-violet-600" />
                          <h3 className="text-sm font-bold text-slate-800">
                            Delivery Address
                          </h3>
                        </div>

                        <div className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
                          <p className="font-bold text-slate-800">
                            {order.shippingAddress?.fullName ||
                              "Name not available"}
                          </p>

                          {order.shippingAddress?.street && (
                            <p>{order.shippingAddress.street}</p>
                          )}

                          <p>
                            {[
                              order.shippingAddress?.city,
                              order.shippingAddress?.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location unavailable"}
                          </p>

                          <p>
                            {[
                              order.shippingAddress?.pincode,
                              order.shippingAddress?.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          {order.shippingAddress?.phone && (
                            <p className="pt-1 font-medium text-slate-700">
                              Phone: {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORDER FOOTER */}
                  <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FaShieldAlt className="text-green-600" />
                      Order information recorded in your account.
                    </div>

                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 self-start text-xs font-bold text-violet-700 hover:text-violet-900 sm:self-auto"
                    >
                      Shop More
                      <FaArrowRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700"
          >
            <FaArrowLeft className="text-xs" />
            Back to Previous Page
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            Continue Shopping
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MyOrders;