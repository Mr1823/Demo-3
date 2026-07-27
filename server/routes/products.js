import express from "express";
import { Product } from "../models/Product.js";
import { GoldRate } from "../models/GoldRate.js";
import { computePrice } from "../utils/computePrice.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getRates = async () => {
  const rates = await GoldRate.find().lean();
  const rateMap = {};
  for (const r of rates) {
    rateMap[r.metalType] = r.ratePerGram;
  }
  // Fallback: if old single-document format exists
  if (rates.length === 1 && rates[0].rate) {
    rateMap.gold = rates[0].rate;
    rateMap.silver = rates[0].silverRate || 0;
  }
  return rateMap;
};

const getPriceInjectedProducts = async (query = {}) => {
  const products = await Product.find(query).lean();
  const rateMap = await getRates();

  return products.map(product => {
    const computedPrice = computePrice(product, rateMap);
    if (computedPrice !== undefined) {
      product.price = computedPrice;
      if (product.discountPercentage) {
        product.discountPrice = computedPrice - (computedPrice * (product.discountPercentage / 100));
      }
    }
    return product;
  });
};

// ─── Public Reads (JWT required per PRD) ─────────────────────────────────────

// GET /api/products/filter?category=...&minPrice=...&maxPrice=...
router.get("/filter", verifyJWT, async (req, res) => {
  try {
    const { category, minPrice = 0, maxPrice = 1000000, priceOrder, search } = req.query;

    let query = {};
    if (category && category !== "All" && category !== "undefined") {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search !== "undefined") {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let products = await getPriceInjectedProducts(query);

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
    console.error("Filter products error:", error);
    res.status(500).json({ error: "Failed to fetch filtered products" });
  }
});

// GET /api/products or /api/products?category=Rings&page=1
router.get("/", verifyJWT, async (req, res) => {
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
      totalPages: 1,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/search?q=diamond
router.get("/search", verifyJWT, async (req, res) => {
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
router.get("/:id", verifyJWT, async (req, res) => {
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

    const rateMap = await getRates();
    const computedPrice = computePrice(product, rateMap);
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

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

// POST /api/products — create product (admin)
router.post("/", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const productData = {
      productId: req.body.productId || `p-${Date.now()}`,
      ...req.body,
    };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PATCH /api/products/:id — update product (admin)
router.patch("/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        $or: [
          { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
          { productId: req.params.id }
        ].filter(Boolean)
      },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id — delete product (admin)
router.delete("/:id", verifyJWT, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { productId: req.params.id }
      ].filter(Boolean)
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
