import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../../hooks/useProducts';

const Featured = () => {
  const [products, isProductsLoading] = useProducts();

  // We'll show the top 3 items based on some condition, or just the first 3
  const featuredItems = products?.slice(0, 3) || [];
  
  const fallbackImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAR00zZuU61PvNxYkRH2m1dMxfwDzLNy7ZjUJ-SPuUOQsxsgIpa_31LpHMsWbM1MpZopatS0ApQUaUnOt4a6xI1B8RQ4AjjZ6N35jVmfKcahYBQGx11YE4L3SPpuiRaPURD3VJRj9e_IiHjwYr6MRVwSd-tYoWFPmTNtHp9Gl3W3i_pmtSOcSUwzZlwLlTJTGj5rc_l1JSqLzg09KnSQUjJhlCMjd9KYZks5lsJvGUphlLYJFIAC9PlLfSmvrbujMyHtH2SPXDYIJg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDR11r-g8PlrD7Zwlr32afm3GRDrkSMeVRMLm1cDzLqUbhkhDahlz-8lG9jN8jsTisFRLuAqJNS0HVXz66W1b3aoNPqqK9_N-T69cPuNST70vHTztbBqHfJe9k__qhqCPuddv61jvMUxXusUmamA6igY0jeb-R00wiLH49B4OK0v2qAFPVWcQN27OPEhmdJv5BnoNvV4BM-BbT6V-LOPwrN8mCj1-Of7lRsoS02OBrgd7VBdpGhT-n8337I4Om9k-7GI2XZmBUXHuM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFlTJYdSisv1NFqwAz_rlwE5juFxNn26tlwKjhXPREwwXwKPdcm7-kX07zEzrXOKncdfcpJAF5UfQM4eqXKTg_AdP0IzZ0_lmj__K9Yw30_SyerQkI1juPzwYmSzKL5hgcmLLR-5h93crlhHeo6Jo5KMIidvh94NK_6Jf7NkfF2cwWYxqJGNNA8auP0i4f8fdYcWhLiUyPk5SXrGyQO0zFagELeYQKFpkFbul2Wbd-3956sPVuAYCi1cuVss5vINUihrg_hWLW6NA"
  ];

  return (
    <section className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/10 pb-6">
        <div className="space-y-3">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-[0.3em]">Curated Heritage</span>
          <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary">The Heritage Collection</h2>
        </div>
        <Link className="font-button-text text-button-text text-primary hover:text-secondary transition-all flex items-center gap-2 group" to="/shop">
          View All <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
      
      {isProductsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[350px]">
          <div className="md:col-span-8 md:row-span-2 animate-pulse bg-surface-container rounded-lg"></div>
          <div className="md:col-span-4 md:row-span-1 animate-pulse bg-surface-container rounded-lg"></div>
          <div className="md:col-span-4 md:row-span-1 animate-pulse bg-surface-container rounded-lg"></div>
        </div>
      ) : featuredItems.length >= 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[350px]">
          {/* Featured Large Card */}
          <div className="md:col-span-8 md:row-span-2 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm rounded-lg">
            <img alt={featuredItems[0].name} className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" src={featuredItems[0].images?.[0] || featuredItems[0].img || fallbackImages[0]} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
            <div className="relative z-20 flex justify-between items-end w-full">
              <div>
                <h3 className="font-display-lg text-headline-md text-primary mb-2">{featuredItems[0].name}</h3>
                <p className="font-body-base text-body-base text-on-surface-variant italic">{featuredItems[0].description?.substring(0, 50)}...</p>
              </div>
              <Link aria-label="View Details" className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all bg-surface/80 backdrop-blur-sm" to={`/products/${featuredItems[0]._id}/description`}>
                <span className="material-symbols-outlined">north_east</span>
              </Link>
            </div>
          </div>
          
          {/* Secondary Card 1*/}
          <Link className="md:col-span-4 md:row-span-1 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm rounded-lg" to={`/products/${featuredItems[1]._id}/description`}>
            <img alt={featuredItems[1].name} className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 transition-all duration-1000 group-hover:scale-105" src={featuredItems[1].images?.[0] || featuredItems[1].img || fallbackImages[1]} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
            <div className="relative z-20">
              <h3 className="font-display-lg text-headline-sm text-primary mb-1">{featuredItems[1].name}</h3>
              <p className="font-body-base text-body-base text-on-surface-variant text-sm italic">{featuredItems[1].description?.substring(0, 30)}...</p>
            </div>
          </Link>

          {/* Secondary Card 2 */}
          <Link className="md:col-span-4 md:row-span-1 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm rounded-lg" to={`/products/${featuredItems[2]._id}/description`}>
            <img alt={featuredItems[2].name} className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 transition-all duration-1000 group-hover:scale-105" src={featuredItems[2].images?.[0] || featuredItems[2].img || fallbackImages[2]} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
            <div className="relative z-20">
              <h3 className="font-display-lg text-headline-sm text-primary mb-1">{featuredItems[2].name}</h3>
              <p className="font-body-base text-body-base text-on-surface-variant text-sm italic">{featuredItems[2].description?.substring(0, 30)}...</p>
            </div>
          </Link>
        </div>
      ) : (
        <p className="text-center text-on-surface-variant font-body-base">Not enough featured items available.</p>
      )}
    </section>
  );
};

export default Featured;
