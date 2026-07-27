import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useOrders from "../../hooks/useOrders";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import toast from "react-hot-toast";
import useUserInfo from "../../hooks/useUserInfo";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [orderObj, setOrderObj] = useState({});
  const [orderDate, setOrderDate] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();

  // get all orders for admin users
  useEffect(() => {
    if (userFromDB?.admin) {
      axiosSecure
        .get("/admin/orders")
        .then((res) => setAllOrders(res.data))
        .catch((e) => console.error(e));
    }
  }, [userFromDB]);

  // get specific order by orderId & email for orderSuccess page
  useEffect(() => {
    if (!userFromDB?.admin) {
      const findOrderById = orders?.find(
        (order) => order.orderId == location?.state?.orderId
      );
      setOrderObj(findOrderById);
    } else {
      const findOrderById = allOrders?.find(
        (order) => order._id == location?.state?.orderId
      );
      setOrderObj(findOrderById);
    }
  }, [location?.state, orders, allOrders, userFromDB]);

  useEffect(() => {
    const today = new Date(orderObj?.date);
    const date = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();
    setOrderDate({ date, month, year });
  }, [orderObj]);

  // create invoice
  const handleDownloadInvoice = async () => {
    setInvoiceLoading(true);
    let invoiceData = {
      images: {
        logo: "https://i.ibb.co/BG5NMsk/output.png",
      },
      sender: {
        company: "Sri Ram Jewellery",
        address: "Timeless Craftsmanship",
        zip: "",
        city: "",
        country: "India",
      },
      client: {
        company: userFromDB?.name,
        address:
          orderObj?.shippingAddress?.streetAddress +
          ", " +
          orderObj?.shippingAddress?.city,
        zip: orderObj?.shippingAddress?.postalCode,
        city: orderObj?.shippingAddress?.state,
        country: orderObj?.shippingAddress?.country,
      },
      information: {
        number:
          orderObj?.orderDetails?.length +
          "" +
          orderObj?.total +
          orderDate?.year,
        date: `${orderDate?.date}-${new Date(orderDate?.date).getMonth() + 1}-${orderDate?.year}`,
      },
      products: orderObj?.orderDetails?.map((product) => ({
        quantity: product?.quantity,
        description: product?.name,
        price: product?.price,
        "tax-rate": 0,
      })),
      "bottom-notice": "Thank you for shopping with Sri Ram Jewellery ✨",
      settings: {
        currency: "INR",
      },
    };

    try {
      if (invoiceData) {
        const easyinvoiceModule = await import("easyinvoice");
        const easyinvoice = easyinvoiceModule.default || easyinvoiceModule;
        const result = await easyinvoice.createInvoice(invoiceData);
        easyinvoice.download(`invoice_${orderObj?.orderId}.pdf`, result?.pdf);
      }
    } catch (error) {
      toast.error("Sorry, our download server is busy. Please try again later");
    }
    setInvoiceLoading(false);
    navigate("/", { state: {}, replace: true });
  };

  return (
    <main className="max-w-container-max mx-auto px-5 md:px-16 py-12 md:py-24 min-h-screen bg-background font-body-base">
      <CustomHelmet title={"Order Success"} />

      {location?.state?.orderId ? (
        <>
          {/* Breadcrumbs */}
          <nav className="mb-12 flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">Order Confirmed</span>
          </nav>

          {/* Success Banner */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h1 className="text-primary text-4xl md:text-5xl mb-4 font-display-lg">
              Order Confirmed
            </h1>
            <p className="text-on-surface-variant max-w-lg mx-auto">
              {location?.state?.from?.pathname === "checkout"
                ? "Thank you! Your order has been received and is being prepared with the utmost care."
                : `Thank you! Your order has been ${orderObj?.orderStatus || "confirmed"}.`}
            </p>
            <div className="w-16 h-px bg-primary/30 mx-auto mt-6"></div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Order Details + Address */}
            <div className="space-y-10">

              {/* Order Details */}
              <div className="border border-outline-variant/30 bg-surface-container-low">
                <div className="p-6 border-b border-outline-variant/30">
                  <h2 className="text-primary text-2xl font-display-lg">
                    Order Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Order ID</span>
                      <p className="text-on-surface font-semibold text-sm break-all">#{orderObj?._id}</p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Date</span>
                      <p className="text-on-surface font-semibold text-sm">
                        {orderDate?.month} {orderDate?.date}, {orderDate?.year}
                      </p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Ordered By</span>
                      <p className="text-on-surface font-semibold text-sm">{orderObj?.name}</p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Total</span>
                      <p className="text-primary font-semibold text-lg font-display-lg">
                        ₹{orderObj?.total?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Payment Method</span>
                      <p className="text-on-surface font-semibold text-sm">
                        {orderObj?.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                      </p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Payment Status</span>
                      <p className={`font-semibold text-sm flex items-center gap-2 ${orderObj?.paymentStatus === "paid" ? "text-green-700" : "text-orange-600"}`}>
                        <span className={`w-2 h-2 rounded-full ${orderObj?.paymentStatus === "paid" ? "bg-green-600" : "bg-orange-500"} animate-pulse`}></span>
                        {orderObj?.paymentStatus?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {orderObj?.transactionId && (
                    <div className="pt-4 border-t border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Transaction ID</span>
                      <p className="text-green-700 font-semibold text-sm">{orderObj?.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-outline-variant/30 bg-surface-container-low">
                <div className="p-6 border-b border-outline-variant/30">
                  <h2 className="text-primary text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Shipping Address
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-on-surface">
                    <span className="font-semibold">{orderObj?.shippingAddress?.streetAddress}</span>
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {orderObj?.shippingAddress?.city}, {orderObj?.shippingAddress?.state} - {orderObj?.shippingAddress?.postalCode}
                  </p>
                  <p className="text-on-surface-variant text-sm">{orderObj?.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary + Actions */}
            <div className="space-y-8">

              {/* Order Summary Table */}
              <div className="border border-outline-variant/30 bg-surface-container-low">
                <div className="p-6 border-b border-outline-variant/30">
                  <h2 className="text-primary text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="border-b border-outline-variant/30 pb-3 mb-4 grid grid-cols-12 gap-2 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span className="col-span-6">Product</span>
                    <span className="col-span-3 text-center">Qty</span>
                    <span className="col-span-3 text-right">Price</span>
                  </div>
                  <div className="space-y-4">
                    {orderObj?.orderDetails?.map((product) => (
                      <div key={product._id} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-6 text-sm text-on-surface line-clamp-1">{product.name}</span>
                        <span className="col-span-3 text-center text-sm text-on-surface-variant">×{product.quantity}</span>
                        <span className="col-span-3 text-right text-sm font-semibold text-on-surface">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-outline-variant/30 mt-6 pt-4 flex justify-between items-center">
                    <span className="text-primary text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Total</span>
                    <span className="text-primary text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ₹{orderObj?.total?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  className="w-full border border-primary text-primary font-button-text text-button-text uppercase tracking-[0.2em] py-5 hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                  onClick={handleDownloadInvoice}
                  disabled={invoiceLoading}
                >
                  {invoiceLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">download</span>
                      Download Invoice
                    </>
                  )}
                </button>
                <button
                  className="w-full bg-primary text-on-primary font-button-text text-button-text uppercase tracking-[0.2em] py-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                  onClick={() => {
                    navigate("/", { state: {}, replace: true });
                  }}
                >
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* No Order State */
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-center space-y-6">
          <span className="material-symbols-outlined text-7xl text-on-surface-variant/30">inventory_2</span>
          <h2 className="text-primary text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            No Order Found
          </h2>
          <p className="text-on-surface-variant max-w-md">
            It seems like no order was placed. Browse our collection and discover something special.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-button-text text-button-text uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
          >
            Explore Collections
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      )}
    </main>
  );
};

export default OrderSuccess;
