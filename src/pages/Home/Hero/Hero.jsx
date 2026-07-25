import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="bg-cover bg-center bg-no-repeat w-full h-full absolute inset-0 z-0" 
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop')"}}
          ></div>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium">Sri Ram Jewellery</h1>
          <p className="font-body text-lg md:text-xl text-surface-container-low max-w-xl opacity-90">
            Handcrafted gold and silver pieces for every generation. A legacy of artisanal excellence woven into every detail.
          </p>
          <Link 
            to="/shop" 
            className="mt-8 px-10 py-4 border border-primary-fixed text-primary-fixed hover:bg-primary-fixed hover:text-primary transition-all duration-300 font-body font-semibold text-sm uppercase tracking-[0.2em] bg-transparent backdrop-blur-sm"
          >
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* Live Rate Strip */}
      <section className="w-full bg-surface-container-low border-b border-primary/10 py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-16 font-display text-lg text-primary">
          <div className="flex items-center gap-3">
            <span className="font-body font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">22K Gold (1g):</span>
            <span className="font-semibold">₹ 6,850</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-primary/20"></div>
          <div className="flex items-center gap-3">
            <span className="font-body font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Silver (1g):</span>
            <span className="font-semibold">₹ 92.50</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
