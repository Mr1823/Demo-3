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
        className={`fixed z-50 w-full transition-all duration-500 ease-in-out border-b border-primary/5 top-0 ${scrolled ? 'bg-surface shadow-sm py-2' : 'bg-surface/90 backdrop-blur-md py-4'}`}
        id="main-nav"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto gap-4">
          
          {/* Logo & Brand (Left) */}
          <div className="flex-shrink-0">
            <Link className="flex items-center gap-4 group" to="/">
              <img 
                alt="Sri Ram Jewellery Logo" 
                className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnkKiBYrjO5ja_yOK74ECm5mdzcfxXWJFezzcd6geLOcrRGlRUhiETPqKr3Zn23LkiSeCA-2yk2yZaZTExvLRljEPg8jgwT3M7OXFjr6FiN4jdTz7JOoLaGPpyrvz-XwlSXUBgBxuAPJBocfWIt-FNsBrSwcnsluG1KWLQq0yV48ay72CCsvOdBVp_E-WSzhmxhaMrUZ77yQ0VaQ1Q-Qt9JsuKN2h92bYepfcKNheJ0kLbbJ_6dnS5lHMnVY0f3wRUW6tuOZIJ4mY"
              />
              <span className="font-display-lg text-body-lg md:text-headline-sm text-primary tracking-tight">
                Sri Ram Jewellery
              </span>
            </Link>
          </div>

          {/* Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`
                  ${isActive(link.path) && link.label !== 'Categories'
                    ? 'text-on-surface border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary transition-colors'
                  } font-button-text text-button-text uppercase tracking-[0.2em]
                `}
                to={link.path}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Icons (Right) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="hidden md:block relative group">
                <div className="w-64 flex items-center bg-surface-container-low border border-primary/10 rounded-full px-5 py-2 gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                  <input 
                    className="bg-transparent border-none focus:ring-0 p-0 w-full text-body-base text-on-surface text-sm placeholder:text-on-surface-variant/40 outline-none" 
                    placeholder="Search jewelry..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link className="text-on-surface hover:text-primary transition-colors" to="/wishlist">
                  <span className="material-symbols-outlined font-light">favorite</span>
                </Link>
                
                <button 
                  className="text-on-surface hover:text-primary transition-colors relative" 
                  onClick={() => setShowCartDrawer(true)}
                >
                  <span className="material-symbols-outlined font-light">shopping_bag</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link className="text-on-surface hover:text-primary transition-colors" to={user ? "/dashboard" : "/login"}>
                  <span className="material-symbols-outlined font-light">person</span>
                </Link>

                {/* Mobile menu toggle */}
                <button 
                  className="lg:hidden text-on-surface hover:text-primary transition-colors"
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
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  className={`
                    ${isActive(link.path) && link.label !== 'Categories'
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                    } font-button-text text-button-text uppercase tracking-[0.2em] py-2
                  `}
                  to={link.path}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Cart Right Side Drawer */}
      <RightSideDrawer 
        isOpen={showCartDrawer} 
        onClose={() => setShowCartDrawer(false)}
        title="Your Cart"
      >
        <div className="flex flex-col h-full bg-surface">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartData?.length > 0 ? (
              cartData.map(item => (
                <div key={item._id} className="flex gap-4 border-b border-outline-variant/30 pb-4">
                  <img src={item.productImage || item.img} alt={item.productName} className="w-20 h-20 object-cover rounded-sm" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display-lg text-sm text-on-surface line-clamp-1">{item.productName}</h4>
                      <p className="font-body-base text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-button-text text-sm text-primary font-bold">₹{item.price?.toLocaleString()}</p>
                      <button onClick={() => handleRemoveFromCart(item._id)} className="text-error hover:text-error/80">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">shopping_bag</span>
                <p className="font-body-base text-on-surface-variant">Your cart is empty</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low">
            <div className="flex justify-between items-center mb-4 font-display-lg">
              <span className="text-on-surface">Subtotal</span>
              <span className="text-primary font-bold">₹{cartSubtotal?.toLocaleString() || 0}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={() => setShowCartDrawer(false)}
              className="w-full block text-center bg-primary text-white py-4 font-button-text tracking-widest hover:bg-primary-container transition-colors rounded-sm uppercase text-sm"
            >
              Checkout
            </Link>
          </div>
        </div>
      </RightSideDrawer>
    </>
  );
};

export default Header;
