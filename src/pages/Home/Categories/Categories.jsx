import React from 'react';
import { Link } from 'react-router-dom';
import useCategories from '../../../hooks/useCategories';

const Categories = () => {
  const { categories, isCategoriesLoading } = useCategories();

  // Fallback image if category doesn't have one
  const fallbackImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCx1uzQ5_Pm7hjudm1Kz3Ei6m5M0andEbw7aNU0c9L1hkXg9y5NvcxLr5MtutB5oelU3o1nIqmdltUr1xXWbhkZZ2bI6qtl4n_NbOKst-Wzj3rFYkKPIM-V1McNph0YxzzB3XVxR6j6U1hpDQ_TVrQjAihaqe_G2U4W2h17HMuYAsyVL8vtKoDT3JtgOK0Rmv9cL54OyYWfMHXJ3s_10Ny4ogkgtIRUjZ36VVc-NWbBX_3hBozvFPDhA6Xluj9EEeYv_44Ssqb-k0Q";

  return (
    <section className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary italic">Shop by Metal</h2>
        <div className="w-24 h-[1px] bg-primary/30 mx-auto"></div>
      </div>
      
      {isCategoriesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[1, 2, 3].map(i => (
             <div key={i} className="animate-pulse bg-surface-container h-[450px] md:h-[550px] rounded-lg"></div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {categories.map((cat, idx) => (
            <Link key={cat._id || idx} className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-lg shadow-sm" to={`/shop?category=${cat.categoryName.toLowerCase()}`}>
              <img alt={cat.categoryName} className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" src={cat.image || cat.categoryPic || fallbackImg} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
              <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
                <span className="font-label-caps text-[10px] text-surface-container-low uppercase tracking-[0.25em]">
                  Collection
                </span>
                <h3 className="font-display-lg text-headline-md text-white">{cat.categoryName}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-on-surface-variant font-body-base">No collections available right now.</p>
      )}
    </section>
  );
};

export default Categories;
