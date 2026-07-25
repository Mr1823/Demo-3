import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <section className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="font-display text-4xl md:text-6xl text-primary italic">Shop by Metal</h2>
        <div className="w-24 h-[1px] bg-primary/30 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gold */}
        <Link to="/shop?category=gold" className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm">
          <img 
            alt="Pure Gold" 
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" 
            src="https://images.unsplash.com/photo-1599643477873-1fd955d8d06b?q=80&w=2835&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-body text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display text-3xl md:text-4xl text-white">Pure Gold</h3>
          </div>
        </Link>
        {/* Silver */}
        <Link to="/shop?category=silver" className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm">
          <img 
            alt="Sterling Silver" 
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" 
            src="https://images.unsplash.com/photo-1599643478524-fb524b0d0f72?q=80&w=2835&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-body text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display text-3xl md:text-4xl text-white">Sterling Silver</h3>
          </div>
        </Link>
        {/* Diamonds/Precious Stones */}
        <Link to="/shop?category=diamonds" className="group relative h-[450px] md:h-[550px] overflow-hidden block rounded-sm shadow-sm">
          <img 
            alt="Precious Gems" 
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110" 
            src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2936&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
            <span className="font-body text-[10px] text-surface-container-low uppercase tracking-[0.25em]">Collection</span>
            <h3 className="font-display text-3xl md:text-4xl text-white">Precious Gems</h3>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Categories;
