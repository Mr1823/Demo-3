import React from 'react';
import { Link } from 'react-router-dom';

const Featured = () => {
  return (
    <section className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/10 pb-6">
        <div className="space-y-3">
          <span className="font-body text-xs text-on-surface-variant uppercase tracking-[0.3em]">Curated Heritage</span>
          <h2 className="font-display text-4xl md:text-5xl text-primary">The Heritage Collection</h2>
        </div>
        <Link to="/shop" className="font-body text-sm font-semibold text-primary hover:text-secondary transition-all flex items-center gap-2 group uppercase tracking-widest">
          View All <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[350px]">
        {/* Featured Large Card */}
        <div className="md:col-span-8 md:row-span-2 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm">
          <img 
            alt="Antique Mango Mala" 
            className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1599643477873-1fd955d8d06b?q=80&w=2835&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
          <div className="relative z-20 flex justify-between items-end w-full">
            <div>
              <h3 className="font-display text-3xl md:text-4xl text-primary mb-2">Antique Mango Mala</h3>
              <p className="font-body text-on-surface-variant italic">22K Gold with Rubies</p>
            </div>
            <button aria-label="View Details" className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all bg-surface/80 backdrop-blur-sm cursor-pointer">
              <span className="material-symbols-outlined">north_east</span>
            </button>
          </div>
        </div>

        {/* Secondary Card 1*/}
        <div className="md:col-span-4 md:row-span-1 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm">
          <img 
            alt="Temple Jhumkas" 
            className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 transition-all duration-1000 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
          <div className="relative z-20">
            <h3 className="font-display text-2xl md:text-3xl text-primary mb-1">Temple Jhumkas</h3>
            <p className="font-body text-on-surface-variant text-sm italic">22K Handcrafted Gold</p>
          </div>
        </div>

        {/* Secondary Card 2 */}
        <div className="md:col-span-4 md:row-span-1 relative bg-surface-container group overflow-hidden border border-primary/5 p-8 flex flex-col justify-end shadow-sm">
          <img 
            alt="Kada Bangles" 
            className="w-full h-full object-cover absolute inset-0 z-0 opacity-95 transition-all duration-1000 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1599643478524-fb524b0d0f72?q=80&w=2835&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
          <div className="relative z-20">
            <h3 className="font-display text-2xl md:text-3xl text-primary mb-1">Kada Bangles</h3>
            <p className="font-body text-on-surface-variant text-sm italic">Solid Gold Accents</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
