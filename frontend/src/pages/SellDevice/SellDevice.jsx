import { useState } from "react";

const SellDevice = () => {
  const [form, setForm] = useState({ name: "", email: "", device: "", price: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sell request submitted. We'll contact you soon.");
    setForm({ name: "", email: "", device: "", price: "" });
  };

  const benefits = [
    "Free pickup or doorstep evaluation",
    "Instant quote based on device condition",
    "Secure payment and fast processing",
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8f3ff_0%,_#f4ebff_45%,_#ffffff_100%)] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="rounded-[32px] border border-violet-200 bg-white/85 p-8 shadow-[0_18px_70px_rgba(91,61,245,0.14)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-[#5b3df5]">Sell with confidence</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
              Turn your old device into instant cash.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Share your device details and we’ll help you get the best value with a fast, trusted, and hassle-free selling experience.
            </p>

            <div className="mt-6 space-y-3">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5b3df5] text-white">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-violet-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f0ff_100%)] p-8 shadow-[0_18px_70px_rgba(91,61,245,0.14)]"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Request a quote</h2>
              <p className="mt-2 text-sm text-slate-500">Fill in your details and we’ll reach out with a fair offer.</p>
            </div>

            <div className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 outline-none focus:border-[#5b3df5]"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 outline-none focus:border-[#5b3df5]"
              />
              <input
                name="device"
                value={form.device}
                onChange={handleChange}
                placeholder="Device Model"
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 outline-none focus:border-[#5b3df5]"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Expected Price"
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 outline-none focus:border-[#5b3df5]"
              />
            </div>

            <button className="mt-6 w-full rounded-xl bg-[#5b3df5] px-6 py-3 font-semibold text-white transition hover:bg-violet-700">
              Submit Sell Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellDevice;
