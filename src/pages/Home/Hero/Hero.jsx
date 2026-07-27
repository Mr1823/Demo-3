import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="bg-cover bg-center bg-no-repeat w-full h-full absolute inset-0 z-0" style={{backgroundImage: "url('/images/hero.jpg')"}}></div>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
        </div>
        <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white">Sri Ram Jewellery</h1>
          <p className="font-body-lg text-body-lg text-surface-container-low max-w-xl opacity-90">
            Handcrafted gold and silver pieces for every generation. A legacy of artisanal excellence woven into every detail.
          </p>
          <Link className="mt-8 px-10 py-4 border border-primary-fixed text-primary-fixed hover:bg-primary-fixed hover:text-primary transition-all duration-300 font-button-text text-button-text uppercase tracking-[0.2em] bg-transparent backdrop-blur-sm" to="/shop">
            Explore the Collection
          </Link>
        </div>
      </section>
      
      {/* Live Rate Strip */}
      <section className="w-full bg-surface-container-low border-b border-primary/10 py-5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-16 font-display-lg text-lg text-primary">
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">22K Gold (1g):</span>
            <span className="font-semibold">₹ 6,850</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-primary/20"></div>
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">Silver (1g):</span>
            <span className="font-semibold">₹ 92.50</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
