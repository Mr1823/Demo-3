import React from "react";
import useOrders from "../../../hooks/useOrders";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyOrders = () => {
  const { orders, refetch } = useOrders();
  const [axiosSecure] = useAxiosSecure();
  const navigate = useNavigate();

  const handleDeleteOrder = (order, e) => {
    e.stopPropagation();
    const today = new Date();
    const orderDate = new Date(order.date);
    const diffInDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

    if (diffInDays > 7) {
      Swal.fire({
        title: "Too Late",
        text: "No orders can be cancelled after 7 days of ordering.",
        icon: "error",
        confirmButtonColor: "#8B6447",
        confirmButtonText: "Ok, take me back",
      });
    } else {
      Swal.fire({
        title: "Cancel Order?",
        html: `Your order will be cancelled. Check out our <a href="#" target="_blank" class="underline text-primary">refund policy</a>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#8B6447",
        cancelButtonColor: "#c8a684",
        confirmButtonText: "Yes, cancel it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure
            .delete(`/delete-order/${order._id}`)
            .then((res) => {
              if (res.data.deletedCount > 0) {
                Swal.fire({
                  title: "Cancelled!",
                  text: "Your order has been cancelled successfully",
                  icon: "success",
                  confirmButtonColor: "#8B6447",
                });
                refetch();
              }
            })
            .catch((error) => console.error(error));
        }
      });
    }
  };

  const navigateToOrder = (orderId) => {
    navigate("/order-success", { state: { orderId } });
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-12">
        <span className="font-label-caps text-label-caps text-secondary block mb-2 tracking-[0.3em] uppercase">
          YOUR ACCOUNT
        </span>
        <h1 className="font-display-lg text-display-lg text-primary">My Orders</h1>
      </div>

      {!orders?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" id="empty-state">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-4xl text-outline">shopping_bag</span>
          </div>
          <span className="font-label-caps text-label-caps text-secondary block mb-2 tracking-[0.3em] uppercase">
            NO HISTORY
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Your order box is empty</h2>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-sm mb-10 leading-relaxed">
            It seems you haven't started your artisanal collection yet. Explore our curated heritage pieces and find your next heirloom.
          </p>
          <Link 
            to="/shop" 
            className="font-button-text text-button-text border border-primary px-10 py-4 hover:bg-primary hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6" id="orders-list">
          {orders.map((order) => {
            const isProcessing = order.orderStatus?.toLowerCase() === "processing";
            const isDelivered = order.orderStatus?.toLowerCase() === "delivered";
            
            return (
              <div 
                key={order._id} 
                className="p-6 md:p-8 bg-surface-container-low/50 border border-[#c8a684]/30 group cursor-pointer relative overflow-hidden transition-all duration-500 hover:bg-white hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(139,100,71,0.08)]"
                onClick={() => navigateToOrder(order.orderId)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="flex -space-x-4">
                      {(order.items || order.orderDetails || []).slice(0, 3).map((item, i) => (
                        <div key={item._id || i} className="w-16 h-16 md:w-20 md:h-20 bg-surface-variant border border-[#c8a684]/30 flex items-center justify-center overflow-hidden rounded-sm">
                          <img 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                            src={item.img || item.image || "https://images.unsplash.com/photo-1599643478524-fb524b0d0f72?q=80&w=2835&auto=format&fit=crop"} 
                            alt={item.name || "Product"} 
                          />
                        </div>
                      ))}
                      {(order.items || order.orderDetails || []).length > 3 && (
                        <div className="w-16 h-16 md:w-20 md:h-20 border border-[#c8a684]/30 flex items-center justify-center overflow-hidden rounded-sm bg-surface-dim z-10">
                          <span className="font-body-base text-sm font-semibold text-primary">+{(order.items || order.orderDetails || []).length - 3}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center pl-2">
                      <span className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">
                        Order #{order.orderId || order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        {(order.items || order.orderDetails || [])[0]?.name || "Heritage Collection"} {(order.items || order.orderDetails || []).length > 1 ? "& More" : ""}
                      </span>
                      <p className="font-body-base text-sm text-on-surface-variant mt-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                    <span className={`px-3 py-1 border text-[10px] font-label-caps uppercase tracking-widest rounded-full ${
                      isProcessing ? 'border-secondary/40 text-secondary bg-white/50' : 
                      isDelivered ? 'border-outline-variant/40 text-on-surface-variant bg-surface-variant/30' : 
                      'border-primary/40 text-primary bg-primary/5'
                    }`}>
                      {order.orderStatus?.toUpperCase() || 'UNKNOWN'}
                    </span>
                    <span className="font-display-lg text-2xl md:text-3xl text-primary">
                      ₹{order.totalAmount || order.total || 0}
                    </span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="mt-6 pt-6 border-t border-outline-variant/20 flex flex-wrap gap-4 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="font-body-base text-xs text-on-surface-variant italic">
                    {isDelivered 
                      ? `Delivered on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` 
                      : `Estimated arrival: ${new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </p>
                  <div className="flex gap-4 w-full sm:w-auto">
                    {isProcessing && (
                      <button 
                        onClick={(e) => handleDeleteOrder(order, e)}
                        className="font-button-text text-button-text text-error/80 border border-error/30 px-4 py-2 hover:bg-error hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span> Cancel Order
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigateToOrder(order.orderId); }}
                      className="flex-1 sm:flex-none font-button-text text-button-text bg-primary text-white px-6 py-2 hover:bg-primary/90 transition-all uppercase tracking-widest cursor-pointer"
                    >
                      {isDelivered ? 'Buy Again' : 'Track Order'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
