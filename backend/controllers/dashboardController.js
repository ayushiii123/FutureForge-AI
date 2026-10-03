import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const delivered = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelled = await Order.countDocuments({
      orderStatus: "Cancelled",
    });
const monthlySales = await Order.aggregate([
  {
    $match: {
      orderStatus: "Delivered",
    },
  },
  {
    $group: {
      _id: {
        month: {
          $month: "$createdAt",
        },
      },
      revenue: {
        $sum: "$totalAmount",
      },
    },
  },
  {
    $sort: {
      "_id.month": 1,
    },
  },
]);
const topSellingProducts = await Order.aggregate([
  { $unwind: "$items" },

  {
    $group: {
      _id: "$items.name",
      sold: {
        $sum: "$items.quantity",
      },
      revenue: {
        $sum: {
          $multiply: [
            "$items.quantity",
            "$items.price",
          ],
        },
      },
    },
  },

  {
    $sort: {
      sold: -1,
    },
  },

  {
    $limit: 5,
  },
]);
const lowStockProducts = await Product.find({
  stock: { $lte: 5 },
})
.select("name stock price image")
.sort({ stock: 1 });
const recentOrders = await Order.find()
  .populate("user", "name")
  .sort({ createdAt: -1 })
  .limit(5);

const orderStatusData = [
  {
    name: "Pending",
    value: pendingOrders,
  },
  {
    name: "Shipped",
    value: shippedOrders,
  },
  {
    name: "Delivered",
    value: delivered,
  },
  {
    name: "Cancelled",
    value: cancelled,
  },
];
   res.status(200).json({
  success: true,
  stats: {
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingOrders,
    shippedOrders,
    delivered,
    cancelled,
    monthlySales,
    orderStatusData,
    topSellingProducts,
    lowStockProducts,
    recentOrders,
  },
});
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}

// Date-wise Sales Report
export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate date format and actual calendar dates
    const isValidDate = (value) => {
      if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
      ) {
        return false;
      }

      const date = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (!isValidDate(from) || !isValidDate(to)) {
      return res.status(400).json({
        success: false,
        message: "Valid from and to dates are required (YYYY-MM-DD).",
      });
    }

    if (from > to) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date.",
      });
    }

    // Use Indian Standard Time (IST) for report dates
    const startDate = new Date(`${from}T00:00:00+05:30`);
    const endExclusive = new Date(
      new Date(`${to}T00:00:00+05:30`).getTime() +
        24 * 60 * 60 * 1000
    );

    const dailySales = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: {
            $gte: startDate,
            $lt: endExclusive,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalOrders = dailySales.reduce(
      (sum, day) => sum + day.orders,
      0
    );

    const totalRevenue = dailySales.reduce(
      (sum, day) => sum + day.revenue,
      0
    );

    return res.status(200).json({
      success: true,
      report: {
        from,
        to,
        totalOrders,
        totalRevenue,
        dailySales,
      },
    });
  } catch (error) {
    console.error("SALES REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not generate sales report.",
    });
  }
};