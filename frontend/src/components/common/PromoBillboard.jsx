import { Link } from "react-router-dom";

const PromoBillboard = () => {
  return (
    <section className="w-full mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 px-6 py-8 md:px-10 md:py-10 text-white shadow-xl">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
              TechRevive AI
            </p>

            <h2 className="text-2xl md:text-4xl font-bold mt-2">
              Smart Devices. Better Value.
            </h2>

            <p className="mt-3 text-indigo-100 text-sm md:text-base leading-relaxed">
              Explore new and refurbished electronics with transparent
              pricing, product comparison, exchange options, and AI-powered
              shopping assistance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/products"
              className="px-5 py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-slate-100 transition"
            >
              Shop Products
            </Link>

            <Link
              to="/refurbished"
              className="px-5 py-3 rounded-xl border border-white/40 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              Explore Refurbished
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBillboard;