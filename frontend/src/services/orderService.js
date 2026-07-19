import api from "./api";

// User Orders
export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data.orders;
};

// Admin Orders
export const getAllOrders = async () => {
  const res = await api.get("/orders/all");
  return res.data.orders;
};

// Update Order Status
export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}`, {
    status,
  });

  return res.data;
};

// Create Razorpay Order
export const createPayment = async (amount) => {
  const res = await api.post("/payment/create-order", {
    amount,
  });

  return res.data;
};
// Verify Payment
//export const verifyPayment = async (paymentData) => {
  //const res = await api.post(
    //"/orders/verify-payment",
    //paymentData
  //);

 // return res.data;
//};

// Place Order
export const placeOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};