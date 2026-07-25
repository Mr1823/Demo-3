import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useCart from "../../hooks/useCart";
import useAuthContext from "../../hooks/useAuthContext";
import useWishlist from "../../hooks/useWishlist";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const DynamicProduct = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const [presentInCart, setPresentInCart] = useState(false);
  const [presentInWishlist, setPresentInWishlist] = useState(false);
  const [products] = useProducts();
  const { cartData, addToCart } = useCart();
  const [wishlistData, , , addToWishlist] = useWishlist();

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
      where === "cart"
        ? addToCart(dynamicProduct, 1)
        : addToWishlist(dynamicProduct);
    } else {
      document.getElementById("loginModalTextContent").innerText =
        "to add products into Cart or Wishlist.";
      document.getElementById("takeToLoginModal").showModal();
    }
  };

  if (!dynamicProduct) {
    return (
      <div className="w-full flex justify-center items-center py-40 bg-background">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Price calculations for the UI breakdown approximation
  const finalPrice = dynamicProduct.discountPrice || dynamicProduct.price;
  const gst = Math.round(finalPrice * 0.03); // 3% GST
  const makingCharges = Math.round(finalPrice * 0.12); // Approx 12% making charges in new design
  const basePrice = finalPrice - gst - makingCharges;

  return (
    <main className="pt-32 pb-32 max-w-7xl mx-auto px-4 md:px-8 font-body">
      <CustomHelmet title={"Product Details"} />
      
      {/* Breadcrumb */}
      <nav className="mb-12">
        <ol className="flex items-center gap-2 font-body text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
          <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">chevron_right</span> 
            <Link className="hover:text-primary transition-colors" to="/shop">Jewellery</Link>
          </li>
          <li className="flex items-center gap-2 font-bold text-primary">
            <span className="material-symbols-outlined text-sm">chevron_right</span> 
            <span className="line-clamp-1">{dynamicProduct.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Imagery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container overflow-hidden border border-outline-variant/30 aspect-square group relative">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              src={dynamicProduct.img} 
              alt={dynamicProduct.name}
            />
            <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full backdrop-blur-sm hover:bg-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-primary">zoom_in</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container border border-outline-variant/30 aspect-square overflow-hidden cursor-pointer group">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={dynamicProduct.img} alt="Thumbnail 1" />
            </div>
            <div className="bg-surface-container border border-outline-variant/30 aspect-square overflow-hidden cursor-pointer group">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60" src={dynamicProduct.img} alt="Thumbnail 2" />
            </div>
            <div className="bg-surface-container border border-outline-variant/30 aspect-square overflow-hidden cursor-pointer group">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60" src={dynamicProduct.img} alt="Thumbnail 3" />
            </div>
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="lg:col-span-5">
          <div className="sticky top-40">
            <div className="flex justify-between items-start">
               <p className="font-body text-xs text-primary tracking-widest mb-4 uppercase font-bold">
                 {dynamicProduct.category}
               </p>
               <button 
                  className="text-on-surface-variant hover:text-[#93000a] transition-colors p-2"
                  onClick={() => handleAddToCartWishlist("wishlist")}
                  disabled={presentInWishlist}
                  title="Add to Wishlist"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: presentInWishlist ? "'FILL' 1" : "'FILL' 0", color: presentInWishlist ? "#93000a" : "inherit" }}>
                    favorite
                  </span>
                </button>
            </div>
            <h1 className="font-display text-4xl text-on-surface mb-8 leading-tight">
              {dynamicProduct.name}
            </h1>

            {/* Price Table */}
            <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 mb-8">
              <h3 className="font-body text-xs text-primary font-bold mb-6 tracking-widest border-b border-outline-variant/20 pb-2 uppercase">PRICE BREAKDOWN</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body">Gold Value</span>
                  <span className="font-semibold">₹ {basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body">Making Charges (12%)</span>
                  <span className="font-semibold">₹ {makingCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body">GST (3%)</span>
                  <span className="font-semibold">₹ {gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-6 mt-6 border-t border-primary/20 flex justify-between items-center">
                  <span className="font-display text-2xl text-primary uppercase">Net Payable</span>
                  <span className="font-display text-2xl text-primary">₹ {finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <button 
                onClick={() => handleAddToCartWishlist("cart")}
                disabled={presentInCart || dynamicProduct.stock === 0}
                className="w-full bg-primary-container text-white py-5 font-body text-sm font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:brightness-100 uppercase"
              >
                {presentInCart ? (
                   <><span className="material-symbols-outlined text-sm">check</span> ADDED TO BAG</>
                ) : dynamicProduct.stock === 0 ? (
                   <><span className="material-symbols-outlined text-sm">close</span> OUT OF STOCK</>
                ) : (
                   <><span className="material-symbols-outlined text-sm">shopping_bag</span> ADD TO BAG</>
                )}
              </button>
              <button className="w-full bg-transparent border border-[#c8a684] text-primary py-5 font-body text-sm font-bold tracking-widest hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase cursor-pointer">
                <span className="material-symbols-outlined text-sm">mail</span>
                ENQUIRE NOW
              </button>
            </div>

            {/* Accordion Details */}
            <div className="space-y-0">
              <details className="group border-b border-outline-variant/30 py-4" open>
                <summary className="flex justify-between items-center cursor-pointer list-none font-body text-sm font-bold text-on-surface uppercase tracking-widest">
                  CRAFTSMANSHIP DETAILS
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 pb-2 text-on-surface-variant text-body leading-relaxed">
                  {dynamicProduct.description || "Each link is individually forged by master artisans from the temple towns of South India. Ensures a finish that evolves with time."}
                </div>
              </details>
              
              <details className="group border-b border-outline-variant/30 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none font-body text-sm font-bold text-on-surface uppercase tracking-widest">
                  SHIPPING & RETURNS
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 pb-2 text-on-surface-variant text-body">
                  Complimentary fully insured shipping within India. Returns accepted within 7 days in original, unworn condition with all authenticity certificates.
                </div>
              </details>
              
              <details className="group border-b border-outline-variant/30 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none font-body text-sm font-bold text-on-surface uppercase tracking-widest">
                  CARE GUIDE
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 pb-2 text-on-surface-variant text-body">
                  Store in a soft pouch to avoid scratches. Clean with a dry cotton cloth after each use. Professional polishing service available at any SRJ boutique.
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default DynamicProduct;
