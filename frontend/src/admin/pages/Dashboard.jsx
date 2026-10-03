import { useEffect, useState } from "react";
import { getDashboardStats ,getSalesReport} from "../../services/dashboardService";
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
  Pie,
  Cell,
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
const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 6);

const [reportFrom, setReportFrom] = useState(
  () => toDateInputValue(weekAgo)
);
const [reportTo, setReportTo] = useState(
  () => toDateInputValue(today)
);
const [salesReport, setSalesReport] = useState(null);
const [reportLoading, setReportLoading] = useState(false);
const [reportError, setReportError] = useState("");
  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };
const handleGenerateReport = async () => {
  if (!reportFrom || !reportTo) {
    setReportError("Please select both dates.");
    return;
  }

  if (reportFrom > reportTo) {
    setReportError("From date cannot be after To date.");
    return;
  }

  try {
    setReportLoading(true);
    setReportError("");

    const data = await getSalesReport(reportFrom, reportTo);
    setSalesReport(data);
  } catch (error) {
    setSalesReport(null);
    setReportError(
      error.response?.data?.message ||
        "Failed to generate sales report."
    );
  } finally {
    setReportLoading(false);
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

{/* DATE-WISE SALES REPORT */}
<div className="bg-white rounded-xl shadow mt-8 p-6">
  <h2 className="text-2xl font-bold mb-2">
    Date-wise Sales Report
  </h2>

  <p className="text-sm text-gray-500 mb-6">
    Select a date range to view delivered orders and revenue.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
    <div>
      <label
        htmlFor="reportFrom"
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        From Date
      </label>
      <input
        id="reportFrom"
        type="date"
        value={reportFrom}
        max={reportTo}
        onChange={(e) => setReportFrom(e.target.value)}
        className="w-full border border-slate-300 rounded-lg p-3 focus:border-violet-500 focus:outline-none"
      />
    </div>

    <div>
      <label
        htmlFor="reportTo"
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        To Date
      </label>
      <input
        id="reportTo"
        type="date"
        value={reportTo}
        min={reportFrom}
        onChange={(e) => setReportTo(e.target.value)}
        className="w-full border border-slate-300 rounded-lg p-3 focus:border-violet-500 focus:outline-none"
      />
    </div>

    <button
      type="button"
      onClick={handleGenerateReport}
      disabled={reportLoading}
      className="w-full rounded-lg bg-[#5b3df5] px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition"
    >
      {reportLoading ? "Generating..." : "Generate Report"}
    </button>
  </div>

  {reportError && (
    <div
      role="alert"
      className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      {reportError}
    </div>
  )}

  {salesReport && (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm font-medium text-green-700">
            Total Revenue
          </p>
          <h3 className="mt-2 text-3xl font-bold text-green-800">
            ₹{Number(salesReport.totalRevenue || 0).toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-sm font-medium text-violet-700">
            Delivered Orders
          </p>
          <h3 className="mt-2 text-3xl font-bold text-violet-800">
            {salesReport.totalOrders || 0}
          </h3>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">
        Daily Sales Breakdown
      </h3>

      {salesReport.dailySales?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Delivered Orders</th>
                <th className="p-3 text-right">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {salesReport.dailySales.map((day) => (
                <tr
                  key={day._id}
                  className="border-b hover:bg-violet-50"
                >
                  <td className="p-3">{day._id}</td>
                  <td className="p-3 text-center">{day.orders}</td>
                  <td className="p-3 text-right font-semibold text-green-700">
                    ₹{Number(day.revenue || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
          No delivered sales found for this date range.
        </div>
      )}
    </div>
  )}
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
