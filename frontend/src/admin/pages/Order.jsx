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
                  onChange={(e) =>
                    changeStatus(
                      order._id,
                      e.target.value
                    )
                  }
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Confirmed
                  </option>

                  <option>
                    Shipped
                  </option>

                  <option>
                    Delivered
                  </option>

                  <option>
                    Cancelled
                  </option>

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