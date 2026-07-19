import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie
} from "recharts";
const COLORS = [
  "#facc15",
  "#3b82f6",
  "#22c55e",
  "#ef4444",
];
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Users
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            {stats.totalUsers}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Products
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            {stats.totalProducts}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Orders
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            {stats.totalOrders}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Revenue
          </h2>


          <h1 className="text-4xl font-bold mt-3 text-green-600">
            ₹{stats.totalRevenue}
          </h1>
        </div>

      </div>
      <div className="bg-white rounded-xl shadow mt-8 p-6">

  <h2 className="text-2xl font-bold mb-5">
    Monthly Revenue
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >

    <LineChart
      data={stats.monthlySales}
    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="_id.month" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#4F46E5"
        strokeWidth={3}
      />

    </LineChart>

  </ResponsiveContainer>

</div>
<div className="bg-white rounded-xl shadow mt-8 p-6">

  <h2 className="text-2xl font-bold mb-5">
    Order Status
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >

    <PieChart>

      <Pie
        data={stats.orderStatusData}
        dataKey="value"
        nameKey="name"
        outerRadius={120}
      >

        {stats.orderStatusData?.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />
          )
        )}

      </Pie>

      <Legend />

      <Tooltip />

    </PieChart>

  </ResponsiveContainer>

</div>
<div className="bg-white rounded-xl shadow mt-8 p-6">

  <h2 className="text-2xl font-bold mb-5">
    Top Selling Products
  </h2>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="text-left p-3">
          Product
        </th>

        <th>
          Sold
        </th>

        <th>
          Revenue
        </th>

      </tr>

    </thead>

    <tbody>

      {stats.topSellingProducts?.map(
        (item) => (

          <tr
            key={item._id}
            className="border-b"
          >

            <td className="p-3">
              {item._id}
            </td>

            <td className="text-center">
              {item.sold}
            </td>

            <td className="text-center">
              ₹{item.revenue}
            </td>

          </tr>

        )
      )}

    </tbody>

  </table>

</div>
<div className="bg-white rounded-xl shadow mt-8 p-6">

  <h2 className="text-2xl font-bold text-red-600 mb-5">
    ⚠️ Low Stock Products
  </h2>

  {stats.lowStockProducts?.length === 0 ? (

    <p className="text-green-600 font-semibold">
      All Products have sufficient stock.
    </p>

  ) : (

    <table className="w-full">

      <thead>

        <tr className="border-b">

          <th className="text-left p-3">
            Product
          </th>

          <th>
            Price
          </th>

          <th>
            Stock
          </th>

        </tr>

      </thead>

      <tbody>

        {stats.lowStockProducts?.map((item) => (

          <tr
            key={item._id}
            className="border-b"
          >

            <td className="p-3">
              {item.name}
            </td>

            <td className="text-center">
              ₹{item.price}
            </td>

            <td className="text-center text-red-600 font-bold">
              {item.stock}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )}
<div className="bg-white rounded-xl shadow mt-8 p-6">

  <h2 className="text-2xl font-bold mb-5">
    Recent Orders
  </h2>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="p-3 text-left">
          Customer
        </th>

        <th>
          Amount
        </th>

        <th>
          Status
        </th>

      </tr>

    </thead>

    <tbody>

      {stats.recentOrders?.map((order) => (

        <tr
          key={order._id}
          className="border-b"
        >

          <td className="p-3">
            {order.user?.name}
          </td>

          <td className="text-center">
            ₹{order.totalAmount}
          </td>

          <td className="text-center">
            {order.orderStatus}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

  <div className="bg-yellow-100 rounded-xl p-5">
    <h2 className="text-yellow-700 font-bold">
      Pending
    </h2>

    <h1 className="text-3xl font-bold mt-2">
      {stats.pendingOrders}
    </h1>
  </div>

  <div className="bg-blue-100 rounded-xl p-5">
    <h2 className="text-blue-700 font-bold">
      Shipped
    </h2>

    <h1 className="text-3xl font-bold mt-2">
      {stats.shippedOrders}
    </h1>
  </div>

  <div className="bg-green-100 rounded-xl p-5">
    <h2 className="text-green-700 font-bold">
      Delivered
    </h2>

    <h1 className="text-3xl font-bold mt-2">
      {stats.delivered}
    </h1>
  </div>

  <div className="bg-red-100 rounded-xl p-5">
    <h2 className="text-red-700 font-bold">
      Cancelled
    </h2>

    <h1 className="text-3xl font-bold mt-2">
      {stats.cancelled}
    </h1>
  </div>

</div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <h2 className="text-xl font-bold mb-3">
          Database Status
        </h2>

        <p className="text-green-600 font-semibold">
          Connected ✅
        </p>
      </div>

    </div>
  );
};

export default Dashboard;