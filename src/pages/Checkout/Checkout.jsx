import React, { createContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import Payment from "../Payment/Payment";
import useCart from "../../hooks/useCart";
import useAuthContext from "../../hooks/useAuthContext";
import { v4 as uuidv4 } from "uuid";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

// Payment Context to handle payment info
export const PaymentContext = createContext(null);

const Checkout = () => {
  const { user } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { cartData, cartSubtotal, refetch } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // POST ORDER DATA TO DB
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    const orderId = uuidv4();

    if (orderId) {
      axiosSecure
        .post("/orders", {
          orderId: orderId,
          name: user?.displayName,
          email: user?.email,
          total: parseFloat(cartSubtotal?.subtotal),
          paymentMethod,
          paymentStatus: paymentInfo ? "paid" : "unpaid",
          transactionId: paymentInfo ? paymentInfo.id : null,
          orderDetails: cartData,
          shippingAddress: userFromDB?.shippingAddress,
          orderStatus: "processing",
          date: new Date(),
        })
        .then((res) => {
          if (res.data.insertedId) {
            axiosSecure
              .delete(`/delete-cart-items?email=${user?.email}`)
              .then((res) => {
                if (res.data.deletedCount > 0) {
                  navigate("/order-success", {
                    state: {
                      orderStatus: "success",
                      from: location,
                      orderId: orderId,
                    },
                  });
                  setPaymentInfo(null);
                  refetch();
                }
              });
          }
        })
        .catch(() => setIsPlacingOrder(false));
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-5 md:px-16 py-12 md:py-24 min-h-screen bg-background font-body-base">
      <CustomHelmet title="Checkout" />

      {/* Breadcrumbs */}
      <nav className="mb-12 flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-primary">Checkout</span>
      </nav>

      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-primary text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Checkout
        </h1>
        <div className="w-16 h-px bg-[#e4c09d] mx-auto mt-4"></div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Side — Shipping Address & Payment */}
        <div className="lg:col-span-7 space-y-12">

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
              <h2 className="text-primary text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Shipping Address
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">1</span>
                Step One
              </span>
            </div>
            {userFromDB?.shippingAddress ? (
              <div className="border border-outline-variant/30 bg-surface-container-low p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">Name</span>
                    <p className="text-on-surface font-semibold">
                      {userFromDB?.shippingAddress.firstName}{" "}
                      {userFromDB?.shippingAddress.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">Email</span>
                    <p className="text-on-surface font-semibold">
                      {userFromDB?.shippingAddress.email}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">Phone</span>
                    <p className="text-on-surface font-semibold">
                      {userFromDB?.shippingAddress.number || userFromDB?.shippingAddress.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">City</span>
                    <p className="text-on-surface font-semibold">
                      {userFromDB?.shippingAddress.city}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">Full Address</span>
                  <p className="text-on-surface">
                    {userFromDB?.shippingAddress.streetAddress}, {userFromDB?.shippingAddress.city},{" "}
                    {userFromDB?.shippingAddress.state} - {userFromDB?.shippingAddress.postalCode},{" "}
                    {userFromDB?.shippingAddress.country}
                  </p>
                </div>
                <Link
                  to="/dashboard/address-book"
                  className="inline-flex items-center gap-2 text-primary font-button-text text-button-text uppercase tracking-widest border border-primary px-6 py-3 hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all duration-300 mt-2"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Address
                </Link>
              </div>
            ) : (
              <div className="border border-outline-variant/30 bg-surface-container-low p-8 text-center space-y-6">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">location_on</span>
                <p className="text-on-surface-variant">You have not added a shipping or billing address yet.</p>
                <Link
                  to="/dashboard/address-book"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary font-button-text text-button-text uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Address
                </Link>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
              <h2 className="text-primary text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Payment Method
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">2</span>
                Step Two
              </span>
            </div>
            <p className="text-on-surface-variant text-sm mb-6">
              All transactions are secured and encrypted by{" "}
              <a
                href="https://razorpay.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-semibold hover:text-secondary transition-colors"
              >
                Razorpay
              </a>
            </p>

            <div className="space-y-4">
              {/* Pay with Card */}
              <div
                className={`border p-6 transition-all duration-300 cursor-pointer ${paymentMethod === "card"
                    ? "border-primary bg-surface-container-low"
                    : "border-outline-variant/30 hover:border-primary/50"
                  }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-primary" : "border-outline-variant"
                    }`}>
                    {paymentMethod === "card" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <span className={`font-button-text text-button-text uppercase tracking-widest ${paymentMethod === "card" ? "text-primary font-bold" : "text-on-surface"
                      }`}>
                      Pay with Card
                    </span>
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <div className="mt-6 pl-9">
                    <PaymentContext.Provider
                      value={{
                        orderTotal: cartSubtotal?.subtotal,
                        setPaymentInfo: setPaymentInfo,
                      }}
                    >
                      <Payment />
                    </PaymentContext.Provider>
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                className={`border p-6 transition-all duration-300 cursor-pointer ${paymentMethod === "cod"
                    ? "border-primary bg-surface-container-low"
                    : "border-outline-variant/30 hover:border-primary/50"
                  }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-primary" : "border-outline-variant"
                    }`}>
                    {paymentMethod === "cod" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className={`font-button-text text-button-text uppercase tracking-widest ${paymentMethod === "cod" ? "text-primary font-bold" : "text-on-surface"
                      }`}>
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-[120px] border border-outline-variant/30 bg-surface-container-low">
            <div className="p-6 border-b border-outline-variant/30">
              <h2 className="text-primary text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Order Summary
              </h2>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
              {cartData?.map((item) => (
                <div key={item._id} className="flex gap-4 group">
                  <div className="w-20 h-20 shrink-0 bg-surface-container overflow-hidden border border-outline-variant/30">
                    <img
                      src={item.img || item.image}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.name}
                      </h4>
                      <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₹{(item.price || item.discountPrice)?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
              {(!cartData || cartData.length === 0) && (
                <div className="text-center py-8 text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-4xl mb-2 block">shopping_bag</span>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your cart is empty.</p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="p-6 border-t border-outline-variant/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Subtotal</span>
                <span className="text-on-surface font-semibold">
                  ₹{(cartSubtotal?.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Shipping</span>
                <span className="text-on-surface-variant text-sm italic">Calculated at next step</span>
              </div>
              {paymentMethod === "cod" && (
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant text-sm">Payment Method</span>
                  <span className="text-primary font-semibold text-sm">Cash on Delivery</span>
                </div>
              )}
              {paymentInfo && (
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant text-sm">Payment Status</span>
                  <span className="text-green-700 font-semibold text-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                    PAID
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <span className="text-primary text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Total</span>
                <span className="text-primary text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ₹{(cartSubtotal?.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="p-6 pt-0">
              <button
                className="w-full bg-primary text-on-primary font-button-text text-button-text uppercase tracking-[0.2em] py-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                disabled={
                  (!paymentInfo && paymentMethod !== "cod") ||
                  !userFromDB?.shippingAddress ||
                  isPlacingOrder ||
                  !cartData?.length
                }
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    Place Order
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-on-surface-variant text-center mt-3">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
