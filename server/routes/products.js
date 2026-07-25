import express from "express";
import { Product } from "../models/Product.js";
import { GoldRate } from "../models/GoldRate.js";
import { computePrice } from "../utils/computePrice.js";

const router = express.Router();

const getPriceInjectedProducts = async (query = {}) => {
  const products = await Product.find(query).lean();
  const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
  
  return products.map(product => {
    const computedPrice = computePrice(product, goldRate);
    if (computedPrice !== undefined) {
      product.price = computedPrice;
      if (product.discountPercentage) {
        product.discountPrice = computedPrice - (computedPrice * (product.discountPercentage / 100));
      }
    }
    return product;
  });
};

// GET /api/products/filter?category=...&minPrice=...&maxPrice=...
router.get("/filter", async (req, res) => {
  try {
    const { category, minPrice = 0, maxPrice = 1000000, priceOrder, search } = req.query;
    
    let query = {};
    if (category && category !== "All" && category !== "undefined") {
      // Case insensitive category search
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (search && search !== "undefined") {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let products = await getPriceInjectedProducts(query);

    // Manual price filtering because price is computed dynamically
    if (minPrice) {
      products = products.filter(p => (p.price || 0) >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => (p.price || 0) <= Number(maxPrice));
    }

    if (priceOrder === "low-to-high") {
      products.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceOrder === "high-to-low") {
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch filtered products" });
  }
});

// GET /api/products or /api/products?category=Rings&page=1
router.get("/", async (req, res) => {
  try {
    const { category, sort, page = 1 } = req.query;
    
    let query = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    let products = await getPriceInjectedProducts(query);

    if (sort === "low-to-high") {
      products.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "high-to-low") {
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    res.json({
      success: true,
      data: products,
      totalPages: 1, // Keeping totalPages 1 as per current frontend behavior
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/search?q=diamond
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const products = await getPriceInjectedProducts();
      return res.json({ success: true, data: products });
    }
    
    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };
    
    const matched = await getPriceInjectedProducts(query);
    res.json({ success: true, data: matched });
  } catch (error) {
    res.status(500).json({ error: "Failed to search products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { productId: req.params.id }
      ].filter(Boolean)
    }).lean();

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    const computedPrice = computePrice(product, goldRate);
    if (computedPrice !== undefined) {
      product.price = computedPrice;
      if (product.discountPercentage) {
        product.discountPrice = computedPrice - (computedPrice * (product.discountPercentage / 100));
      }
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
