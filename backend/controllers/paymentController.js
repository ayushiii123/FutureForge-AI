import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
// Create Razorpay Order with server-verified products
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or invalid.",
      });
    }

    // Validate product IDs and quantities
    const seen = new Set();

    for (const item of items) {
      if (
        !mongoose.Types.ObjectId.isValid(item?.product) ||
        !Number.isInteger(item?.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity.",
        });
      }

      const id = String(item.product).toLowerCase();

      if (seen.has(id)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate products in cart.",
        });
      }

      seen.add(id);
    }

    // Fetch actual products from database
    const products = await Product.find({
      _id: {
        $in: items.map((item) => item.product),
      },
    });

    if (products.length !== items.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products were not found.",
      });
    }

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    let totalPaise = 0;

    for (const item of items) {
      const product = productMap.get(
        String(item.product).toLowerCase()
      );

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.name || "a product"}.`,
        });
      }

      if (
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price.",
        });
      }

      totalPaise +=
        Math.round(product.price * 100) * item.quantity;
    }

    if (!Number.isSafeInteger(totalPaise) || totalPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    // Fingerprint the selected products and quantities
    const normalizedItems = items
      .map((item) => ({
        product: String(item.product).toLowerCase(),
        quantity: item.quantity,
      }))
      .sort((a, b) =>
        a.product.localeCompare(b.product)
      );

    const cartHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(normalizedItems))
      .digest("hex");

    // Create Razorpay order using database-calculated amount
    const order = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(req.user.id),
        cartHash,
      },
    });

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create payment order.",
    });
  }
};
// Verify Razorpay Payment and Create Order
// Verify Razorpay Payment and Create Order
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderData ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0 ||
      !orderData.shippingAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid payment details.",
      });
    }

    // Validate items and prevent duplicate product entries
    const seen = new Set();

    for (const item of orderData.items) {
      if (
        !mongoose.Types.ObjectId.isValid(item?.product) ||
        !Number.isInteger(item?.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity.",
        });
      }

      const id = String(item.product).toLowerCase();

      if (seen.has(id)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate products in order.",
        });
      }

      seen.add(id);
    }

    // Recreate the cart fingerprint from submitted product IDs and quantities
    const normalizedItems = orderData.items
      .map((item) => ({
        product: String(item.product).toLowerCase(),
        quantity: item.quantity,
      }))
      .sort((a, b) => a.product.localeCompare(b.product));

    const cartHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(normalizedItems))
      .digest("hex");

    // Verify the Razorpay payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (
      !/^[a-f0-9]{64}$/i.test(razorpay_signature) ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Fetch authoritative payment and Razorpay order details
    const [payment, razorpayOrder] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ]);

    // Confirm this payment belongs to this user and cart
    if (
      String(razorpayOrder.notes?.userId) !== String(req.user.id) ||
      razorpayOrder.notes?.cartHash !== cartHash
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match this user or cart.",
      });
    }

    // Fetch current database product details
    const products = await Product.find({
      _id: {
        $in: orderData.items.map((item) => item.product),
      },
    });

    if (products.length !== orderData.items.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are unavailable.",
      });
    }

    const productMap = new Map(
      products.map((product) => [
        product._id.toString().toLowerCase(),
        product,
      ])
    );

    let totalPaise = 0;
    const verifiedItems = [];

    for (const item of orderData.items) {
      const product = productMap.get(
        String(item.product).toLowerCase()
      );

      if (
        !product ||
        !Number.isInteger(product.stock) ||
        product.stock < item.quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.name || "a product"}.`,
        });
      }

      if (
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price.",
        });
      }

      const pricePaise = Math.round(product.price * 100);
      totalPaise += pricePaise * item.quantity;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    if (!Number.isSafeInteger(totalPaise) || totalPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    // Verify captured payment and exact amount
    if (
      payment.status !== "captured" ||
      payment.order_id !== razorpay_order_id ||
      payment.currency !== "INR" ||
      razorpayOrder.currency !== "INR" ||
      payment.amount !== totalPaise ||
      razorpayOrder.amount !== totalPaise
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details could not be verified.",
      });
    }

    // Prevent creating a duplicate order for the same payment
    const existingOrder = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      if (String(existingOrder.user) !== String(req.user.id)) {
        return res.status(409).json({
          success: false,
          message: "Payment is already associated with another order.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order already exists.",
        order: existingOrder,
      });
    }

    // Create order using verified database information
    const order = await Order.create({
      user: req.user.id,
      items: verifiedItems,
      shippingAddress: orderData.shippingAddress,
      totalAmount: totalPaise / 100,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      orderStatus: "Pending",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};