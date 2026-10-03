
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PromoBillboard from "../../components/common/PromoBillboard";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingBag,
  FaShoppingCart,
  FaTrashAlt,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaBoxOpen,
} from "react-icons/fa";

import {
  getCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../../services/cartService";

import getProductImageUrl from "../../utils/imageUrl";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

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

  const handleDecrease = (id) => {
    decreaseQty(id);
    loadCart();
  };

  const handleIncrease = (id) => {
    increaseQty(id);
    loadCart();
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (!confirmed) return;

    clearCart();
    loadCart();
  };

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
      <PromoBillboard />

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-50">
              <FaBoxOpen className="text-4xl text-violet-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Looks like you haven't added any gadgets yet.
              Explore our collection and find something you love.
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
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">

            {/* LEFT: CART ITEMS */}
            <section className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Shopping Bag
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
                >
                  <FaTrashAlt />
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const itemSubtotal = itemPrice * itemQty;

                  const imageUrl = getProductImageUrl(
                    item.image,
                    item.name
                  );

                  return (
                    <article
                      key={item._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">

                        {/* PRODUCT IMAGE */}
                        <Link
                          to={`/products/${item._id}`}
                          className="flex h-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-3 sm:h-36 sm:w-36"
                        >
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="h-full w-full object-contain transition duration-300 hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop";
                            }}
                          />
                        </Link>

                        {/* PRODUCT INFO */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={`/products/${item._id}`}
                                className="text-base font-bold leading-6 text-slate-900 transition hover:text-violet-700 sm:text-lg"
                              >
                                {item.name}
                              </Link>

                              <p className="mt-1 text-sm text-slate-500">
                                {item.brand || "Gadget"}
                                {item.category
                                  ? ` • ${item.category}`
                                  : ""}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                {item.condition && (
                                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold capitalize text-violet-700">
                                    {item.condition}
                                  </span>
                                )}

                                {Number(item.stock) > 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    In stock
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* UNIT PRICE */}
                            <div className="shrink-0 text-left sm:text-right">
                              <p className="text-lg font-bold text-slate-900">
                                {money(itemPrice)}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                Per unit
                              </p>
                            </div>
                          </div>

                          {/* QUANTITY + SUBTOTAL + REMOVE */}
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
                                <button
                                  type="button"
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  disabled={itemQty <= 1}
                                  onClick={() =>
                                    handleDecrease(item._id)
                                  }
                                  className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <FaMinus className="text-[10px]" />
                                </button>

                                <span
                                  aria-label={`Quantity ${itemQty}`}
                                  className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-2 text-sm font-bold text-slate-800"
                                >
                                  {itemQty}
                                </span>

                                <button
                                  type="button"
                                  aria-label={`Increase quantity of ${item.name}`}
                                  disabled={
                                    Number(item.stock) > 0 &&
                                    itemQty >= Number(item.stock)
                                  }
                                  onClick={() =>
                                    handleIncrease(item._id)
                                  }
                                  className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <FaPlus className="text-[10px]" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemove(item._id)
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 transition hover:text-red-700"
                              >
                                <FaTrashAlt />
                                Remove
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Subtotal
                              </p>
                              <p className="mt-0.5 text-lg font-bold text-violet-700">
                                {money(itemSubtotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* CONTINUE SHOPPING */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                  Want to explore more gadgets?
                </p>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:text-violet-900"
                >
                  <FaArrowLeft className="text-xs" />
                  Continue Shopping
                </Link>
              </div>
            </section>

            {/* RIGHT: ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white p-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Review your order before checkout.
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Items ({totalItems})
                    </span>
                    <span className="font-semibold text-slate-800">
                      {money(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-slate-500">
                      Shipping
                    </span>
                    <span className="text-right font-medium text-slate-600">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Discount
                    </span>
                    <span className="font-medium text-slate-500">
                      Applied if eligible
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-bold text-slate-900">
                        Subtotal
                      </span>
                      <span className="text-2xl font-bold text-violet-700">
                        {money(subtotal)}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      Final payable amount, shipping charges and
                      applicable discounts will be confirmed at checkout.
                    </p>
                  </div>

                  {/* CHECKOUT */}
                  <button
                    type="button"
                    disabled={cart.length === 0}
                    onClick={() => navigate("/checkout")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-100 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Proceed to Checkout
                    <FaArrowRight className="text-xs" />
                  </button>

                  <div className="flex items-start gap-2 rounded-xl bg-green-50 p-3">
                    <FaShieldAlt className="mt-0.5 shrink-0 text-green-600" />
                    <p className="text-xs leading-5 text-green-800">
                      Continue through the store's existing checkout
                      and payment process.
                    </p>
                  </div>
                </div>
              </div>

              {/* SERVICE INFORMATION */}
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <FaTruck className="mt-0.5 text-lg text-violet-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Delivery information
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Check delivery options and estimates during checkout.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                <div className="flex items-start gap-3">
                  <FaShieldAlt className="mt-0.5 text-lg text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Secure checkout
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Review your order details before placing your order.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;