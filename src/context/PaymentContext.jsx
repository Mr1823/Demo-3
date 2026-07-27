import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../utils/apiConfig";

export const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const apiBase = getApiBaseUrl();

  /**
   * Initialize Razorpay checkout.
   * @param {Object} params
   * @param {Array} params.items - cart items to purchase
   * @param {Object} params.shippingAddress - shipping details
   * @param {string} params.accessToken - JWT access token
   * @param {Function} params.onSuccess - callback on successful payment
   * @param {Function} params.onFailure - callback on failed payment
   */
  const initiatePayment = useCallback(async ({ items, shippingAddress, accessToken, onSuccess, onFailure }) => {
    setIsProcessing(true);

    try {
      // Step 1: Create order on server (server verifies prices)
      const orderRes = await axios.post(
        `${apiBase}/payment/create-order`,
        { items, shippingAddress },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { razorpayOrderId, amount, currency, key, orderId } = orderRes.data;

      if (!key) {
        throw new Error("Razorpay key not configured on server");
      }

      // Step 2: Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });
      }

      // Step 3: Open Razorpay checkout modal
      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "Sri Ram Jewellery",
        description: "Timeless gold and silver, crafted for every celebration",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Step 4: Verify payment on server
            const verifyRes = await axios.post(
              `${apiBase}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            setPaymentInfo(verifyRes.data);
            setIsProcessing(false);
            onSuccess?.(verifyRes.data);
          } catch (verifyErr) {
            setIsProcessing(false);
            onFailure?.(verifyErr.response?.data?.error || "Payment verification failed");
          }
        },
        prefill: {},
        theme: {
          color: "#8B6447",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            onFailure?.("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      onFailure?.(error.response?.data?.error || error.message || "Payment failed");
    }
  }, [apiBase]);

  const value = {
    paymentInfo,
    setPaymentInfo,
    isProcessing,
    initiatePayment,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
