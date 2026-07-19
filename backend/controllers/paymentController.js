import razorpay from "../config/razorpay.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // ₹ -> paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
  success: true,
  key: process.env.RAZORPAY_KEY_ID,
  order,
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};