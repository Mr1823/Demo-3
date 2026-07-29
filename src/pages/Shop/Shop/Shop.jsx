import React, { useState } from 'react';
import CustomHelmet from '../../../components/CustomHelmet/CustomHelmet';
import useProducts from '../../../hooks/useProducts';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../../components/ProductCard/ProductCard';
import useCategories from '../../../hooks/useCategories';

const Shop = () => {
  const [products, isProductsLoading] = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category');
  const metalParam = searchParams.get('metal');
  const priceParam = searchParams.get('price');
  const sortParam = searchParams.get('sort') || 'featured';
  const [searchTerm, setSearchTerm] = useState('');

  const handleParamChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const filteredProducts = products?.filter(p => {
    if (categoryParam && p.category?.toLowerCase() !== categoryParam.toLowerCase()) return false;
    if (metalParam && p.metalType?.toLowerCase() !== metalParam.toLowerCase()) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    const productPrice = p.discountPrice || p.price;
    if (priceParam === 'under50k' && productPrice >= 50000) return false;
    if (priceParam === '50k-1l' && (productPrice < 50000 || productPrice > 100000)) return false;
    if (priceParam === 'over1l' && productPrice <= 100000) return false;

    return true;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    
    switch (sortParam) {
      case 'price_low_high': return priceA - priceB;
      case 'price_high_low': return priceB - priceA;
      case 'newest': return new Date(b.addedAt || 0) > new Date(a.addedAt || 0) ? 1 : -1;
      case 'featured':
      default: return b.featured ? -1 : 1;
    }
  }) || [];

  return (
    <div className="font-body-base bg-background text-on-surface min-h-screen pb-20">
      <CustomHelmet title="Shop All" />

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 flex flex-col gap-12 mt-[72px]">
        {/* Header Area: Breadcrumbs & Title */}
        <section className="flex flex-col items-center text-center gap-3">
          <nav className="font-body-base text-[13px] text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="/">Home</a>
            <span className="mx-2 text-outline-variant">/</span>
            <a className="hover:text-primary transition-colors" href="/shop">Collections</a>
            <span className="mx-2 text-outline-variant">/</span>
            <span className="text-primary font-medium">All Jewellery</span>
          </nav>
          <div className="relative inline-block mt-2">
            <h1 className="font-display-lg text-[48px] md:text-display-lg text-primary">
              {categoryParam ? categoryParam.toUpperCase() : "The Collection"}
            </h1>
            <div className="absolute -bottom-3 left-1/4 right-1/4 h-[1px] bg-secondary-fixed-dim/50"></div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="flex flex-col md:flex-row justify-between items-center border-y border-outline-variant/30 py-6 gap-6 bg-surface-container-low/30 px-6">
          <div className="flex gap-8 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            
            {/* Metal Filter */}
            <div className="relative group">
              <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
                Metal <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-surface border border-outline-variant/30 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-nowrap shadow-sm">
                <button onClick={() => handleParamChange('metal', null)} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">ALL</button>
                <button onClick={() => handleParamChange('metal', 'gold')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Gold</button>
                <button onClick={() => handleParamChange('metal', 'silver')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Silver</button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
                Category <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-surface border border-outline-variant/30 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-nowrap shadow-sm">
                <button 
                  onClick={() => handleParamChange('category', null)} 
                  className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface"
                >
                  ALL
                </button>
                {categories?.map(c => (
                  <button 
                    key={c._id}
                    onClick={() => handleParamChange('category', c.categoryName?.toLowerCase())} 
                    className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase"
                  >
                    {c.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="relative group">
              <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
                Price <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-surface border border-outline-variant/30 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-nowrap shadow-sm">
                <button onClick={() => handleParamChange('price', null)} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">ALL</button>
                <button onClick={() => handleParamChange('price', 'under50k')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Under ₹50k</button>
                <button onClick={() => handleParamChange('price', '50k-1l')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">₹50k - ₹1L</button>
                <button onClick={() => handleParamChange('price', 'over1l')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Over ₹1L</button>
              </div>
            </div>
          </div>
          
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant whitespace-nowrap relative group z-20 cursor-pointer">
            <span className="uppercase tracking-widest">Sort by:</span>
            <button className="flex items-center gap-1 text-primary hover:text-primary-container transition-colors font-bold uppercase tracking-widest">
              {sortParam === 'newest' ? 'Newest' : sortParam === 'price_low_high' ? 'Price: Low to High' : sortParam === 'price_high_low' ? 'Price: High to Low' : 'Featured'}
              <span className="material-symbols-outlined text-sm">sort</span>
            </button>
            <div className="absolute top-full right-0 mt-2 bg-surface border border-outline-variant/30 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-nowrap shadow-sm">
              <button onClick={() => handleParamChange('sort', 'featured')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Featured</button>
              <button onClick={() => handleParamChange('sort', 'newest')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Newest</button>
              <button onClick={() => handleParamChange('sort', 'price_low_high')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Price: Low to High</button>
              <button onClick={() => handleParamChange('sort', 'price_high_low')} className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase">Price: High to Low</button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {isProductsLoading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-surface-container aspect-[4/5] rounded-sm"></div>
            ))}
          </section>
        ) : filteredProducts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        ) : (
          <div className="py-20 text-center flex flex-col items-center border border-outline-variant/20 bg-surface-container-low/20">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">inventory_2</span>
            <h2 className="font-display-lg text-headline-sm text-primary mb-2">No Results Found</h2>
            <p className="font-body-base text-on-surface-variant max-w-md">
              We couldn't find any pieces matching your current filters. Please try clearing them.
            </p>
            <button 
              onClick={() => { setSearchParams({}); setSearchTerm(''); }}
              className="mt-6 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-button-text uppercase tracking-widest text-xs rounded-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
