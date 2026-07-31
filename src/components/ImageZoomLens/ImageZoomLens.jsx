import React, { useState, useRef, useEffect } from "react";

const LENS_SIZE = 180;

const ImageZoomLens = ({ src, alt, zoomLevel = 2.5, onClick }) => {
  const [lens, setLens] = useState({ show: false, x: 0, y: 0, w: 0, h: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsTouchDevice(!mediaQuery.matches);

    const handler = (e) => setIsTouchDevice(!e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - left, width));
    const y = Math.max(0, Math.min(e.clientY - top, height));

    setLens({ show: true, x, y, w: width, h: height });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setLens((prev) => ({ ...prev, show: false }));
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${isTouchDevice ? "cursor-pointer" : "cursor-crosshair"}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isTouchDevice ? onClick : undefined}
    >
      {/* No hover scale here: transforming the image would shift the region
          under the cursor away from what the lens magnifies. */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />

      {lens.show && !isTouchDevice && (
        <div
          className="absolute pointer-events-none rounded-full border border-gold shadow-lg bg-no-repeat bg-white z-20"
          style={{
            width: `${LENS_SIZE}px`,
            height: `${LENS_SIZE}px`,
            top: `${lens.y}px`,
            left: `${lens.x}px`,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url("${src}")`,
            // Magnify the source to zoomLevel, then offset so the point under
            // the cursor lands in the centre of the lens.
            backgroundSize: `${lens.w * zoomLevel}px ${lens.h * zoomLevel}px`,
            backgroundPosition: `${-(lens.x * zoomLevel - LENS_SIZE / 2)}px ${-(lens.y * zoomLevel - LENS_SIZE / 2)}px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoomLens;
