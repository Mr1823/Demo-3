import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import useCart from '../../hooks/useCart';
import RightSideDrawer from '../../components/RightSideDrawer/RightSideDrawer';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Header = () => {
  const location = useLocation();
  const { user, isAuthLoading } = useAuthContext();
  const { cartData, cartSubtotal, refetch: refetchCart } = useCart();
  const [axiosSecure] = useAxiosSecure();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isHome = location.pathname === '/';

  // Scroll listener for header shrink/shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleRemoveFromCart = (productId) => {
    axiosSecure.delete(`/cart/${productId}`).then(() => {
      refetchCart();
    });
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/categories', label: 'Categories' },
    { path: '/about', label: 'About' },
  ];

  const cartCount = cartData?.length || 0;

  return (
    <>
      <header
        className={`fixed z-50 w-full transition-all duration-500 ease-in-out border-b top-0 ${scrolled || !isHome ? 'bg-surface shadow-sm py-2 border-primary/5' : 'bg-transparent py-4 border-white/10'}`}
        id="main-nav"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto gap-4">
          
          {/* Logo & Brand (Left) */}
          <div className="flex-shrink-0">
            <Link className="flex items-center gap-4 group" to="/">
              <img
                alt="Sri Ram Jewellery Logo"
                className="h-10 sm:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnkKiBYrjO5ja_yOK74ECm5mdzcfxXWJFezzcd6geLOcrRGlRUhiETPqKr3Zn23LkiSeCA-2yk2yZaZTExvLRljEPg8jgwT3M7OXFjr6FiN4jdTz7JOoLaGPpyrvz-XwlSXUBgBxuAPJBocfWIt-FNsBrSwcnsluG1KWLQq0yV48ay72CCsvOdBVp_E-WSzhmxhaMrUZ77yQ0VaQ1Q-Qt9JsuKN2h92bYepfcKNheJ0kLbbJ_6dnS5lHMnVY0f3wRUW6tuOZIJ4mY"
              />
              <span className={`hidden sm:inline-block font-display-lg text-body-lg md:text-headline-sm tracking-tight ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}>
                Sri Ram Jewellery
              </span>
            </Link>
          </div>

          {/* Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const linkClasses = `
                  ${isActive(link.path) && link.label !== 'Categories'
                    ? (isHome && !scrolled ? 'text-white border-b-2 border-white pb-1' : 'text-on-surface border-b-2 border-primary pb-1')
                    : (isHome && !scrolled ? 'text-white/80 hover:text-white transition-colors' : 'text-on-surface-variant hover:text-primary transition-colors')
                  } font-button-text text-button-text uppercase tracking-[0.2em]
                `;
                
              if (link.path.includes('#')) {
                return (
                  <a key={link.label} href={link.path} className={linkClasses}>
                    {link.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.label}
                  className={linkClasses}
                  to={link.path}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search & Icons (Right) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="hidden md:block relative group">
                <div className={`w-64 flex items-center border rounded-full px-5 py-2 gap-3 ${isHome && !scrolled ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-surface-container-low border-primary/10'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${isHome && !scrolled ? 'text-white/70' : 'text-on-surface-variant'}`}>search</span>
                  <input 
                    className={`bg-transparent border-none focus:ring-0 p-0 w-full text-body-base text-sm outline-none ${isHome && !scrolled ? 'text-white placeholder:text-white/40' : 'text-on-surface placeholder:text-on-surface-variant/40'}`} 
                    placeholder="Search jewelry..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6">
                <Link className={`${isHome && !scrolled ? 'text-white hover:scale-110' : 'text-on-surface hover:text-primary'} transition-all`} to="/wishlist">
                  <span className="material-symbols-outlined font-light">favorite</span>
                </Link>
                
                <button 
                  className={`${isHome && !scrolled ? 'text-white hover:scale-110' : 'text-on-surface hover:text-primary'} transition-all relative`} 
                  onClick={() => setShowCartDrawer(true)}
                >
                  <span className="material-symbols-outlined font-light">shopping_bag</span>
                  {cartCount > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${isHome && !scrolled ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link className={`${isHome && !scrolled ? 'text-white hover:scale-110' : 'text-on-surface hover:text-primary'} transition-all`} to={user ? "/dashboard" : "/login"}>
                  <span className="material-symbols-outlined font-light">person</span>
                </Link>

                {/* Mobile menu toggle */}
                <button 
                  className={`lg:hidden ${isHome && !scrolled ? 'text-white' : 'text-on-surface hover:text-primary'} transition-colors`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-primary/10 shadow-lg">
            <div className="flex flex-col px-margin-mobile py-4 space-y-4">
              <div className="flex items-center bg-surface-container-low border border-primary/10 rounded-full px-5 py-2 gap-3 mb-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 p-0 w-full text-body-base text-on-surface text-sm placeholder:text-on-surface-variant/40 outline-none" 
                  placeholder="Search jewelry..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {navLinks.map((link) => {
                const linkClasses = `
                    ${isActive(link.path) && link.label !== 'Categories'
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                    } font-button-text text-button-text uppercase tracking-[0.2em] py-2
                  `;
                  
                if (link.path.includes('#')) {
                  return (
                    <a key={link.label} href={link.path} className={linkClasses}>
                      {link.label}
                    </a>
                  );
                }
                
                return (
                  <Link
                    key={link.label}
                    className={linkClasses}
                    to={link.path}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Cart Right Side Drawer */}
      <RightSideDrawer 
        showRightDrawer={showCartDrawer} 
        setShowRightDrawer={setShowCartDrawer} 
        cartData={cartData} 
        removeFromCart={handleRemoveFromCart} 
        cartSubtotal={cartSubtotal}
      />
    </>
  );
};

export default Header;
