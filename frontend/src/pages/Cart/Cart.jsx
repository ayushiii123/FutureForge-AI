import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart
} from "../../services/cartService";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
const navigate = useNavigate();
  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <div className="mb-8 rounded-[28px] border-2 border-violet-500 bg-[linear-gradient(135deg,_#f8f3ff_0%,_#ffffff_100%)] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">TechRevive Cart</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your curated shopping bag</h1>
        <p className="mt-2 text-sm text-slate-600">Review your selected devices, adjust quantities, and continue securely to checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-[24px] border-2 border-violet-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add a few premium devices and come back here to complete your order.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-[24px] border-2 border-violet-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">Premium device • Fast delivery</p>
                    <p className="mt-2 text-lg font-bold text-[#5b3df5]">₹{item.price}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          decreaseQty(item._id);
                          loadCart();
                        }}
                        className="h-8 w-8 rounded-full border border-violet-300 bg-violet-50 text-lg font-semibold text-violet-700"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center font-semibold text-slate-700">{item.quantity}</span>

                      <button
                        onClick={() => {
                          increaseQty(item._id);
                          loadCart();
                        }}
                        className="h-8 w-8 rounded-full border border-violet-300 bg-violet-50 text-lg font-semibold text-violet-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(item._id);
                    loadCart();
                  }}
                  className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border-2 border-violet-500 bg-[linear-gradient(135deg,_#ffffff_0%,_#f9f4ff_100%)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-violet-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-violet-300 bg-violet-50/70 p-3 text-sm text-slate-600">
              ✔ Secure payments • ✔ 12-month warranty • ✔ Fast delivery
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate("/checkout")}
                className="rounded-2xl bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => {
                  clearCart();
                  loadCart();
                }}
                className="rounded-2xl border border-red-300 bg-red-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Cart;