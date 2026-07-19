import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight, FaRobot } from "react-icons/fa";

const heroImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop",
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.35),_transparent_40%),linear-gradient(135deg,_#f5ebff_0%,_#e9dcff_45%,_#fbf7ff_100%)] py-20">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(109,40,217,0.16),transparent_70%)]" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.8),_transparent_70%)] blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-flex items-center gap-2 bg-white/80 text-[#5b3df5] px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-violet-200 backdrop-blur">
            <FaRobot />
            Verified gadget marketplace
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mt-6 text-slate-900">
            Discover premium gadgets.
            <span className="block bg-gradient-to-r from-[#5b3df5] via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Sell with confidence.
            </span>
          </h1>

          <p className="text-slate-600 text-lg mt-6 max-w-xl">
            Browse the latest arrivals, certified refurbished devices, and seamless trade-in offers — all backed by secure checkout and fast delivery.
          </p>

          <div className="mt-8 bg-[linear-gradient(135deg,_#ffffff_0%,_#f6edff_100%)] shadow-[0_20px_60px_rgba(91,61,245,0.22)] rounded-3xl border-2 border-violet-500 focus-within:border-[#5b3df5] focus-within:ring-4 focus-within:ring-violet-200 overflow-hidden max-w-xl backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3">
              <FaSearch className="text-violet-400" />
              <input
                type="text"
                placeholder="Search gadgets, brands, categories..."
                className="flex-1 text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
              />
              <button className="bg-[#5b3df5] hover:bg-[#4c2fe0] text-white text-sm font-semibold px-5 py-3 rounded-2xl transition duration-200">
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
            <button className="inline-flex items-center justify-center gap-2 bg-[#5b3df5] text-white px-7 py-3 rounded-2xl font-semibold hover:bg-[#4c2fe0] transition shadow-[0_12px_35px_rgba(91,61,245,0.25)]">
              Browse New Arrivals
              <FaArrowRight />
            </button>
            <Link
              to="/refurbished"
              className="inline-flex items-center justify-center gap-2 border border-violet-400 text-slate-700 px-7 py-3 rounded-2xl hover:bg-[#f5ebff] transition"
            >
              Explore Refurbished
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 text-slate-700">
            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">10K+</p>
              <p className="mt-2 text-sm text-slate-500">Devices sold</p>
            </div>
            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">4.9/5</p>
              <p className="mt-2 text-sm text-slate-500">Customer rating</p>
            </div>
            <div className="rounded-3xl bg-[linear-gradient(135deg,_#ffffff_0%,_#f3e8ff_100%)] p-5 text-center shadow-sm border border-violet-200 hover:-translate-y-1 transition-transform">
              <p className="text-3xl font-bold text-[#5b3df5]">12 mo</p>
              <p className="mt-2 text-sm text-slate-500">Warranty coverage</p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute w-80 h-80 bg-violet-300 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/70 border border-violet-300 shadow-md animate-bounce [animation-duration:3s]" />
          <div className="absolute bottom-6 left-4 h-12 w-12 rounded-full bg-violet-200/70 blur-sm animate-pulse [animation-duration:2.5s]" />
          <div className="relative z-10 w-[450px]">
            <div className="absolute top-10 left-8 rounded-2xl border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#5b3df5] shadow-lg backdrop-blur">
              AI-powered picks
            </div>
            <div className="h-[500px] overflow-hidden rounded-[32px] border border-violet-300 shadow-[0_24px_80px_rgba(91,61,245,0.2)] bg-violet-50">
              <img
                key={heroImages[currentImageIndex]}
                src={heroImages[currentImageIndex]}
                alt="featured gadgets"
                className="h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {heroImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === index ? "bg-violet-600 scale-110" : "bg-violet-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;