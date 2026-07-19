import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      alert("Login Successful");
      navigate(res.data.user.role === "admin" ? "/admin" : "/home", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.55),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.35),_transparent_38%),linear-gradient(135deg,_#fdfbff_0%,_#efe7ff_35%,_#f5f3ff_70%,_#eef7ff_100%)] px-4 py-10">
      <div className="absolute -top-16 left-8 h-56 w-56 rounded-full bg-violet-400/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-[#3b176d] bg-[linear-gradient(135deg,_rgba(255,255,255,0.98)_0%,_rgba(245,235,255,0.95)_100%)] p-8 shadow-[0_30px_90px_rgba(59,23,109,0.24)] backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3b176d]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#3b176d] shadow-sm">
            <span className="text-lg">✨</span>
            TechRevive AI
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-5xl">
            Welcome back to your premium refurbished tech experience
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Sign in to explore verified devices, manage your wishlist, and shop with confidence through a luxury tech experience.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Secure Checkout", icon: "🔒" },
              { title: "Verified Devices", icon: "✅" },
              { title: "Fast Delivery", icon: "🚚" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-violet-200 bg-white/80 p-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                <div className="text-2xl">{item.icon}</div>
                <p className="mt-2">{item.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Phone", emoji: "📱", className: "animate-[float_3s_ease-in-out_infinite]" },
              { label: "Watch", emoji: "⌚", className: "animate-[float_3.4s_ease-in-out_infinite]" },
              { label: "Laptop", emoji: "💻", className: "animate-[float_2.8s_ease-in-out_infinite]" },
              { label: "Headphones", emoji: "🎧", className: "animate-[float_3.2s_ease-in-out_infinite]" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border border-violet-200 bg-white/80 p-3 text-center shadow-sm backdrop-blur ${item.className}`}
              >
                <div className="text-3xl">{item.emoji}</div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3b176d]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[28px] border border-[#3b176d] bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f0ff_100%,_#ecfeff_100%)] p-8 shadow-[0_30px_90px_rgba(59,23,109,0.24)] ring-1 ring-violet-300/70"
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Login</h2>
          <p className="text-center text-sm text-slate-500 mb-8">Access your account and continue shopping</p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-[#3b176d]/20 p-3 rounded-xl mb-5 bg-white focus:border-[#3b176d] focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-[#3b176d]/20 p-3 rounded-xl mb-5 bg-white focus:border-[#3b176d] focus:outline-none"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#3b176d] via-[#5b3df5] to-[#06b6d4] py-3 font-semibold text-white shadow-[0_10px_30px_rgba(91,61,245,0.28)] transition hover:brightness-110"
          >
            Login
          </button>

          <p className="text-center mt-6 text-sm text-slate-600">
            New here?{' '}
            <Link to="/register" className="text-[#3b176d] font-semibold">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;