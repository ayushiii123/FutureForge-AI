import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">

      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      <table className="w-full border-collapse">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border">Payment Method</th>
            <th className="p-3 border">Payment Status</th>
            <th className="p-3 border">Order Status</th>
            <th className="p-3 border">Order Date</th>
            <th className="p-3 border">Update</th>
          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order._id} className="text-center border-b">

              <td className="p-3 border">
                {order.user?.name}
              </td>

              <td className="p-3 border">
                ₹{order.totalAmount}
              </td>

              <td className="p-3 border">
                {order.paymentMethod}
              </td>

              <td className="p-3 border">

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm
                  ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.paymentStatus}
                </span>

              </td>

              <td className="p-3 border">

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm
                  ${
                    order.orderStatus === "Delivered"
                      ? "bg-green-600"
                      : order.orderStatus === "Cancelled"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {order.orderStatus}
                </span>

              </td>

              <td className="p-3 border">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 border">

                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatus(order._id, e.target.value)
                  }
                  className="border rounded p-2"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Orders;