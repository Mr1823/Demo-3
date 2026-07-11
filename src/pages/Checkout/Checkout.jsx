import React, { createContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import Payment from "../Payment/Payment";
import useCart from "../../hooks/useCart";
import { FaPencil } from "react-icons/fa6";
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

  // POST ORDER DATA TO DB
  const handlePlaceOrder = () => {
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
                  // set orderId in link state to uniquely identify the order in orderSuccess page
                  navigate("/order-success", {
                    state: {
                      orderStatus: "success",
                      from: location,
                      orderId: orderId,
                    },
                  });
                  setPaymentInfo(null);
                  // update cart
                  refetch();
                }
              });
          }
        });
    }
  };

  return (
    <div className="container mb-20" style={{ fontFamily: "var(--poppins)" }}>
      <CustomHelmet title="Checkout" />
      <div className="text-sm breadcrumbs ml-6">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/checkout">Checkout</Link>
          </li>
        </ul>
      </div>

      <section className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start gap-6 gap-y-9 md:gap-y-0 pt-10 px-6 md:px-0">
        {/* left side - shipping address, payment */}
        <div className="flex-grow">
          <div>
            <h1 className="text-xl font-semibold mb-5">
              Shipping/Billing Address
            </h1>
            {userFromDB?.shippingAddress ? (
              <div className="border-2 border-gray-200 rounded-xl shadow p-4 w-fit">
                <div className="text-lg space-y-3 ">
                  <p>
                    Name:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.firstName +
                        " " +
                        userFromDB?.shippingAddress.lastName}
                    </span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.email}
                    </span>
                  </p>
                  <p>
                    Phone:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.number}
                    </span>
                  </p>
                  <p>
                    City:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.streetAddress},{" "}
                      {userFromDB?.shippingAddress.city}
                    </span>
                  </p>
                  <p>
                    State:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.state}
                    </span>
                  </p>
                  <p>
                    Country:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.country}
                    </span>
                  </p>
                  <Link to="/dashboard/myAddress">
                    <button className="btn btn-outline btn-wide mt-8">
                      <FaPencil /> Edit
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p>You have not added a shipping or billing address yet!</p>
                <Link to="/dashboard/myAddress">
                  <button className="btn btn-outline btn-wide mt-6">ADD</button>
                </Link>
              </div>
            )}
          </div>

          {/* payment method */}
          <div className="mt-16">
            <h1 className="text-xl font-semibold mb-4">
              Choose Payment Method
            </h1>
            <p>
              All transactions are secured and encrypted by{" "}
              <a
                href="https://razorpay.com"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium text-blue-700"
              >
                Razorpay
              </a>
            </p>

            <div className="mt-8">
              {/* by card */}
              <div
                className={`p-4 ${paymentMethod === "card" && "rounded-lg"}`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-card"
                    className="radio radio-primary"
                    value={"card"}
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="radio-pay-card"
                    className={`${paymentMethod === "card" && "font-bold"}`}
                  >
                    Pay with Card
                  </label>
                </div>
                <PaymentContext.Provider
                  value={{
                    orderTotal: cartSubtotal?.subtotal,
                    setPaymentInfo: setPaymentInfo,
                  }}
                >
                  <Payment /> {/* checkout card inside */}
                </PaymentContext.Provider>
              </div>

              {/* cash on delivery */}
              <div
                className={`p-4 mt-5  ${
                  paymentMethod === "cod" && "rounded-lg"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-cod"
                    className="radio radio-primary"
                    value={"cod"}
                    checked={paymentMethod == "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="radio-pay-cod"
                    className={`${paymentMethod === "cod" && "font-bold"}`}
                  >
                    Cash On Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side - cart items, place order button */}
        <div className="bg-slate-100 rounded-lg p-6 w-full md:w-[35%]">
          <div>
            <h6 className="text-lg font-semibold">Your order(s)</h6>
            <div className="my-4 space-y-4">
              {cartData?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 w-full shadow rounded-lg"
                >
                  <img src={item.img} alt={item.name} className="w-[25%]" />
                  <div className="flex-grow space-y-2">
                    <h4 className="text-lg  font-medium">
                      {item.name}{" "}
                      <span className="font-bold">x {item.quantity}</span>
                    </h4>
                    <p className="font-bold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between items-center font-bold text-lg">
            <h5>Total</h5>
            <h5>₹{cartSubtotal?.subtotal}</h5>
          </div>
          <div className="divider"></div>
          <div>
            {paymentMethod === "cod" ? (
              <div className="font-bold my-5 flex justify-between items-center text-lg">
                <h4>Payment Method:</h4>
                <span className="font-bold">Cash on delivery</span>
              </div>
            ) : (
              <>
                {paymentInfo && (
                  <div className="font-bold my-5 flex justify-between items-center text-lg">
                    <h4>Payment Status:</h4>
                    <span className="text-success">PAID</span>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            className="btn btn-block btn-neutral text-white mt-4"
            disabled={
              (!paymentInfo && paymentMethod !== "cod") ||
              !userFromDB.shippingAddress
            }
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
