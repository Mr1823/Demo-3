import React, { useState, useEffect } from "react";

const CountDownTimer = ({ targetDate = new Date(Date.now() + 86400000 * 3) }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-max items-center">
      <div className="flex flex-col p-2 bg-neutral text-neutral-content rounded-box text-neutral-900 bg-gray-100 border border-gray-200 min-w-[55px]">
        <span className="font-mono text-2xl font-bold">
          {timeLeft.days || 0}
        </span>
        <span className="text-xs uppercase text-gray-500">Days</span>
      </div>
      <span className="font-bold text-xl">:</span>
      <div className="flex flex-col p-2 bg-neutral text-neutral-content rounded-box text-neutral-900 bg-gray-100 border border-gray-200 min-w-[55px]">
        <span className="font-mono text-2xl font-bold">
          {timeLeft.hours || 0}
        </span>
        <span className="text-xs uppercase text-gray-500">Hours</span>
      </div>
      <span className="font-bold text-xl">:</span>
      <div className="flex flex-col p-2 bg-neutral text-neutral-content rounded-box text-neutral-900 bg-gray-100 border border-gray-200 min-w-[55px]">
        <span className="font-mono text-2xl font-bold">
          {timeLeft.minutes || 0}
        </span>
        <span className="text-xs uppercase text-gray-500">Mins</span>
      </div>
      <span className="font-bold text-xl">:</span>
      <div className="flex flex-col p-2 bg-neutral text-neutral-content rounded-box text-neutral-900 bg-gray-100 border border-gray-200 min-w-[55px]">
        <span className="font-mono text-2xl font-bold">
          {timeLeft.seconds || 0}
        </span>
        <span className="text-xs uppercase text-gray-500">Secs</span>
      </div>
    </div>
  );
};

export default CountDownTimer;
