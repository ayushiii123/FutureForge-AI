import Order from "../models/Order.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Create Order
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
}
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// User Orders
export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Admin Orders
export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const transitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!Object.prototype.hasOwnProperty.call(transitions, status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!transitions[order.orderStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be changed from ${order.orderStatus} to ${status}.`,
      });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Cancel Order - User
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled now",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};