import React, { useState, useRef, useEffect } from "react";

const ImageZoomLens = ({ src, alt, zoomLevel = 2.5, onClick }) => {
  const [lensState, setLensState] = useState({ show: false, x: 0, y: 0, xPercent: 0, yPercent: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handler = (e) => setIsTouchDevice(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    let x = e.clientX - left;
    let y = e.clientY - top;
    
    // Bounds checking
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));
    
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setLensState({ show: true, x, y, xPercent, yPercent });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setLensState({ ...lensState, show: false });
  };

  return (
    <div 
      className={`relative w-full h-full group ${isTouchDevice ? 'cursor-pointer' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isTouchDevice ? onClick : undefined}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      
      {/* Zoom Lens */}
      {lensState.show && !isTouchDevice && (
        <div 
          className="absolute pointer-events-none rounded-full border border-[#D4AF37] shadow-lg bg-no-repeat bg-white z-20"
          style={{
            width: "180px",
            height: "180px",
            top: `${lensState.y}px`,
            left: `${lensState.x}px`,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url(${src})`,
            backgroundPosition: `${lensState.xPercent}% ${lensState.yPercent}%`,
            backgroundSize: `${zoomLevel * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoomLens;
