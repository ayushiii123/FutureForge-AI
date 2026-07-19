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
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}