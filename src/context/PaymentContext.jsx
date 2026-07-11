import React, { createContext, useState } from "react";

export const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);

  const value = {
    paymentInfo,
    setPaymentInfo,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
