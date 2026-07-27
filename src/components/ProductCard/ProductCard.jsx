import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [, refetch] = useCart();
  
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <article className="group flex flex-col gap-5 cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-colors duration-500 rounded-sm">
        <img 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          src={product.images?.[0] || "https://placehold.co/400x500"}
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // TODO: implement wishlist toggle
          }}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors z-10 bg-white/60 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300"
        >
          <span className="material-symbols-outlined text-[20px]">favorite_border</span>
        </button>
      </div>
      
      <div className="flex flex-col items-center text-center gap-2">
        <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest">
          {product.category || 'Heritage Gold'}
        </span>
        <h3 className="font-display-lg text-[22px] text-on-background leading-tight line-clamp-1 px-4">
          {product.name}
        </h3>
        
        <div className="mt-2 text-primary font-bold">
            ₹ {product.price?.toLocaleString("en-IN")}
        </div>
        
        <button 
          onClick={(e) => {
             e.stopPropagation();
             handleCardClick(); // For now just go to detail, can be Add to Cart later
          }}
          className="mt-2 font-button-text text-button-text text-primary border border-primary/40 px-8 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300 rounded-sm w-full max-w-[200px]"
        >
          View Details
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
