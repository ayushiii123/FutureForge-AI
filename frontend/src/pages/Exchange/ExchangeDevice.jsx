
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";

const ExchangeDevice = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    device: "",
    condition: "",
    age: "2",
    battery: 90,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({ sort: "latest" });
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const selectedProduct = useMemo(() => {
    return products.find((product) => product._id === form.device);
  }, [products, form.device]);

  const basePrice = useMemo(() => {
    if (selectedProduct?.price) {
      const numericPrice = Number(
        String(selectedProduct.price).replace(/[^\d.]/g, "")
      );

      if (!Number.isNaN(numericPrice) && numericPrice > 0) {
        return numericPrice;
      }
    }

    return 30000;
  }, [selectedProduct]);

  const estimate = useMemo(() => {
    let conditionMultiplier = 0.35;

    if (form.condition === "excellent") {
      conditionMultiplier = 0.58;
    } else if (form.condition === "good") {
      conditionMultiplier = 0.50;
    } else if (form.condition === "fair") {
      conditionMultiplier = 0.42;
    } else if (form.condition === "poor") {
      conditionMultiplier = 0.30;
    }

    const ageValue = Number(form.age);

    let ageMultiplier = 1;

    if (ageValue === 0) {
      ageMultiplier = 1.08;
    } else if (ageValue === 1) {
      ageMultiplier = 1;
    } else if (ageValue === 2) {
      ageMultiplier = 0.91;
    } else if (ageValue === 3) {
      ageMultiplier = 0.82;
    } else if (ageValue === 4) {
      ageMultiplier = 0.72;
    } else {
      ageMultiplier = 0.62;
    }

    const batteryMultiplier =
      0.88 + Math.min(Math.max(Number(form.battery), 50), 100) * 0.0012;

    let estimatedValue =
      basePrice * conditionMultiplier * ageMultiplier * batteryMultiplier;

    estimatedValue = Math.max(1500, Math.round(estimatedValue / 500) * 500);

    const conditionScore =
      form.condition === "excellent"
        ? 95
        : form.condition === "good"
        ? 85
        : form.condition === "fair"
        ? 72
        : form.condition === "poor"
        ? 58
        : 0;

    const healthScore = Math.round(
      conditionScore * 0.65 + Number(form.battery) * 0.35
    );

    return {
      value: estimatedValue,
      healthScore: form.condition ? Math.min(99, healthScore) : 0,
    };
  }, [basePrice, form.age, form.battery, form.condition]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.device || !form.condition) {
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#26104f] via-[#4c1d95] to-[#0e7490] px-4 py-14 text-white">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
              TechRevive Exchange
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Turn your old device into
              <span className="block text-cyan-200">
                instant upgrade value.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Tell us about your device and get an instant indicative
              exchange value based on condition, age and battery health.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✓ Instant estimate
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✓ Condition based
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                ✓ Battery aware
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Suggested Products */}
        <section className="mb-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
                Upgrade Picks
              </p>

              <h2 className="mt-1 text-3xl font-black text-slate-900">
                Suggested Devices
              </h2>

              <p className="mt-2 text-slate-500">
                Exchange your old device and move to something better.
              </p>
            </div>

            <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              Smart Upgrade
            </div>
          </div>

          {loadingProducts ? (
            <div className="rounded-3xl bg-white py-14 text-center shadow-sm">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl bg-white py-14 text-center shadow-sm">
              <p className="text-slate-500">
                No products available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Exchange Estimator */}
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className="mb-8">
              <div className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
                Instant Value Estimator
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Tell us about your device
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The estimate updates automatically as you change the device
                details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Your Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Device */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Device Model
                </label>

                <select
                  name="device"
                  value={form.device}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  <option value="">Select your device</option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Choose from the available TechRevive device catalog.
                </p>
              </div>

              {/* Condition */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Device Condition
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      value: "excellent",
                      label: "Excellent",
                      desc: "Almost new",
                    },
                    {
                      value: "good",
                      label: "Good",
                      desc: "Minor wear",
                    },
                    {
                      value: "fair",
                      label: "Fair",
                      desc: "Visible wear",
                    },
                    {
                      value: "poor",
                      label: "Poor",
                      desc: "Heavy wear",
                    },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          condition: item.value,
                        }))
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        form.condition === item.value
                          ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                          : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-white"
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Device Age
                </label>

                <select
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  <option value="0">Less than 1 year</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>

              {/* Battery */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Battery Health
                  </label>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                    {form.battery}%
                  </span>
                </div>

                <input
                  type="range"
                  name="battery"
                  min="50"
                  max="100"
                  value={form.battery}
                  onChange={handleChange}
                  className="w-full accent-violet-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-[#3b176d] via-[#5b3df5] to-[#06b6d4] py-4 text-base font-bold text-white shadow-lg shadow-violet-300/30 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Get My Exchange Value
              </button>
            </form>
          </div>

          {/* Estimate Card */}
          <div className="h-fit overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1e1042] via-[#32145f] to-[#075985] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                  Your Estimate
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Exchange Value
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                ₹
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-sm text-white/60">
                Indicative trade-in value
              </p>

              <p className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                {formatPrice(estimate.value)}
              </p>

              {selectedProduct ? (
                <p className="mt-3 text-sm text-cyan-200">
                  Based on {selectedProduct.name}
                </p>
              ) : (
                <p className="mt-3 text-sm text-white/60">
                  Select a device to personalize the estimate.
                </p>
              )}
            </div>

            {/* Score */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    TechRevive Health Score
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    {estimate.healthScore || "--"}
                    <span className="text-base text-white/50">/100</span>
                  </p>
                </div>

                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-8 border-white/10" />

                  <div
                    className="absolute inset-0 rounded-full border-8 border-cyan-300"
                    style={{
                      clipPath: `inset(${
                        100 - Math.max(0, estimate.healthScore)
                      }% 0 0 0)`,
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {estimate.healthScore ? `${estimate.healthScore}%` : "--"}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 transition-all duration-500"
                  style={{
                    width: `${estimate.healthScore}%`,
                  }}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-white/60">Condition</span>
                <span className="text-sm font-bold capitalize">
                  {form.condition || "Not selected"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-white/60">Device age</span>
                <span className="text-sm font-bold">
                  {form.age === "0"
                    ? "< 1 year"
                    : form.age === "5"
                    ? "5+ years"
                    : `${form.age} years`}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-white/60">Battery</span>
                <span className="text-sm font-bold">{form.battery}%</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs leading-5 text-cyan-100">
                This is an indicative estimate. Final exchange value may vary
                after physical inspection and verification of the device.
              </p>
            </div>
          </div>
        </section>

        {/* Success Message */}
        {submitted && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-black text-emerald-800">
                  Exchange request ready!
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Our team can review your device details and confirm the
                  final exchange value.
                </p>
              </div>

              <div className="rounded-2xl bg-white px-5 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Estimated Value
                </p>

                <p className="text-xl font-black text-slate-900">
                  {formatPrice(estimate.value)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trust Strip */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-2xl">🔍</p>
            <h3 className="mt-3 font-bold text-slate-900">
              Transparent Estimate
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your estimate changes with device condition, age and battery
              health.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-2xl">⚡</p>
            <h3 className="mt-3 font-bold text-slate-900">
              Instant Calculation
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              No waiting. Get an indicative value while filling the form.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-2xl">🛡️</p>
            <h3 className="mt-3 font-bold text-slate-900">
              Final Verification
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Final value can be confirmed after device inspection.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExchangeDevice;
