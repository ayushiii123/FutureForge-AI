import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
} from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#111827] text-white min-h-screen">

      <h1 className="text-2xl font-bold text-center py-6 border-b border-gray-700">
        TechRevive AI
      </h1>

      <nav className="mt-6 flex flex-col">

        <NavLink
          to="/admin"
          className="px-6 py-4 hover:bg-[#5B3DF5] flex items-center gap-3"
        >
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/add-product"
          className="px-6 py-4 hover:bg-[#5B3DF5] flex items-center gap-3"
        >
          <FaPlus />
          Add Product
        </NavLink>

        <NavLink
          to="/admin/products"
          className="px-6 py-4 hover:bg-[#5B3DF5] flex items-center gap-3"
        >
          <FaBoxOpen />
          Products
        </NavLink>
<NavLink
  to="/admin/orders"
  className="px-6 py-4 hover:bg-[#5B3DF5] flex items-center gap-3"
>
  <FaClipboardList />
  Orders
</NavLink>
      </nav>

    </div>

  );
};

export default Sidebar;