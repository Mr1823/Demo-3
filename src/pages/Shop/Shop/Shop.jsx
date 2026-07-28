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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products?.filter(p => {
    if (categoryParam && p.category?.toLowerCase() !== categoryParam.toLowerCase()) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
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
            <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
              Metal <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="relative group">
              <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
                Category <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              {/* Simple dropdown for categories */}
              <div className="absolute top-full left-0 mt-2 bg-surface border border-outline-variant/30 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-nowrap shadow-sm">
                <button 
                  onClick={() => setSearchParams({})} 
                  className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface"
                >
                  ALL
                </button>
                {categories?.map(c => (
                  <button 
                    key={c._id}
                    onClick={() => setSearchParams({category: c.categoryName?.toLowerCase()})} 
                    className="block w-full text-left px-4 py-2 hover:bg-surface-container font-label-caps text-xs text-on-surface uppercase"
                  >
                    {c.categoryName}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface uppercase tracking-widest hover:text-primary transition-colors">
              Price <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant whitespace-nowrap">
            <span className="uppercase tracking-widest">Sort by:</span>
            <button className="flex items-center gap-1 text-primary hover:text-primary-container transition-colors font-bold uppercase tracking-widest">
              Featured
              <span className="material-symbols-outlined text-sm">sort</span>
            </button>
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
