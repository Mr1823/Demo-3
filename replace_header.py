import re

with open("src/pages/Header/Header.jsx", "r") as f:
    content = f.read()

# Replace the navigation bar section
start_marker = "{/* Navigation Bar */}"
end_marker = "{/* Navigation Bar End */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

new_navbar = """{/* Navigation Bar */}
          <header className={`fixed z-50 w-full transition-all duration-700 ease-in-out border-b border-outline-variant/30 backdrop-blur-md top-0 ${stickyNav ? 'bg-surface/90' : 'bg-surface'} shadow-lg`} id="main-nav">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNWRJYO0zJcA8RVqpwRmm0iY-D1R_Q2ujKdiMAfD58LuMNPlM43SiQOxvBW6-jZpykQJQL5txVPNTIzy9Eox5WqHn1MqkeTauBLlTQM9yxxZxONDNqDvyA7Q_89ipBItHScvNDHP5YllO3yn-J41QAYQfGRFEvJiYsSUH32wkC-fpKHlB3fEt9JqSSTuDjfgUzJ_Dka-oXKmgJ64PtW6DKbo8jheh6O-6vFekhcFIvGuv8RWvsv6H4aTndXIc9ezCYNDnfFG3bFc" alt="Sri Ram Jewellery Logo" className="h-12 md:h-16 w-auto object-cover" />
                  <span className="ml-[12px] font-display-lg text-[24px] font-semibold text-[#3F2A22]" style={{fontFamily: "'EB Garamond', serif"}}>Sri Ram Jewellery</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link to="/" className="text-on-surface font-semibold border-b-2 border-primary pb-1 font-body-base transition-all">Home</Link>
                <Link to="/shop" className="text-on-surface-variant hover:text-primary transition-colors font-body-base font-semibold">Shop</Link>
                <HashLink to="/#categories" scroll={(el) => scrollWithOffset(el)} className="text-on-surface-variant hover:text-primary transition-colors font-body-base font-semibold">Categories</HashLink>
                <HashLink to="/#connect" scroll={(el) => scrollWithOffset(el)} className="text-on-surface-variant hover:text-primary transition-colors font-body-base font-semibold">Connect</HashLink>
              </nav>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md relative">
                <div className="w-full flex items-center bg-surface-container-low border border-outline-variant/30 rounded-full px-6 py-2.5 gap-3 group focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary cursor-pointer" onClick={handleSearchIcon}>search</span>
                  <input type="text" placeholder="Search jewelry..." className="bg-transparent border-none focus:ring-0 p-0 w-full text-body-base text-on-surface placeholder:text-on-surface-variant/60" onFocus={handleSearchIcon} />
                </div>
              </div>

              {/* Trailing Icons */}
              <div className="flex items-center gap-5">
                <button aria-label="Search" className="md:hidden text-on-surface-variant hover:text-primary transition-colors" onClick={handleSearchIcon}>
                  <span className="material-symbols-outlined">search</span>
                </button>
                <Link to="/wishlist" aria-label="Favorite" className="text-on-surface-variant hover:text-primary transition-colors hidden md:block">
                  <span className="material-symbols-outlined">favorite</span>
                </Link>
                <button aria-label="Shopping Bag" className="text-on-surface-variant hover:text-primary transition-colors relative" onClick={() => setShowRightDrawer(true)}>
                  <span className="material-symbols-outlined">shopping_bag</span>
                  {user && cartData?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartData?.length}</span>
                  )}
                </button>
                
                {/* Profile */}
                {isAuthLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : user ? (
                  <details className="dropdown dropdown-end relative">
                    <summary className="btn btn-ghost btn-circle avatar min-h-0 h-auto p-0 m-0">
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">person</span>
                    </summary>
                    <ul className="mt-4 p-2 shadow-xl menu menu-sm dropdown-content z-[100] bg-base-100 rounded-lg w-60 border border-[var(--pink-gold)]">
                      <div className="hover:bg-white text-left email-con px-2 py-1">
                        <p className="text-xs mb-1">Signed in as</p>
                        <Link to="/dashboard/myDashboard" className="text-primary font-bold overflow-hidden text-ellipsis">{user.email}</Link>
                      </div>
                      <div className="py-2 border-b border-gray-300">
                        {isAdmin && !isUserLoading ? (
                          adminRoutes
                        ) : (
                          <>
                            <li><Link to="/dashboard/myDashboard">Dashboard</Link></li>
                            <li><Link to="/dashboard/myOrders">My Orders</Link></li>
                            <li><Link to="/dashboard/myAddress">Address Book</Link></li>
                            <li><Link to="/dashboard/addReview">Add Review</Link></li>
                          </>
                        )}
                      </div>
                      <li>
                        <button onClick={handleSignOut} className="text-error mt-1">Sign Out</button>
                      </li>
                    </ul>
                  </details>
                ) : (
                  <Link to="/login" aria-label="Profile" className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">person</span>
                  </Link>
                )}
              </div>
            </div>
          </header>
          {/* Navigation Bar End */}"""

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_navbar + content[end_idx:]
    with open("src/pages/Header/Header.jsx", "w") as f:
        f.write(new_content)
    print("Successfully replaced navbar")
else:
    print("Could not find markers")
