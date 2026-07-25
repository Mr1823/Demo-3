import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed z-50 w-full transition-all duration-500 ease-in-out border-b border-primary/10 backdrop-blur-md top-0 bg-surface/95" id="main-nav">
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-7xl mx-auto gap-4">
        {/* Logo & Brand (Left) */}
        <div className="flex-shrink-0">
          <Link className="flex items-center gap-3" to="/">
            <img alt="SRJ Logo" className="h-14 w-auto object-contain" src="/logo.png" />
            <div className="flex flex-col">
              <span className="font-display text-[22px] leading-tight text-primary font-semibold">Sri Ram</span>
              <span className="font-display text-[18px] leading-tight text-primary/80">Jewellery</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links (Centered) */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link 
            className={`${isActive('/') ? 'text-primary font-semibold border-b-2 border-primary/60 pb-1' : 'text-on-surface-variant hover:text-primary'} font-body transition-all text-sm uppercase tracking-wide`} 
            to="/"
          >
            Home
          </Link>
          <Link 
            className={`${isActive('/shop') ? 'text-primary font-semibold border-b-2 border-primary/60 pb-1' : 'text-on-surface-variant hover:text-primary'} font-body transition-all text-sm uppercase tracking-wide`} 
            to="/shop"
          >
            Shop
          </Link>
          <Link 
            className="text-on-surface-variant hover:text-primary transition-colors font-body font-medium text-sm uppercase tracking-wide" 
            to="/shop?category=gold"
          >
            Categories
          </Link>
          <Link 
            className="text-on-surface-variant hover:text-primary transition-colors font-body font-medium text-sm uppercase tracking-wide" 
            to="/#about"
          >
            About
          </Link>
        </nav>
        
        {/* Search & Icons (Right) */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex relative group">
            <div className="w-64 flex items-center bg-surface-container border border-primary/20 rounded-full px-5 py-2 gap-3 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
              <span className="material-symbols-outlined text-primary text-[20px]">search</span>
              <input className="bg-transparent border-none focus:ring-0 p-0 w-full text-body text-on-surface text-sm placeholder:text-on-surface-variant/50" placeholder="Search jewelry..." type="text"/>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link aria-label="Favorite" className="text-on-surface-variant hover:text-primary transition-colors" to="/wishlist">
              <span className="material-symbols-outlined font-light">favorite</span>
            </Link>
            
            <label aria-label="Shopping Bag" className="text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer" htmlFor="cart-drawer">
              <span className="material-symbols-outlined font-light">shopping_bag</span>
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </label>
            
            <Link aria-label="Profile" className="text-on-surface-variant hover:text-primary transition-colors" to="/login">
              <span className="material-symbols-outlined font-light">person</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
