import React, { useState } from "react";
import "./AdminDashboard.css";
import {
  PiChartLineUp,
  PiListChecksBold,

  PiChartBarBold,
  PiUsersThreeBold,
  PiChartLineDown,
  PiChartLine,
} from "react-icons/pi";
import RadarChartComponent from "../../../components/RadarChartComponent/RadarChartComponent";
import BarChartComponent from "../../../components/BarChartComponent/BarChartComponent";
import StarRatings from "react-star-ratings";
import useAdminStats from "../../../hooks/useAdminStats";
import AnimateText from "@moxy/react-animate-text";

const AdminDashboard = () => {
  const {
    adminStats,
    topCategories,
    totalCategories,
    incomeStats,
    popularProducts,
    recentReviews,
  } = useAdminStats();

  const [showFullReview, setShowFullReview] = useState({
    state: false,
    id: null,
  });

  return (
    <div className="px-4 md:px-0">
      <div className="space-y-1 mb-8">
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--italiana)" }}
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
            <span>Dashboard</span>
          </AnimateText>
        </h1>
        <p className="text-sm text-gray-500">Welcome to your dashboard</p>
      </div>
      {/*----------------- stats ------------------*/}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        <div className="flex justify-between items-start border p-4 rounded-lg w-full shadow">
          <div>
            <h4 className="text-2xl font-bold mb-1">
              ₹
              {parseFloat(
                adminStats?.currentMonthStatsData?.totalSells
              ).toFixed(2)}
            </h4>
            <p className="text-gray-600 text-sm">Total Sells</p>

            <div>
              <div className="mt-6 flex items-center gap-2 w-fit bg-green-100 text-green-600 px-2 py-1 text-sm rounded">
                {adminStats?.lastMonthComparisonPercentage?.totalSellsPercentage
                  ?.direction === "up" ? (
                  <>
                    <span>
                      {parseFloat(
                        adminStats?.lastMonthComparisonPercentage
                          ?.totalSellsPercentage?.percentageValue
                      ).toFixed(2)}
                      %
                    </span>
                    <PiChartLineUp />
                  </>
                ) : (
                  <>
                    {adminStats?.lastMonthComparisonPercentage
                      ?.totalSellsPercentage?.direction !== "no-change" ? (
                      <>
                        <span>
                          {parseFloat(
                            adminStats?.lastMonthComparisonPercentage
                              ?.totalSellsPercentage?.percentageValue
                          ).toFixed(2)}
                          %
                        </span>
                        <PiChartLineDown />
                      </>
                    ) : (
                      <>
                        <span>0</span>
                        <PiChartLine />
                      </>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 pt-1">
                Compared to {adminStats?.lastMonthStatsData?.lastMonth},{" "}
                {adminStats?.lastMonthStatsData?.year}
              </p>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-green-500 font-bold">
              ₹
            </span>
          </div>
        </div>

        {/* ----------------------------------------- */}
        <div className="flex justify-between items-start border p-4 rounded-lg w-full shadow">
          <div>
            <h4 className="text-2xl font-bold mb-1">
              {adminStats?.currentMonthStatsData?.totalOrders}
            </h4>
            <p className="text-gray-600 text-sm">Orders Received</p>

            <div>
              <div className="mt-6 flex items-center gap-2 w-fit bg-purple-100 text-purple-600 px-2 py-1 text-sm rounded">
                {adminStats?.lastMonthComparisonPercentage
                  ?.totalOrdersPercentage?.direction === "up" ? (
                  <>
                    <span>
                      {parseFloat(
                        adminStats?.lastMonthComparisonPercentage
                          ?.totalOrdersPercentage?.percentageValue
                      ).toFixed(2)}
                      %
                    </span>
                    <PiChartLineUp />
                  </>
                ) : (
                  <>
                    {adminStats?.lastMonthComparisonPercentage
                      ?.totalOrdersPercentage?.direction !== "no-change" ? (
                      <>
                        <span>
                          {parseFloat(
                            adminStats?.lastMonthComparisonPercentage
                              ?.totalOrdersPercentage?.percentageValue
                          ).toFixed(2)}
                          %
                        </span>
                        <PiChartLineDown />
                      </>
                    ) : (
                      <>
                        <span>0</span>
                        <PiChartLine />
                      </>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 pt-1">
                Compared to {adminStats?.lastMonthStatsData?.lastMonth},{" "}
                {adminStats?.lastMonthStatsData?.year}
              </p>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-purple-500">
              <PiListChecksBold className="text-2xl" />
            </span>
          </div>
        </div>

        {/* -------------------------------------------- */}
        <div className="flex justify-between items-start border p-4 rounded-lg w-full shadow">
          <div>
            <h4 className="text-2xl font-bold mb-1">
              ₹
              {parseFloat(
                adminStats?.currentMonthStatsData?.averageOrderValue
              ).toFixed(2)}
            </h4>
            <p className="text-gray-600 text-sm">Average Order Value</p>

            <div>
              <div className="mt-6 flex items-center gap-2 w-fit bg-blue-100 text-blue-600 px-2 py-1 text-sm rounded">
                {adminStats?.lastMonthComparisonPercentage
                  ?.averageOrderValuePercentage?.direction === "up" ? (
                  <>
                    <span>
                      {parseFloat(
                        adminStats?.lastMonthComparisonPercentage
                          ?.averageOrderValuePercentage?.percentageValue
                      ).toFixed(2)}
                      %
                    </span>
                    <PiChartLineUp />
                  </>
                ) : (
                  <>
                    {adminStats?.lastMonthComparisonPercentage
                      ?.averageOrderValuePercentage?.direction !==
                    "no-change" ? (
                      <>
                        <span>
                          {parseFloat(
                            adminStats?.lastMonthComparisonPercentage
                              ?.averageOrderValuePercentage?.percentageValue
                          ).toFixed(2)}
                          %
                        </span>
                        <PiChartLineDown />
                      </>
                    ) : (
                      <>
                        <span>0</span>
                        <PiChartLine />
                      </>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 pt-1">
                Compared to {adminStats?.lastMonthStatsData?.lastMonth},{" "}
                {adminStats?.lastMonthStatsData?.year}
              </p>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-blue-500">
              <PiChartBarBold className="text-2xl" />
            </span>
          </div>
        </div>

        {/* --------------------------------------------- */}
        <div className="flex justify-between items-start border p-4 rounded-lg w-full shadow">
          <div>
            <h4 className="text-2xl font-bold mb-1">
              {adminStats?.customerStatsData?.newCustomers}
            </h4>
            <p className="text-gray-600 text-sm">New Customers</p>

            <div>
              <div className="mt-6 flex items-center gap-2 w-fit bg-yellow-100 text-yellow-600 px-2 py-1 text-sm rounded">
                {adminStats?.lastMonthComparisonPercentage?.customersPercentage
                  ?.direction === "up" ? (
                  <>
                    <span>
                      {parseFloat(
                        adminStats?.lastMonthComparisonPercentage
                          ?.customersPercentage?.percentageValue
                      ).toFixed(2)}
                      %
                    </span>
                    <PiChartLineUp />
                  </>
                ) : (
                  <>
                    {adminStats?.lastMonthComparisonPercentage
                      ?.customersPercentage?.direction !== "no-change" ? (
                      <>
                        <span>
                          {parseFloat(
                            adminStats?.lastMonthComparisonPercentage
                              ?.customersPercentage?.percentageValue
                          ).toFixed(2)}
                          %
                        </span>
                        <PiChartLineDown />
                      </>
                    ) : (
                      <>
                        <span>0</span>
                        <PiChartLine />
                      </>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 pt-1">
                Compared to December, 2023
              </p>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-yellow-500">
              <PiUsersThreeBold className="text-2xl" />
            </span>
          </div>
        </div>
      </div>

      <section className="mt-16 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-[35%] h-[450px] border rounded-lg pb-10 shadow">
          <h3 className=" font-semibold text-gray-600 p-4 pb-0">
            Most Selling Categories{" "}
            <span className="text-xs text-gray-400">
              (out of {totalCategories})
            </span>
          </h3>
          <RadarChartComponent data={topCategories} />
        </div>

        <div className="w-full md:w-[65%] h-[450px] border p-4 rounded-lg pb-16 shadow">
          <h3 className=" font-semibold mb-8 text-gray-600">
            Income Statistics{" "}
            <span className="text-xs text-gray-400">(by month)</span>
          </h3>
          <BarChartComponent data={incomeStats} />
        </div>
      </section>

      <section className="flex flex-col md:flex-row md:items-stretch justify-between gap-8 mt-16">
        <div className="border rounded-lg md:w-[55%] shadow">
          <h4 className="font-semibold text-gray-600 border-b-2 p-4">
            Popular Products
          </h4>
          <div className="overflow-x-auto p-4 max-w-[90vw]">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="font-bold text-black border-b border-b-black">
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}

                {popularProducts?.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={product.img}
                              alt={product.name}
                              className="bg-gray-100"
                            />
                          </div>
                        </div>
                        <div>
                          <div>{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.discountPrice || product.price}</td>
                    <td className="font-bold">{product.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border rounded-lg md:w-[45%] shadow">
          <h4 className="font-semibold text-gray-600 border-b-2 p-4">
            Recent Reviews
          </h4>
          <div className="space-y-5 mt-5">
            {recentReviews?.map((reviewObj, idx) => (
              <div
                key={reviewObj._id}
                className={`${
                  idx !== recentReviews.length - 1 && "border-b"
                } pb-5`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center px-4 mb-4">
                  <div className="flex items-center gap-3 w-3/4 md:w-[50%]">
                    <img
                      src={reviewObj.img}
                      alt={reviewObj.name}
                      className="w-[25%] rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium">{reviewObj.name}</h4>
                      <p className="text-sm text-gray-500">
                        {reviewObj.location}
                      </p>
                    </div>
                  </div>

                  <div className="ml-16 md:ml-0">
                    <StarRatings
                      rating={reviewObj.rating}
                      starDimension="20px"
                      starSpacing="4px"
                      starRatedColor="#d4647c"
                      starEmptyColor="#c7c7c7"
                      svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
                      svgIconViewBox="0 0 24 24"
                    />
                  </div>
                </div>

                <div className="px-4">
                  <p className="text-sm text-ellipsis space-x-2">
                    <span>
                      {showFullReview?.state &&
                      showFullReview?.id === reviewObj._id
                        ? reviewObj.review
                        : reviewObj.review.slice(0, 200) + "..."}
                    </span>
                    <button
                      className="text-xs underline text-blue-700"
                      onClick={() =>
                        setShowFullReview({
                          state: !showFullReview?.state,
                          id: reviewObj._id,
                        })
                      }
                    >
                      {showFullReview?.state &&
                      showFullReview?.id === reviewObj._id
                        ? "Show Less"
                        : "Show All"}
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
