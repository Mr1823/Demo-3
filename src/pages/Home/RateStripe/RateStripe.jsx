import React from 'react';
import useRates from '../../../hooks/useRates';

const RateStripe = () => {
  const { rates, isRatesLoading, isError } = useRates();

  const goldRate = isRatesLoading ? "..." : (isError || !rates?.gold?.ratePerGram ? "—" : `₹${rates.gold.ratePerGram.toLocaleString("en-IN")}`);
  const silverRate = isRatesLoading ? "..." : (isError || !rates?.silver?.ratePerGram ? "—" : `₹${rates.silver.ratePerGram.toLocaleString("en-IN")}`);

  // Create an array to repeat the marquee text a few times
  const repeatCount = 6;
  const marqueeItems = Array.from({ length: repeatCount });

  return (
    <div className="relative z-30 bg-primary overflow-hidden py-3 border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((_, index) => (
          <div key={index} className="flex items-center gap-8 px-4">
            <span className="font-label-caps text-label-caps text-surface-bright uppercase tracking-widest">
              22K GOLD {goldRate}/g
            </span>
            <span className="text-surface-bright/40">•</span>
            <span className="font-label-caps text-label-caps text-surface-bright uppercase tracking-widest">
              999 SILVER {silverRate}/g
            </span>
            <span className="text-surface-bright/40">•</span>
            <span className="font-label-caps text-label-caps text-surface-bright uppercase tracking-widest">
              Rates updated daily
            </span>
            <span className="text-surface-bright/40">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateStripe;
