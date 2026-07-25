import React, { useState } from "react";
import RadarChartComponent from "../../../components/RadarChartComponent/RadarChartComponent";
import BarChartComponent from "../../../components/BarChartComponent/BarChartComponent";
import StarRatings from "react-star-ratings";
import useAdminStats from "../../../hooks/useAdminStats";

const StatCard = ({ title, value, icon, changeData, subtitle }) => {
  const direction = changeData?.direction;
  const percentage = parseFloat(changeData?.percentageValue || 0).toFixed(1);

  return (
    <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/50 flex flex-col justify-between hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <span className="text-on-surface-variant font-medium text-sm">{title}</span>
        <span className="material-symbols-outlined text-primary-container">{icon}</span>
      </div>
      <div>
        <p className="text-3xl text-on-surface" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {value}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {direction === "up" ? (
            <span className="text-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              {percentage}%
            </span>
          ) : direction === "down" ? (
            <span className="text-sm text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              {percentage}%
            </span>
          ) : (
            <span className="text-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_flat</span>
              No change
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

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

  const lastMonth = adminStats?.lastMonthStatsData?.lastMonth;
  const lastYear = adminStats?.lastMonthStatsData?.year;
  const comparisonText = lastMonth ? `vs ${lastMonth}, ${lastYear}` : "";

  return (
    <div className="px-4 md:px-0 font-body-base">
      {/* Header */}
      <div className="mb-10 border-b border-outline-variant/30 pb-6">
        <h1 className="text-primary text-3xl md:text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Dashboard Overview
        </h1>
        <p className="text-on-surface-variant text-sm">
          Welcome back. Here's your store performance at a glance.
        </p>
      </div>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`₹${parseFloat(adminStats?.currentMonthStatsData?.totalSells || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="payments"
          changeData={adminStats?.lastMonthComparisonPercentage?.totalSellsPercentage}
          subtitle={comparisonText}
        />
        <StatCard
          title="Orders Received"
          value={adminStats?.currentMonthStatsData?.totalOrders || 0}
          icon="shopping_cart"
          changeData={adminStats?.lastMonthComparisonPercentage?.totalOrdersPercentage}
          subtitle={comparisonText}
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${parseFloat(adminStats?.currentMonthStatsData?.averageOrderValue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="bar_chart"
          changeData={adminStats?.lastMonthComparisonPercentage?.averageOrderValuePercentage}
          subtitle={comparisonText}
        />
        <StatCard
          title="New Customers"
          value={adminStats?.customerStatsData?.newCustomers || 0}
          icon="group"
          changeData={adminStats?.lastMonthComparisonPercentage?.customersPercentage}
          subtitle={comparisonText}
        />
      </section>

      {/* Charts */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-5 border border-outline-variant/30 rounded-lg bg-surface-container-lowest overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30">
            <h3 className="text-on-surface text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Top Categories
            </h3>
            <p className="text-on-surface-variant text-xs mt-1">
              out of {totalCategories} categories
            </p>
          </div>
          <div className="h-[380px] pb-8">
            <RadarChartComponent data={topCategories} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-7 border border-outline-variant/30 rounded-lg bg-surface-container-lowest overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30">
            <h3 className="text-on-surface text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Income Statistics
            </h3>
            <p className="text-on-surface-variant text-xs mt-1">
              Monthly revenue breakdown
            </p>
          </div>
          <div className="h-[380px] p-4 pb-12">
            <BarChartComponent data={incomeStats} />
          </div>
        </div>
      </section>

      {/* Popular Products & Reviews */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">

        {/* Popular Products */}
        <div className="lg:col-span-7 border border-outline-variant/30 rounded-lg bg-surface-container-lowest overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="text-on-surface text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Popular Products
            </h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              By sales
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest">
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Product</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Category</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Price</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold text-right">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {popularProducts?.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-outline-variant/30 overflow-hidden bg-surface-container shrink-0">
                          <img src={product.img} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <span className="text-sm font-medium text-on-surface line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{product.category}</td>
                    <td className="p-4 text-sm font-semibold text-primary">
                      ₹{(product.discountPrice || product.price)?.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-sm font-bold text-on-surface text-right">{product.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="lg:col-span-5 border border-outline-variant/30 rounded-lg bg-surface-container-lowest overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30">
            <h3 className="text-on-surface text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Recent Reviews
            </h3>
          </div>
          <div className="divide-y divide-outline-variant/20 max-h-[500px] overflow-y-auto">
            {recentReviews?.map((reviewObj) => (
              <div key={reviewObj._id} className="p-5 hover:bg-surface-container-low/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 shrink-0">
                    <img
                      src={reviewObj.img}
                      alt={reviewObj.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface">{reviewObj.name}</h4>
                        <p className="text-[11px] text-on-surface-variant">{reviewObj.location}</p>
                      </div>
                      <div className="shrink-0 scale-75 origin-top-right">
                        <StarRatings
                          rating={reviewObj.rating}
                          starDimension="16px"
                          starSpacing="2px"
                          starRatedColor="#c8a684"
                          starEmptyColor="#ebe1d2"
                          svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
                          svgIconViewBox="0 0 24 24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  <span>
                    {showFullReview?.state && showFullReview?.id === reviewObj._id
                      ? reviewObj.review
                      : reviewObj.review?.slice(0, 150) + (reviewObj.review?.length > 150 ? "..." : "")}
                  </span>
                  {reviewObj.review?.length > 150 && (
                    <button
                      className="ml-2 text-primary text-xs font-semibold hover:text-secondary transition-colors"
                      onClick={() =>
                        setShowFullReview({
                          state: !(showFullReview?.state && showFullReview?.id === reviewObj._id),
                          id: reviewObj._id,
                        })
                      }
                    >
                      {showFullReview?.state && showFullReview?.id === reviewObj._id
                        ? "Show Less"
                        : "Read More"}
                    </button>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
