
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [otpStep, setOtpStep] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  // =========================
  // Register
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {

        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
console.log("REGISTER RESPONSE:", res.data);
      if (res.data?.requiresVerification && res.data?.userId) {
        setUserId(res.data.userId);
        setOtpStep(true);
        setSuccess(
          `OTP sent successfully to ${formData.email.trim()}. Please check your inbox.`
        );
      } else {
        alert(res.data?.message || "Registration successful");
        navigate("/login");
      }
    } catch (err) {
      let message = "Registration failed. Please try again.";

      if (
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Network Error")
      ) {
        message =
          "Unable to reach the server. Please make sure the backend is running on port 5000.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Verify OTP
  // =========================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setVerifyLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        userId,
        otp,
      });

      if (res.data?.success) {
        setSuccess("Email verified successfully! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      let message = "OTP verification failed. Please try again.";

      if (
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Network Error")
      ) {
        message =
          "Unable to reach the server. Please make sure the backend is running.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  // =========================
  // Resend OTP
  // =========================
  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setOtp("");
    setResendLoading(true);

    try {
      const res = await api.post("/auth/resend-otp", {
        userId,
      });

      if (res.data?.success) {
        setSuccess(
          "A new OTP has been sent to your email. Please check your inbox."
        );
      }
    } catch (err) {
      let message = "Unable to resend OTP. Please try again.";

      if (
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Network Error")
      ) {
        message =
          "Unable to reach the server. Please make sure the backend is running.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.55),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.35),_transparent_38%),linear-gradient(135deg,_#fdfbff_0%,_#efe7ff_35%,_#f5f3ff_70%,_#eef7ff_100%)] px-4 py-10">
      <div className="absolute -top-16 left-8 h-56 w-56 rounded-full bg-violet-400/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">

        {/* Left Side */}
        <div className="rounded-[32px] border border-[#3b176d] bg-[linear-gradient(135deg,_rgba(255,255,255,0.98)_0%,_rgba(245,235,255,0.95)_100%)] p-8 shadow-[0_30px_90px_rgba(59,23,109,0.24)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#3b176d] font-semibold">
            TechRevive AI
          </p>

          <h1 className="text-4xl font-bold mt-4 text-slate-900">
            {otpStep
              ? "Verify your email"
              : "Create your account and start saving"}
          </h1>

          <p className="text-slate-600 mt-4 leading-7">
            {otpStep
              ? "We have sent a 6-digit verification code to your registered email address."
              : "Buy, sell, exchange, and discover trusted new and refurbished technology with TechRevive AI."}
          </p>

          <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,_#f5ebff_0%,_#eef7ff_100%)] border border-[#3b176d]/20 p-4 text-sm text-slate-700">
            ✦ AI-powered recommendations
            <br />
            ✦ Refurbished quality assurance
            <br />
            ✦ Secure account access
          </div>

          {otpStep && (
            <div className="mt-5 rounded-2xl border border-violet-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-wider text-violet-600 font-semibold">
                Verification Email
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-800">
                {formData.email}
              </p>
            </div>
          )}
        </div>

        {/* Right Side */}
        {!otpStep ? (
          /* =========================
             REGISTER FORM
          ========================= */
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-[28px] border border-[#3b176d] bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f0ff_100%,_#ecfeff_100%)] p-8 shadow-[0_30px_90px_rgba(59,23,109,0.24)] ring-1 ring-violet-300/70"
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">
              Create Account
            </h2>

            <p className="text-center text-sm text-slate-500 mb-8">
              Start your TechRevive journey today
            </p>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-[#3b176d]/20 p-3 rounded-xl mb-4 bg-white focus:border-[#3b176d] focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-[#3b176d]/20 p-3 rounded-xl mb-4 bg-white focus:border-[#3b176d] focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-[#3b176d]/20 p-3 rounded-xl mb-6 bg-white focus:border-[#3b176d] focus:outline-none"
            />

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#3b176d] via-[#5b3df5] to-[#06b6d4] py-3 font-semibold text-white shadow-[0_10px_30px_rgba(91,61,245,0.28)] transition hover:brightness-110 disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center mt-6 text-sm text-slate-600">
              Already have an account?
              <Link
                to="/login"
                className="text-[#3b176d] ml-2 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        ) : (
          /* =========================
             OTP VERIFICATION FORM
          ========================= */
          <form
            onSubmit={handleVerifyOTP}
            className="w-full rounded-[28px] border border-[#3b176d] bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f0ff_100%,_#ecfeff_100%)] p-8 shadow-[0_30px_90px_rgba(59,23,109,0.24)] ring-1 ring-violet-300/70"
          >
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl">
                ✉️
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Verify Email
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter the 6-digit OTP sent to
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-[#3b176d]">
                {formData.email}
              </p>
            </div>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full rounded-xl border border-[#3b176d]/20 bg-white p-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 outline-none focus:border-[#3b176d]"
            />

            <p className="mt-3 text-center text-xs text-slate-500">
              OTP is valid for 5 minutes.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={verifyLoading || otp.length !== 6}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#3b176d] via-[#5b3df5] to-[#06b6d4] py-3 font-semibold text-white shadow-[0_10px_30px_rgba(91,61,245,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyLoading ? "Verifying..." : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="mt-4 w-full rounded-xl border border-[#3b176d]/20 bg-white py-3 font-semibold text-[#3b176d] transition hover:bg-violet-50 disabled:opacity-60"
            >
              {resendLoading ? "Sending OTP..." : "Resend OTP"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Wrong email?
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                  setUserId("");
                  setError("");
                  setSuccess("");
                }}
                className="ml-2 font-semibold text-[#3b176d] hover:underline"
              >
                Go back
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
