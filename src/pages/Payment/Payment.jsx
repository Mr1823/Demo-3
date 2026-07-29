import React, { useEffect, useState, useContext } from "react";
import useCart from "../../hooks/useCart";
import useUserInfo from "../../hooks/useUserInfo";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuthContext from "../../hooks/useAuthContext";
import { PaymentContext } from "../Checkout/Checkout";

const Payment = () => {
  const { cartData, cartSubtotal } = useCart();
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { user } = useAuthContext();
  const { orderTotal, setPaymentInfo } = useContext(PaymentContext);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamically load Razorpay Checkout Script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().then((loaded) => {
      setScriptLoaded(loaded);
    });
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setPaymentError("Razorpay payment gateway is currently unavailable. Please refresh or try again.");
      return;
    }

    setLoadingPayment(true);
    setPaymentError(null);

    if (!cartData || !cartData.length) {
      setPaymentError("Your cart is empty.");
      setLoadingPayment(false);
      return;
    }

    if (!userFromDB?.shippingAddress) {
      setPaymentError("Please provide a shipping address before proceeding.");
      setLoadingPayment(false);
      return;
    }

    try {
      // 1. Create order on the backend server securely with cart items
      let orderId = null;
      let amount = 0;
      let razorpayKey = null;
      try {
        const response = await axiosSecure.post("/payment/create-order", { 
          items: cartData,
          shippingAddress: userFromDB?.shippingAddress 
        });
        orderId = response.data?.razorpayOrderId;
        amount = response.data?.amount;
        razorpayKey = response.data?.key;
      } catch (err) {
        console.error("Backend order creation failed", err);
        setPaymentError(err.response?.data?.error || "Failed to initialize payment. Please try again.");
        setLoadingPayment(false);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
        amount: Math.round(amount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
        currency: "INR",
        name: "Sri Ram Jewellery",
        description: "Secure purchase of premium jewelry",
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoadingPayment(true);
            
            // 3. Verify signature securely on backend
            const verifyRes = await axiosSecure.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setPaymentInfo({
                id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              setPaymentSuccess(true);
            } else {
              setPaymentError("Payment verification failed. If money was deducted, it will be refunded.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            setPaymentError("Payment verification failed or timed out.");
          } finally {
            setLoadingPayment(false);
          }
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: userFromDB?.shippingAddress?.number || userFromDB?.shippingAddress?.mobileNumber || "",
        },
        theme: {
          color: "#704c31", // Matching the application's brand color
        },
        modal: {
          ondismiss: function () {
            setLoadingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error("Payment failed:", response.error);
        setPaymentError(response.error.description || "Payment failed. Please try again.");
        setLoadingPayment(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay initiation failed:", error);
      setPaymentError("Unable to open Razorpay payment popup. Please check your network and try again.");
      setLoadingPayment(false);
    }
  };

  return (
    <div className="ml-5 mt-5">
      <div className="border md:w-[60%] p-8 pb-6 rounded-xl shadow bg-white border-gray-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-3 bg-amber-50 rounded-full border border-amber-200">
            <svg 
              className="w-10 h-10 text-amber-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Secure Payment with Razorpay</h3>
            <p className="text-xs text-gray-500 mt-1">
              Pay securely via UPI, Cards, NetBanking, or Wallet
            </p>
          </div>
          
          <div className="w-full mt-2">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
              <span className="text-gray-600 font-medium text-sm">Order Subtotal:</span>
              <span className="text-lg font-bold text-gray-800">₹{orderTotal}</span>
            </div>

            {paymentSuccess ? (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 font-semibold text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Payment Authorized!
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loadingPayment || !scriptLoaded}
                className="btn btn-primary font-bold btn-block text-white transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loadingPayment ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <span className="font-bold text-base">Pay ${orderTotal} with Razorpay</span>
                )}
              </button>
            )}
          </div>

          {paymentError && (
            <div className="mt-3 text-xs text-error font-semibold">
              {paymentError}
            </div>
          )}
          
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
            <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            100% Safe and Encrypted Payments
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

