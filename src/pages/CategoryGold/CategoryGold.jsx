import React from 'react';
import { Link } from 'react-router-dom';
import CustomHelmet from '../../components/CustomHelmet/CustomHelmet';
import useCategories from '../../hooks/useCategories';
import useProducts from '../../hooks/useProducts';

const CategoryGold = () => {
  const { categories } = useCategories();
  const [products, isProductsLoading] = useProducts();

  const goldCategoriesList = [
    "Necklaces", 
    "Earrings", 
    "Bangles & Bracelets", 
    "Rings", 
    "Chains", 
    "Temple Jewellery", 
    "Mangalsutra", 
    "Nose Pins"
  ];

  // Filter the DB categories to match only our specific gold list
  // Also maps the live counts of gold pieces for each category
  const displayCategories = goldCategoriesList.map(catName => {
    const dbCat = categories?.find(c => c.categoryName.toLowerCase() === catName.toLowerCase());
    
    // Calculate live piece count
    const pieceCount = products?.filter(p => 
      p.category?.toLowerCase() === catName.toLowerCase() && 
      p.metalType?.toLowerCase() === 'gold'
    ).length || 0;

    return {
      id: dbCat?._id || catName,
      name: dbCat?.categoryName || catName,
      image: dbCat?.image || dbCat?.categoryPic || "https://placehold.co/600x600/fcf8f2/c8a684?text=Upload+Image",
      count: pieceCount
    };
  });

  return (
    <div className="font-body-base bg-background text-on-surface min-h-screen">
      <CustomHelmet title="The Gold Collection" />
      
      <main className="pt-32 pb-section-gap-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Section */}
        <section className="text-center mb-16 flex flex-col items-center gap-4">
          <p className="font-label-caps text-label-caps tracking-[0.2em] uppercase text-primary">
            Gold Collection
          </p>
          <h1 className="font-display-lg text-[48px] md:text-display-lg text-on-surface mb-2">
            The Gold Collection
          </h1>
          <p className="font-body-base text-on-surface-variant italic max-w-2xl">
            A curated selection of 22k gold masterpieces crafted for every generation.
          </p>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {displayCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}&metal=gold`}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-surface-container overflow-hidden mb-6 border border-outline-variant/30 rounded-sm">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display-lg text-headline-sm text-on-surface text-center">
                {category.name}
              </h3>
              <p className="font-label-caps text-label-caps tracking-[0.2em] text-on-surface-variant uppercase mt-2">
                {category.count} {category.count === 1 ? 'Piece' : 'Pieces'}
              </p>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
};

export default CategoryGold;
