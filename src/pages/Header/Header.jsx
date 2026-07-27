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
    { path: '/shop?category=gold', label: 'Categories', exact: false },
    { path: '/about', label: 'About' },
  ];

  const cartCount = cartData?.length || 0;

  return (
    <>
      <header
        className={`fixed z-50 w-full transition-all duration-500 ease-in-out border-b border-primary/10 backdrop-blur-md top-0 bg-surface/95 ${scrolled ? 'shadow-sm py-3' : 'py-4'}`}
        id="main-nav"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto gap-4">
          {/* Logo & Brand (Left) */}
          <div className="flex-shrink-0">
            <Link className="flex items-center gap-3" to="/">
              <img
                alt="SRJ Heritage Logo"
                className="h-20 w-auto object-contain cursor-pointer"
                src="/images/logo.png"
              />
              <div className="flex flex-col">
                <span className="font-display-lg text-[22px] leading-tight text-primary font-semibold">Sri Ram</span>
                <span className="font-display-lg text-[18px] leading-tight text-primary/80">Jewellery</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`
                  ${isActive(link.path) && link.label !== 'Categories'
                    ? 'text-primary font-semibold border-b-2 border-primary/60 pb-1'
                    : 'text-on-surface-variant hover:text-primary font-medium'
                  } font-body-base transition-all text-sm uppercase tracking-wide
                `}
                to={link.path}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Icons (Right) */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <div className="w-64 flex items-center bg-surface-container border border-primary/20 rounded-full px-5 py-2 gap-3 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                <span className="material-symbols-outlined text-primary text-[20px]">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 p-0 w-full text-body-base text-on-surface text-sm placeholder:text-on-surface-variant/50"
                  placeholder="Search jewelry..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link aria-label="Favorite" className="text-on-surface-variant hover:text-primary transition-colors" to="/wishlist">
                <span className="material-symbols-outlined font-light">favorite</span>
              </Link>
              <button aria-label="Shopping Bag" className="text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer" onClick={() => setShowCartDrawer(true)}>
                <span className="material-symbols-outlined font-light">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <Link aria-label="Profile" className="text-on-surface-variant hover:text-primary transition-colors" to={!isAuthLoading && user ? '/dashboard/myDashboard' : '/login'}>
                <span className="material-symbols-outlined font-light" style={!isAuthLoading && user ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                aria-label="Menu"
                className="lg:hidden text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-5 pb-6 pt-4 border-t border-outline-gold/20 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`
                  ${isActive(link.path) && link.label !== 'Categories'
                    ? 'text-primary font-semibold bg-surface-container-low'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  } font-body text-sm uppercase tracking-wide py-3 px-4 rounded transition-all
                `}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="mt-4 flex items-center bg-surface-container border border-primary/20 rounded-full px-5 py-2.5 gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 p-0 w-full font-body text-on-surface text-sm placeholder:text-on-surface-variant/50"
                placeholder="Search jewelry..."
                type="text"
              />
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Drawer */}
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
