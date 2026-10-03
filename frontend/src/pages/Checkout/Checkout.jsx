
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromoBillboard from "../../components/common/PromoBillboard";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaLock,
  FaShoppingBag,
  FaBoxOpen,
} from "react-icons/fa";

import { getCart, clearCart } from "../../services/cartService";
import {
  createPayment,
  verifyRazorpayPayment,
  placeOrder,
} from "../../services/orderService";
import api from "../../services/api";
import getProductImageUrl from "../../utils/imageUrl";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const Checkout = () => {
  const navigate = useNavigate();
  const cart = getCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [addressLoading, setAddressLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [checkoutError, setCheckoutError] = useState("");

  const totalItems = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // Preserve the existing checkout calculation:
  // shipping is currently treated as free.
  const shipping = 0;
  const totalAmount = subtotal + shipping;

  // LOAD SAVED ADDRESS
  useEffect(() => {
    let active = true;

    const loadSavedAddress = async () => {
      try {
        const response = await api.get("/user/profile");
        const savedAddress = response.data?.user?.address;

        if (active && savedAddress?.street) {
          setAddress({
            fullName: savedAddress.fullName || "",
            phone: savedAddress.phone || "",
            street: savedAddress.street || "",
            city: savedAddress.city || "",
            state: savedAddress.state || "",
            pincode: savedAddress.pincode || "",
            country: savedAddress.country || "India",
          });
        }
      } catch (error) {
        console.error(
          "Could not load saved address:",
          error.response?.data?.message || error.message
        );
      } finally {
        if (active) setAddressLoading(false);
      }
    };

    loadSavedAddress();

    return () => {
      active = false;
    };
  }, []);

  const updateAddress = (field, value) => {
    setAddress((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setCheckoutError("");
  };

  // VALIDATE DELIVERY DETAILS
  const validateAddress = () => {
    const errors = {};

    if (!address.fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }

    const normalizedPhone = address.phone
      .trim()
      .replace(/[\s()-]/g, "");

    if (!/^(?:\+91)?[6-9]\d{9}$/.test(normalizedPhone)) {
      errors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!address.street.trim()) {
      errors.street = "Please enter your delivery address.";
    }

    if (!address.city.trim()) {
      errors.city = "Please enter your city.";
    }

    if (!address.state.trim()) {
      errors.state = "Please enter your state.";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit PIN code.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setCheckoutError(
        "Please correct the highlighted delivery details."
      );
      return false;
    }

    setCheckoutError("");
    return true;
  };

  const getOrderItems = () =>
    cart.map((item) => ({
      product: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    }));

  // RAZORPAY ONLINE PAYMENT
  const handleOnlinePayment = async () => {
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!validateAddress()) return;

    setPaymentLoading(true);

    try {
      const payment = await createPayment(
        cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        }))
      );

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is unavailable. Please refresh and try again."
        );
      }

      const options = {
        key: payment.key,
        amount: payment.order.amount,
        currency: payment.order.currency,
        name: "TechRevive AI",
        description: "Order Payment",
        order_id: payment.order.id,

        handler: async (razorpayResponse) => {
          try {
            const result = await verifyRazorpayPayment({
              razorpay_order_id:
                razorpayResponse.razorpay_order_id,
              razorpay_payment_id:
                razorpayResponse.razorpay_payment_id,
              razorpay_signature:
                razorpayResponse.razorpay_signature,

              orderData: {
                items: getOrderItems(),
                shippingAddress: address,
                totalAmount,
              },
            });

            if (!result?.success) {
              throw new Error(
                result?.message ||
                  "Payment verification failed."
              );
            }

            clearCart();
            setPaymentLoading(false);

            alert(
              "Payment verified and order placed successfully!"
            );

            navigate("/");
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            setPaymentLoading(false);

            alert(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed. If money was deducted, please contact support."
            );
          }
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },

        theme: {
          color: "#5B3DF5",
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", (response) => {
        setPaymentLoading(false);

        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razor.open();
    } catch (error) {
      console.error("ONLINE PAYMENT ERROR:", error);
      setPaymentLoading(false);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Online payment could not be started."
      );
    }
  };

  // CASH ON DELIVERY
  const handleCashOnDelivery = async () => {
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!validateAddress()) return;

    setPaymentLoading(true);

    try {
      await placeOrder({
        items: getOrderItems(),
        shippingAddress: address,
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "Pending",
      });

      clearCart();
      setPaymentLoading(false);

      alert("Cash on Delivery order placed successfully.");

      navigate("/");
    } catch (error) {
      console.error("COD ORDER ERROR:", error);
      setPaymentLoading(false);

      alert(
        error.response?.data?.message ||
          "Could not place Cash on Delivery order."
      );
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300"
    }`;

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f6f7fb] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-violet-50"
          >
            <FaArrowLeft />
            Back to Cart
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <FaBoxOpen className="mx-auto text-5xl text-violet-300" />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Add some products to your shopping cart before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              Explore Products
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <FaArrowLeft className="text-xs" />
            Back to Cart
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {/* HEADER */}

{/* ROTATING CHECKOUT BILLBOARD */}
<PromoBillboard
  interval={5500}
  slides={[
    {
      eyebrow: "TECHREVIVE • SECURE CHECKOUT",
      title: "Complete your order securely",
      description:
        "Review your selected gadgets, confirm your delivery details and choose your preferred payment method.",
      buttonText: "Back to Cart",
      buttonLink: "/cart",
      highlight: "Your selected gadgets are ready",
    },
    {
      eyebrow: "TECHREVIVE • DELIVERY",
      title: "Check your delivery details",
      description:
        "Make sure your name, mobile number and delivery address are accurate before placing your order.",
      buttonText: "Review Cart",
      buttonLink: "/cart",
      highlight: "Accurate details for a smooth delivery",
    },
    {
      eyebrow: "TECHREVIVE • MORE TO EXPLORE",
      title: "Looking for another gadget?",
      description:
        "Explore smartphones, laptops, cameras and refurbished devices before completing your purchase.",
      buttonText: "Explore Products",
      buttonLink: "/products",
      highlight: "Discover more devices",
    },
  ]}
/>

{/* CHECKOUT PROGRESS */}
<section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
  <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
    <div className="flex items-center gap-2 text-xs font-bold text-green-700 sm:text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
        ✓
      </span>
      Cart
    </div>

    <div className="h-px flex-1 bg-violet-300" />

    <div className="flex items-center gap-2 text-xs font-bold text-violet-700 sm:text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
        2
      </span>
      Checkout
    </div>

    <div className="h-px flex-1 bg-slate-200" />

    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 sm:text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50">
        3
      </span>
      Complete
    </div>
  </div>
</section>

        {checkoutError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {checkoutError}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">

          {/* LEFT: SHIPPING ADDRESS */}
          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <FaMapMarkerAlt className="text-lg" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Delivery Address
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              {addressLoading && (
                <p className="mb-4 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
                  Loading your saved address...
                </p>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="checkout-fullname"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={address.fullName}
                    onChange={(e) =>
                      updateAddress("fullName", e.target.value)
                    }
                    className={inputClass("fullName")}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    value={address.phone}
                    onChange={(e) =>
                      updateAddress("phone", e.target.value)
                    }
                    className={inputClass("phone")}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* STREET */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-street"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    House / Street / Area{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="checkout-street"
                    rows={3}
                    autoComplete="street-address"
                    placeholder="House number, street, locality..."
                    value={address.street}
                    onChange={(e) =>
                      updateAddress("street", e.target.value)
                    }
                    className={`${inputClass("street")} resize-y`}
                    aria-invalid={Boolean(fieldErrors.street)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.street && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.street}
                    </p>
                  )}
                </div>

                {/* CITY */}
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Enter city"
                    value={address.city}
                    onChange={(e) =>
                      updateAddress("city", e.target.value)
                    }
                    className={inputClass("city")}
                    aria-invalid={Boolean(fieldErrors.city)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.city && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                {/* STATE */}
                <div>
                  <label
                    htmlFor="checkout-state"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-state"
                    type="text"
                    autoComplete="address-level1"
                    placeholder="Enter state"
                    value={address.state}
                    onChange={(e) =>
                      updateAddress("state", e.target.value)
                    }
                    className={inputClass("state")}
                    aria-invalid={Boolean(fieldErrors.state)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.state && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.state}
                    </p>
                  )}
                </div>

                {/* PINCODE */}
                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    placeholder="6-digit PIN code"
                    value={address.pincode}
                    onChange={(e) =>
                      updateAddress(
                        "pincode",
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className={inputClass("pincode")}
                    aria-invalid={Boolean(fieldErrors.pincode)}
                    disabled={paymentLoading}
                  />
                  {fieldErrors.pincode && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.pincode}
                    </p>
                  )}
                </div>

                {/* COUNTRY */}
                <div>
                  <label
                    htmlFor="checkout-country"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Country
                  </label>
                  <input
                    id="checkout-country"
                    type="text"
                    value={address.country}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600"
                  />
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Fields marked with <span className="text-red-500">*</span>{" "}
                are required. Your saved profile address, when available,
                is prefilled for convenience.
              </p>
            </section>

            {/* PAYMENT METHOD */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <FaCreditCard className="text-lg" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Method
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose how you would like to pay.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex h-full flex-col rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
                      <FaCreditCard className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Online Payment
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Razorpay checkout
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-xs leading-5 text-slate-600">
                    Continue to the existing payment gateway to
                    complete your online payment.
                  </p>
                </div>

                <div className="flex h-full flex-col rounded-xl border border-green-200 bg-green-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                      <FaMoneyBillWave className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Cash on Delivery
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Pay as supported by the store
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-xs leading-5 text-slate-600">
                    Place your COD order using the existing order
                    placement process.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white p-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review your items before placing your order.
                </p>
              </div>

              {/* ORDER ITEMS */}
              <div className="max-h-[360px] space-y-4 overflow-y-auto p-5">
                {cart.map((item) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 0;

                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1.5">
                        <img
                          src={getProductImageUrl(
                            item.image,
                            item.name
                          )}
                          alt={item.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop";
                          }}
                        />
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                          {itemQty}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {itemQty}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-slate-800">
                        {money(itemPrice * itemQty)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="border-t border-slate-100 px-5 py-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Items ({totalItems})
                    </span>
                    <span className="font-semibold text-slate-800">
                      {money(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Shipping
                    </span>
                    <span className="font-semibold text-green-700">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-bold text-slate-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-violet-700">
                        {money(totalAmount)}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      Any additional applicable charges or adjustments
                      must be confirmed before payment.
                    </p>
                  </div>
                </div>

                {/* CHECKOUT ERROR / NOTICE */}
                {checkoutError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                  >
                    {checkoutError}
                  </div>
                )}

                {/* PLACE ORDER ACTIONS */}
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleOnlinePayment}
                    disabled={paymentLoading || cart.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-100 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <FaLock />
                    {paymentLoading
                      ? "Processing..."
                      : "Pay Online"}
                    {!paymentLoading && (
                      <FaArrowRight className="text-xs" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCashOnDelivery}
                    disabled={paymentLoading || cart.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-300 bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <FaMoneyBillWave />
                    {paymentLoading
                      ? "Processing..."
                      : "Cash on Delivery"}
                  </button>
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3">
                  <FaShieldAlt className="mt-0.5 shrink-0 text-green-700" />
                  <p className="text-xs leading-5 text-green-800">
                    Payments and orders are processed through the
                    store's existing checkout services.
                  </p>
                </div>
              </div>
            </section>

            {/* SUPPORT INFORMATION */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <FaTruck className="mt-0.5 text-lg text-violet-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Delivery information
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Available delivery options and estimated dates
                    can be reviewed during checkout.
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="flex items-start gap-3">
                <FaCheckCircle className="mt-0.5 text-lg text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Order review
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Confirm your delivery details and order total
                    before completing the purchase.
                  </p>
                </div>
              </div>
            </div>

            {/* BACK TO CART */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              disabled={paymentLoading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaArrowLeft className="text-xs" />
              Back to Cart
            </button>
          </aside>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            disabled={paymentLoading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700 disabled:opacity-50"
          >
            <FaArrowLeft className="text-xs" />
            Return to Shopping Cart
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            Browse More Products
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
