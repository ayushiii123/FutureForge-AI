import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-500">
            No Orders Found
          </h2>
          <p className="text-gray-400 mt-2">
            You haven't placed any orders yet.
          </p>
        </div>

      ) : (

        orders.map((order) => (

          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-6 mb-8 border"
          >

            <div className="flex flex-col md:flex-row md:justify-between gap-4">

              <div>

                <h2 className="font-bold text-lg">
                  Order ID
                </h2>

                <p className="text-gray-500 break-all">
                  {order._id}
                </p>

                <p className="mt-2 text-gray-600">
                  Date :
                  {" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>

              <div className="text-left md:text-right">

                <h2 className="text-2xl font-bold text-indigo-600">
                  ₹{order.totalAmount}
                </h2>

                <p className="mt-2">
                  <strong>Payment :</strong>{" "}
                  {order.paymentMethod}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.paymentStatus}
                </span>

                <br />

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm ${
                    order.orderStatus === "Delivered"
                      ? "bg-green-600"
                      : order.orderStatus === "Cancelled"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {order.orderStatus}
                </span>

              </div>

            </div>

            <hr className="my-6" />

            <h3 className="font-bold mb-4">
              Ordered Products
            </h3>

            {order.items.map((item) => (

              <div
                key={item.product}
                className="flex items-center gap-5 mb-5 border-b pb-4"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                <div>

                  <h2 className="font-bold text-lg">
                    {item.name}
                  </h2>

                  <p className="text-gray-600">
                    Price : ₹{item.price}
                  </p>

                  <p className="text-gray-600">
                    Quantity : {item.quantity}
                  </p>

                </div>

              </div>

            ))}

            <div className="mt-5 bg-gray-50 rounded-lg p-4">

              <h3 className="font-bold mb-2">
                Shipping Address
              </h3>

              <p>
                {order.shippingAddress.fullName}
              </p>

              <p>
                {order.shippingAddress.street}
              </p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                {order.shippingAddress.pincode},{" "}
                {order.shippingAddress.country}
              </p>

              <p>
                Phone : {order.shippingAddress.phone}
              </p>

            </div>

          </div>

        ))

      )}

    </div>
  );
};

export default MyOrders;