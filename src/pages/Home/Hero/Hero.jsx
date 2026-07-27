import React from 'react';
import { Link } from 'react-router-dom';
import useRates from '../../../hooks/useRates';

const Hero = () => {
  const { rates, isRatesLoading, isError } = useRates();
  
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            alt="Heritage Jewellery Hero" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 animate-[ken-burns_20s_ease-in-out_infinite]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbJD8jbHEXKW_CeHrSquL3wApc6fEBLGkoHuGc-iL6bpRKiSOw_pAPeHGq-3kZ0iySMjLlV1_84YnXrWYOVqiObTcDGKqTW90hxfvNY0YQrkj1_yvphLtY42lvOHHUJ2DSNG0eiym-nPpxJGj7FjH3ypoi_1shYCcEx7Dr3yga3QFIA0ck0Wg7KdnD9HZDIQXBjDZzkbjryw0CFDf4aQ6yFrD3bfaP4LxaQj1PSzWX48UFlhWg_aG0wcn_NBoIZ3YANFKL4gCYMzY"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white">
            Sri Ram Bespoke
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-low max-w-xl opacity-90">
            Exquisite tailoring and heritage craftsmanship. A legacy of sartorial excellence woven into every stitch.
          </p>
          <Link 
            className="mt-8 px-10 py-4 border border-primary-fixed text-primary-fixed hover:bg-primary-fixed hover:text-primary transition-all duration-300 font-button-text text-button-text uppercase tracking-[0.2em] bg-transparent backdrop-blur-sm" 
            to="/shop"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
      
      {/* Live Rate Strip */}
      <section className="w-full bg-surface-container-low border-b border-primary/10 py-5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-16 font-display-lg text-lg text-primary">
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">22K Gold (1g):</span>
            <span className="font-semibold">
              {isRatesLoading ? (
                <span className="animate-pulse bg-primary/20 h-4 w-16 inline-block rounded"></span>
              ) : isError || !rates?.gold?.ratePerGram ? (
                "—"
              ) : (
                `₹ ${rates.gold.ratePerGram.toLocaleString("en-IN")}`
              )}
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-primary/20"></div>
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">Silver (1g):</span>
            <span className="font-semibold">
              {isRatesLoading ? (
                <span className="animate-pulse bg-primary/20 h-4 w-16 inline-block rounded"></span>
              ) : isError || !rates?.silver?.ratePerGram ? (
                "—"
              ) : (
                `₹ ${rates.silver.ratePerGram.toLocaleString("en-IN")}`
              )}
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
