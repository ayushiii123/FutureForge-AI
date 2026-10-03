import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

const Orders = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {

    const data = await getAllOrders();

    setOrders(data);

  };

  const changeStatus = async (
    id,
    status
  ) => {

    await updateOrderStatus(
      id,
      status
    );

    loadOrders();

  };

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Manage Orders
      </h1>

      <table className="w-full">

        <thead>

          <tr>

            <th>User</th>

            <th>Total</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order._id}
              className="border-b"
            >

              <td>
                {order.user.name}
              </td>

              <td>
                ₹{order.totalAmount}
              </td>

              <td>
                {order.orderStatus}
              </td>

              <td>

              <select
  value={order.orderStatus}
  disabled={["Delivered", "Cancelled"].includes(order.orderStatus)}
  onChange={(e) =>
    changeStatus(order._id, e.target.value)
  }
  className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
>
  {(
    {
      Pending: ["Pending", "Confirmed", "Cancelled"],
      Confirmed: ["Confirmed", "Shipped", "Cancelled"],
      Shipped: ["Shipped", "Delivered"],
      Delivered: ["Delivered"],
      Cancelled: ["Cancelled"],
    }[order.orderStatus] || [order.orderStatus]
  ).map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
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