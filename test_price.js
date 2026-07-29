import { computePrice } from './server/utils/computePrice.js';
console.log(computePrice({ weight: 14.42, wastagePercent: 15, gstPercent: 3, metalType: 'gold', price: 0 }, { gold: 7250 }));
