import {
  FaMobileAlt,
  FaLaptop,
  FaTabletAlt,
  FaHeadphones,
  FaClock,
  FaCamera,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Smartphones",
    icon: <FaMobileAlt size={40} />,
    color: "bg-purple-100",
  },
  {
    title: "Laptops",
    icon: <FaLaptop size={40} />,
    color: "bg-blue-100",
  },
  {
    title: "Tablets",
    icon: <FaTabletAlt size={40} />,
    color: "bg-pink-100",
  },
  {
    title: "Smart Watches",
    icon: <FaClock size={40} />,
    color: "bg-green-100",
  },
  {
    title: "Headphones",
    icon: <FaHeadphones size={40} />,
    color: "bg-yellow-100",
  },
  {
    title: "Cameras",
    icon: <FaCamera size={40} />,
    color: "bg-red-100",
  },
];

const CategorySection = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <div className="rounded-[32px] border border-violet-300 bg-[linear-gradient(135deg,_#f4ebff_0%,_#ede1ff_100%)] p-8 md:p-10 shadow-[0_15px_45px_rgba(91,61,245,0.12)] mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-500 font-semibold">Curated collections</p>
          <h2 className="text-4xl font-bold mt-2">
            Shop By <span className="text-[#5B3DF5]">Category</span>
          </h2>
          <p className="text-slate-500 mt-2">
            Explore your favourite gadgets in a polished, premium shopping experience.
          </p>
        </div>

          <Link to="/products" className="inline-flex items-center text-[#5B3DF5] font-semibold hover:gap-2 transition-all">
            View All →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((item, index) => (
          <Link
            key={index}
            to={`/products?category=${encodeURIComponent(item.title)}`}
            className="group bg-[linear-gradient(135deg,_#ffffff_0%,_#f8f2ff_100%)] rounded-[24px] border border-violet-300 shadow-sm hover:shadow-[0_20px_50px_rgba(91,61,245,0.16)] transition duration-300 p-6 text-center cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div
              className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto text-[#5B3DF5] group-hover:scale-110 group-hover:rotate-6 transition`}
            >
              {item.icon}
            </div>

            <h3 className="mt-5 font-semibold text-lg text-slate-800">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;