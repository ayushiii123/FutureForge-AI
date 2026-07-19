import { useState } from "react";
import { getCart, clearCart } from "../../services/cartService";

import {
  createPayment,
  
  placeOrder,
} from "../../services/orderService";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

 const handlePlaceOrder = async () => {
  try {

    const payment = await createPayment(totalAmount);

    const options = {
      key: payment.key,

      amount: payment.order.amount,

      currency: payment.order.currency,

      name: "TechRevive AI",

      description: "Order Payment",

      order_id: payment.order.id,

      handler: async function (response) {

        

        await placeOrder({
          items: cart.map((item) => ({
            product: item._id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),

          shippingAddress: address,

          totalAmount,

          paymentMethod: "COD",

          paymentStatus: "Pending",
        });

        clearCart();

        alert("Payment Successful");

        navigate("/");
      },

      prefill: {
        name: address.fullName,
        contact: address.phone,
      },

      theme: {
        color: "#5B3DF5",
      },
    };

    const razor = new window.Razorpay(options);

    razor.open();

  } catch (err) {

    console.log(err);

    alert("Payment Failed");

  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <div className="mb-8 rounded-[28px] border-2 border-violet-500 bg-[linear-gradient(135deg,_#f8f3ff_0%,_#ffffff_100%)] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">TechRevive Checkout</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Complete your order securely</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your delivery details and choose the payment option that works best for you.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[24px] border-2 border-violet-500 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Shipping details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              placeholder="Full Name"
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />

            <input
              placeholder="Phone"
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />

            <input
              placeholder="Street"
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 md:col-span-2"
            />

            <input
              placeholder="City"
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />

            <input
              placeholder="State"
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />

            <input
              placeholder="Pincode"
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="rounded-2xl border-2 border-violet-300 bg-violet-50/60 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="rounded-[24px] border-2 border-violet-500 bg-[linear-gradient(135deg,_#ffffff_0%,_#f9f4ff_100%)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>

          <div className="mt-4 space-y-3">
            {cart.length > 0 ? cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-3 shadow-sm">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-800">₹{item.price * item.quantity}</p>
              </div>
            )) : (
              <p className="rounded-2xl bg-white/80 px-3 py-3 text-sm text-slate-500">Your cart is empty.</p>
            )}
          </div>

          <div className="mt-6 space-y-2 border-t border-violet-200 pt-4 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-violet-200 pt-2 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-violet-300 bg-violet-50/70 p-3 text-sm text-slate-600">
            ✔ Secure payments • ✔ Fast delivery • ✔ 12-month warranty coverage
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01]"
          >
            Pay Online
          </button>

          <button
            onClick={handlePlaceOrder}
            className="mt-3 w-full rounded-2xl border border-green-300 bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-green-700"
          >
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;