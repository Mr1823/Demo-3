export const computePrice = (product, goldRate) => {
  if (product.isFixedPrice === false) {
    return undefined; // "Get Quote" product
  }
  
  const weight = product.weight || 0;
  if (weight === 0) {
    return product.price; // Truly fixed price product
  }

  if (!goldRate || !goldRate.rate) {
    return product.price; // Fallback to base price if no gold rate
  }

  const wastagePercent = product.wastagePercent || 0;
  const gstPercent = product.gstPercent || 0;

  const x = weight * goldRate.rate;
  const z = weight * (wastagePercent / 100) * goldRate.rate;
  const finalPrice = x + z + ((x + z) * (gstPercent / 100));

  return Math.round(finalPrice); 
};
