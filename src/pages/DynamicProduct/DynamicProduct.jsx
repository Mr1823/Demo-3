import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useCart from "../../hooks/useCart";
import useAuthContext from "../../hooks/useAuthContext";
import useWishlist from "../../hooks/useWishlist";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ImageZoomLens from "../../components/ImageZoomLens/ImageZoomLens";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryImage";

const DynamicProduct = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const [presentInCart, setPresentInCart] = useState(false);
  const [presentInWishlist, setPresentInWishlist] = useState(false);
  const [products] = useProducts();
  const { cartData, addToCart } = useCart();
  const [wishlistData, , refetchWishlist, addToWishlist] = useWishlist();
  const navigate = useNavigate();
  const [axiosSecure] = useAxiosSecure();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quoteMobile, setQuoteMobile] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    const filteredProduct = products?.find((data) => data._id === id);
    setDynamicProduct(filteredProduct);
  }, [products, id]);

  useEffect(() => {
    if (user) {
      const cartProduct = cartData?.find((cartItem) => cartItem.productId === id);
      setPresentInCart(!!cartProduct);

      const wishlistProduct = wishlistData?.find((wishlistItem) => wishlistItem.productId === id);
      setPresentInWishlist(!!wishlistProduct);
    }
  }, [cartData, dynamicProduct, id, wishlistData, user]);

  const handleAddToCartWishlist = (where) => {
    if (user) {
      if (where === "cart") {
        addToCart(dynamicProduct, 1);
      } else if (where === "wishlist") {
        if (presentInWishlist) {
          const wishlistItem = wishlistData.find(item => item.productId === id);
          if (wishlistItem) {
            axiosSecure.delete(`/wishlist/${wishlistItem._id}`).then(() => {
              import('react-hot-toast').then(({ default: toast }) => {
                toast.success("Removed from wishlist");
                refetchWishlist();
              });
            });
          }
        } else {
          addToWishlist(dynamicProduct);
        }
      }
    } else {
      toast.error("Please login to add products into Cart or Wishlist.");
      navigate("/login", { state: { from: location } });
    }
  };

  const handleQuoteRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to request a quote.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setQuoteLoading(true);
    try {
      await axiosSecure.post("/quotes", {
        productId: dynamicProduct.productId || dynamicProduct._id,
        productName: dynamicProduct.name,
        productImage: dynamicProduct.img,
        customerName: quoteName,
        customerMobile: quoteMobile,
        isQuoteOnly: dynamicProduct.isQuoteOnly || false,
      });
      alert("Quote requested! Our artisans will contact you via WhatsApp shortly.");
      setIsQuoteModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit quote request. Please try again.");
    } finally {
      setQuoteLoading(false);
    }
  };

  if (!dynamicProduct) {
    return (
      <div className="w-full flex justify-center items-center py-40 bg-surface">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const finalPrice = dynamicProduct.discountPrice || dynamicProduct.price;
  const breakdown = dynamicProduct.priceBreakdown;
  const mainImage = dynamicProduct.images?.[0] || dynamicProduct.img;

  return (
    <div className="font-body-base bg-background text-on-surface min-h-screen">
      <CustomHelmet title={dynamicProduct.name || "Product Details"} />
      
      <main className="pt-32 pb-section-gap-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <nav className="mb-12">
          <ol className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant uppercase">
            <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">chevron_right</span> 
              <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
            </li>
            <li className="flex items-center gap-2 font-bold text-primary">
              <span className="material-symbols-outlined text-sm">chevron_right</span> 
              {dynamicProduct.category || 'Jewellery'}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Imagery */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container overflow-hidden border border-[#D4AF37]/30 aspect-square group relative rounded-sm">
              <ImageZoomLens
                src={optimizeCloudinaryUrl(mainImage, { width: 800 }) || "https://placehold.co/800x800"}
                alt={dynamicProduct.name} 
                onClick={() => document.getElementById('imageModal').showModal()}
              />
              <button 
                onClick={() => document.getElementById('imageModal').showModal()}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-primary">zoom_in</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((num, idx) => (
                <div key={idx} className="bg-surface-container border border-[#D4AF37]/30 aspect-square overflow-hidden cursor-pointer group rounded-sm">
                  <img 
                    alt={`${dynamicProduct.name} detail ${num}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={optimizeCloudinaryUrl(dynamicProduct.images?.[num] || mainImage, { width: 300 }) || "https://placehold.co/400x400"}
                    onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Image+Not+Found"; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <p className="font-label-caps text-label-caps text-primary tracking-widest mb-4 uppercase">
                {dynamicProduct.category || 'Jewellery'}
              </p>
              <h1 className="font-display-lg text-headline-md text-on-surface mb-8 leading-tight">
                {dynamicProduct.name}
              </h1>
              
              {/* Price Table */}
              {dynamicProduct.isQuoteOnly ? (
                <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 mb-8 rounded-sm text-center">
                  <h3 className="font-button-text text-button-text text-primary mb-2 tracking-wider">PRICE ON REQUEST</h3>
                  <p className="text-on-surface-variant font-body-base">
                    Contact us for a personalized quote.
                  </p>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 mb-8 rounded-sm">
                  <h3 className="font-button-text text-button-text text-primary mb-6 tracking-wider border-b border-outline-variant/20 pb-2">PRICE BREAKDOWN</h3>
                  <div className="space-y-4">
                    {breakdown ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant font-body-base">Base Material</span>
                          <span className="font-semibold">₹ {breakdown.materialCost?.toLocaleString("en-IN") || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant font-body-base">Making Charges</span>
                          <span className="font-semibold">₹ {breakdown.makingCharges?.toLocaleString("en-IN") || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant font-body-base">GST (3%)</span>
                          <span className="font-semibold">₹ {breakdown.gst?.toLocaleString("en-IN") || 0}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant font-body-base">Base Price</span>
                        <span className="font-semibold">₹ {finalPrice?.toLocaleString("en-IN") || 0}</span>
                      </div>
                    )}
                    <div className="pt-6 mt-6 border-t border-primary/20 flex justify-between items-center">
                      <span className="font-display-lg text-headline-sm text-primary uppercase">Net Payable</span>
                      <span className="font-display-lg text-headline-sm text-primary">₹ {finalPrice?.toLocaleString("en-IN") || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-4 mb-12">
                {!dynamicProduct.isQuoteOnly && (
                  <button 
                    onClick={() => handleAddToCartWishlist("cart")}
                    className="w-full bg-primary-container text-white py-5 font-button-text text-button-text tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-sm"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    {presentInCart ? "ALREADY IN BAG" : "ADD TO BAG"}
                  </button>
                )}
                <button 
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full bg-transparent border border-[#c8a684] text-primary py-5 font-button-text text-button-text tracking-widest hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-sm"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  ENQUIRE NOW
                </button>
              </div>

              {/* Accordion Details */}
              <div className="space-y-0">
                <details className="group border-b border-outline-variant/30 py-4" open>
                  <summary className="flex justify-between items-center cursor-pointer list-none font-button-text text-button-text text-on-surface">
                    DETAILS
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 pb-2 text-on-surface-variant text-body-base leading-relaxed">
                    {dynamicProduct.description || "Intricately designed jewellery piece crafted by artisans."}
                  </div>
                </details>
                <details className="group border-b border-outline-variant/30 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-button-text text-button-text text-on-surface">
                    SHIPPING & RETURNS
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 pb-2 text-on-surface-variant text-body-base">
                    Complimentary fully insured shipping within India. Returns accepted within 7 days in original, unworn condition with all authenticity certificates.
                  </div>
                </details>
                <details className="group border-b border-outline-variant/30 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-button-text text-button-text text-on-surface">
                    CARE GUIDE
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 pb-2 text-on-surface-variant text-body-base">
                    Store in a soft pouch to avoid scratches. Clean with a dry cotton cloth after each use. Professional polishing service available at any SRJ boutique.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <dialog id="quote_modal" className="modal modal-open">
          <div className="modal-box bg-surface border border-outline-variant/30 rounded-sm">
            <form method="dialog">
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-on-surface"
              >
                ✕
              </button>
            </form>
            <h3 className="font-display-lg text-headline-sm text-primary mb-4">Request Quote</h3>
            <p className="font-body-base text-on-surface-variant text-sm mb-6">
              Our artisans will prepare a personalized quote and contact you.
            </p>
            <form onSubmit={handleQuoteRequest} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Name</label>
                <input 
                  type="text" 
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm"
                  placeholder="Your Full Name"
                  required 
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">WhatsApp Number</label>
                <input 
                  type="tel" 
                  value={quoteMobile}
                  onChange={(e) => setQuoteMobile(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm"
                  placeholder="+91"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={quoteLoading}
                className="w-full mt-4 bg-primary text-white py-4 font-button-text uppercase tracking-widest hover:bg-primary-container transition-colors disabled:opacity-70 rounded-sm"
              >
                {quoteLoading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsQuoteModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Image Zoom Modal */}
      <dialog id="imageModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl bg-surface p-2 rounded-sm relative overflow-hidden h-[80vh]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle bg-black/50 text-white border-none absolute right-4 top-4 hover:bg-black/70 z-50">✕</button>
          </form>
          <img src={optimizeCloudinaryUrl(mainImage)} className="w-full h-full object-contain" alt="Zoomed Product" />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Login Prompt Modal (Existing structure) */}
      <dialog id="takeToLoginModal" className="modal">
        <div className="modal-box bg-surface border border-outline-variant/30 rounded-sm">
          <h3 className="font-display-lg text-headline-sm text-primary mb-4">Please Login</h3>
          <p className="font-body-base text-on-surface-variant">You need to login <span id="loginModalTextContent"></span></p>
          <div className="modal-action">
            <form method="dialog">
              <button className="px-6 py-2 border border-outline text-on-surface hover:bg-surface-container transition-colors rounded-sm font-button-text mr-4">Cancel</button>
              <Link to="/login" className="px-6 py-2 bg-primary text-white hover:bg-primary-container transition-colors rounded-sm font-button-text">Login</Link>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DynamicProduct;
