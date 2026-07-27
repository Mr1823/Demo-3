import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import useUserInfo from "../../../hooks/useUserInfo";
import Select from "react-select";
import toast from "react-hot-toast";
import { Pagination } from "react-pagination-bar";
import LineChartComponent from "../../../components/LineChartComponent/LineChartComponent";
import useAdminStats from "../../../hooks/useAdminStats";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AnimateText from "@moxy/react-animate-text";

const AdminOrders = () => {
  const location = useLocation();
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { user, isAuthLoading } = useAuthContext();
  const {
    data: allOrders,
    isLoading: isOrdersLoading,
    refetch,
  } = useQuery({
    enabled:
      !isAuthLoading && user !== null && user !== undefined && userFromDB?.admin === true,
    queryKey: ["all-orders"],
    queryFn: async () => {
      const result = await axiosSecure.get("/admin/orders");
      return result.data;
    },
  });

  // Order chart data
  const { incomeStats } = useAdminStats();

  // update order status
  const handleStatusChange = (selectedOption) => {
    axiosSecure
      .patch(`/admin/update-order/${selectedOption.orderId}`, {
        orderStatus: selectedOption.value,
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success("Order status updated successfully");
          refetch();
        }
      })
      .catch((e) => console.error(e));
  };

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 6;

  return (
    <div className="px-4">
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminOrders">Orders</Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-bold text-3xl"
          style={{ fontFamily: "var(--italiana)" }}
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
            <span>Orders</span>
          </AnimateText>
        </h2>
      </div>

      <div className="w-full mx-auto mt-8 mb-10 h-[300px] p-4 pt-6 rounded border shadow">
        <LineChartComponent data={incomeStats} />
      </div>

      <div className="overflow-x-auto mt-8 border shadow p-4 rounded">
        {isOrdersLoading ? (
          <div>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                className="skeleton w-full h-16 my-4 rounded-none"
                key={idx}
              ></div>
            ))}
          </div>
        ) : (
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-black font-bold">
                <th>Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {allOrders
                ?.slice(
                  (currentPage - 1) * pageProductLimit,
                  currentPage * pageProductLimit
                )
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td>{order.date.slice(0, 10)}</td>
                    <td>{order.name}</td>
                    <td>
                      <span
                        className={`text-sm px-2 rounded ${
                          order.paymentStatus.toLowerCase() === "paid"
                            ? "bg-[#c4f89f] text-[#599f2b]"
                            : "bg-[#f98d8daa] text-[#aa2f2f]"
                        }`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>

                      {order.paymentMethod === "cod" ? (
                        <span
                          className={`block mt-1 text-xs px-2 rounded bg-[#f1e4a2] text-[#6a5c10] w-fit`}
                        >
                          Cash On Delivery
                        </span>
                      ) : (
                        <span
                          className={`block mt-1 text-xs px-2 rounded bg-[#a2c7f1] text-[#172664] w-fit`}
                        >
                          {order.transactionId}
                        </span>
                      )}
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            orderId: order._id,
                            value: "PROCESSING",
                            label: "PROCESSING",
                          },
                          {
                            orderId: order._id,
                            value: "SHIPPED",
                            label: "SHIPPED",
                          },
                          {
                            orderId: order._id,
                            value: "DELIVERED",
                            label: "DELIVERED",
                          },
                        ]}
                        defaultValue={{
                          value: order.orderStatus.toUpperCase(),
                          label: order.orderStatus.toUpperCase(),
                        }}
                        onChange={(e) => handleStatusChange(e)}
                        className="w-max md:w-fit"
                      />
                    </td>
                    <td>{order.orderDetails.length}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <Link
                        to={"/order-success"}
                        state={{ from: location, orderId: order._id }}
                        className="underline text-blue-500"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <div>
          <p className="text-xs mt-3">
            Showing {currentPage > 1 ? currentPage - 1 : currentPage}
            {currentPage > 1 && allOrders?.length > 10 && "1"} to{" "}
            {Math.ceil(allOrders?.length / 10) === currentPage
              ? allOrders?.length % 10 !== 0
                ? (currentPage - 1) * 10 + (allOrders?.length % 10)
                : currentPage * 10
              : currentPage * 10}{" "}
            of {allOrders?.length}
          </p>
          <Pagination
            currentPage={currentPage}
            totalItems={allOrders?.length}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            itemsPerPage={pageProductLimit}
            pageNeighbours={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
