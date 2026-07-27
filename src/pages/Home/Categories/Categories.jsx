import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <section className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary italic">Shop by Metal</h2>
        <div className="w-24 h-[1px] bg-primary/30 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Gold */}
        <Link className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm" to="/shop?category=gold">
          <img alt="Pure Gold" className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" src="/images/cat-gold.jpg" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-label-caps text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display-lg text-headline-md text-white">Pure Gold</h3>
          </div>
        </Link>
        {/* Silver */}
        <Link className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm" to="/shop?category=silver">
          <img alt="Sterling Silver" className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" src="/images/cat-silver.jpg" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-label-caps text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display-lg text-headline-md text-white">Sterling Silver</h3>
          </div>
        </Link>
        {/* Diamonds/Precious Stones */}
        <Link className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm" to="/shop?category=diamonds">
          <img alt="Precious Gems" className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" src="/images/cat-gems.jpg" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-label-caps text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display-lg text-headline-md text-white">Precious Gems</h3>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Categories;
