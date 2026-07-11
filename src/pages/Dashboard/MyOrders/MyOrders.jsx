import React from "react";
import "./MyOrders.css";
import useOrders from "../../../hooks/useOrders";
import { Link } from "react-router-dom";
import { TfiTrash } from "react-icons/tfi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyOrders = () => {
  const { orders, totalSpent, refetch } = useOrders();
  const [axiosSecure] = useAxiosSecure();

  const handleDeleteOrder = (order) => {
    // date count: no order can be deleted after 7 days of ordering
    const today = new Date();
    const orderDate = new Date(order.date);

    const diffInDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

    if (diffInDays > 7) {
      Swal.fire({
        title: "Too Late",
        text: "No orders can be cancelled after 7 days of ordering.",
        icon: "error",
        confirmButtonColor: "#000",
        confirmButtonText: "Ok, take me back",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        html: `Your order will be cancelled.<br/>Check out our <a href="https://www.google.com" target="_blank" class="underline text-primary">refund policy</a>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#ef4c53",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure
            .delete(`/delete-order/${order._id}`)
            .then((res) => {
              if (res.data.deletedCount > 0) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your order has been deleted successfully",
                  icon: "success",
                });

                refetch();
              }
            })
            .catch((error) => console.error(error));
        }
      });
    }
  };

  return (
    <section className="container">
      <div className="pb-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-semibold">Order History</h1>
        </div>
        <div className="stats shadow mt-6 block md:inline-grid">
          <div className="stat place-items-center">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders?.length}</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-[var(--light-brown)]">
              ${totalSpent}
            </div>
          </div>
        </div>
      </div>

      {!orders?.length ? (
        <h4 className="text-xl text-center mt-10 font-bold">
          No orders found.{" "}
          <Link to={"/shop"} className="text-[var(--light-pink)] underline">
            Browse Products
          </Link>
        </h4>
      ) : (
        <div className="max-w-[90vw] md:max-w-full overflow-auto mt-10">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-black font-bold border-b-2 border-b-black">
                <th>#</th>
                <th>Date</th>
                <th>Product(s)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, idx) => (
                <tr key={order._id} className="order-history-tr">
                  <td>{idx + 1}</td>
                  <td>{order.date.slice(0, 10)}</td>
                  <td className="space-y-2">
                    {order.orderDetails.map((item, idx) => (
                      <p key={item._id}>
                        {item.name}
                        {idx === order.orderDetails.length - 1 ? "" : ","}
                      </p>
                    ))}
                  </td>
                  <td>₹{order.total}</td>
                  <td
                    className={`${
                      order.orderStatus.toLowerCase() === "processing"
                        ? "text-primary"
                        : order.orderStatus.toLowerCase() === "shipped"
                        ? "text-secondary"
                        : order.orderStatus.toLowerCase() === "delivered" &&
                          "text-success"
                    } font-medium`}
                  >
                    {order.orderStatus
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </td>

                  <td>
                    <button
                      className="border rounded-lg p-2 block mx-auto hover:bg-red-500 hover:text-white hover:border-none transition-all duration-100 linear"
                      onClick={() => handleDeleteOrder(order)}
                    >
                      <TfiTrash className="text-xl" />
                    </button>
                  </td>
                  <td>
                    <Link
                      className="underline"
                      to="/order-success"
                      state={{ orderId: order.orderId }}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyOrders;
