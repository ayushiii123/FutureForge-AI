import { useState } from "react";
import {
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaRobot,
} from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt size={32} />,
    title: "1 Year Warranty",
    desc: "All refurbished gadgets come with a hassle-free 12-month warranty.",
    details:
      "If your device has any issue within the first year, we handle repairs or replacement so you can shop with confidence.",
  },
  {
    icon: <FaTruck size={32} />,
    title: "Free Delivery",
    desc: "Fast & secure delivery across India.",
    details:
      "Enjoy free doorstep delivery on every order, with tracking and insured shipping included.",
  },
  {
    icon: <FaUndoAlt size={32} />,
    title: "7 Days Return",
    desc: "Easy replacement & return policy.",
    details:
      "Not satisfied? Return your order within 7 days and get a full refund or replacement without any extra charge.",
  },
  {
    icon: <FaRobot size={32} />,
    title: "AI Recommendation",
    desc: "Smart gadget suggestions tailored to your needs.",
    details:
      "Our AI learns your preferences and recommends the best devices for your budget, usage, and lifestyle.",
  },
];

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];

  return (
    <section className="py-20 bg-[linear-gradient(180deg,_#f8f5ff_0%,_#ffffff_100%)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-500 font-semibold">Why shoppers trust us</p>
          <h2 className="text-4xl font-bold mt-3">
            Why Choose
            <span className="text-[#5b3df5]"> TechRevive AI?</span>
          </h2>
        </div>

        <p className="text-center text-slate-500 mt-3 mb-12">
          Buy smarter with trusted quality and AI-powered experience.
        </p>

        <div className="grid gap-8 lg:grid-cols-4">
          {features.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`text-left rounded-[28px] border p-8 transition shadow-sm hover:shadow-xl focus:outline-none bg-[linear-gradient(135deg,_#ffffff_0%,_#f4ebff_100%)] ${
                activeIndex === index
                  ? "border-violet-400 bg-violet-50 shadow-[0_20px_50px_rgba(91,61,245,0.12)]"
                  : "border-violet-300 bg-[linear-gradient(135deg,_#fcfaff_0%,_#f2e8ff_100%)]"
              }`}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-violet-200 text-[#5b3df5] mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-500">{item.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 rounded-[32px] bg-[linear-gradient(135deg,_#5b3df5_0%,_#6d4df7_100%)] text-white p-10 shadow-[0_24px_70px_rgba(91,61,245,0.24)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-100 font-semibold">
                {activeFeature.title}
              </p>
              <h3 className="mt-4 text-3xl font-bold text-white">
                {activeFeature.title} made simple.
              </h3>
              <p className="mt-4 max-w-2xl text-slate-100">{activeFeature.details}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-6 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-100">Feature active</p>
              <p className="mt-2 text-4xl font-semibold">{activeIndex + 1}/4</p>
              <p className="mt-2 text-sm text-violet-100">Tap each card to switch details.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;