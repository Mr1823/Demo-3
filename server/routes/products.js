import express from "express";

const router = express.Router();

// High-end jewellery catalog populated with real asset images from public/img/product/
const sampleProducts = [
  {
    _id: "prod-1",
    productId: "prod-1",
    name: "Royal Diamond Solitaire Ring",
    price: 65000,
    discountPrice: 58500,
    discountPercentage: 10,
    category: "Rings",
    img: "/img/product/1.jpg",
    image: "/img/product/1.jpg",
    description: "Handcrafted 18k white gold ring encrusted with a certified VVS diamond.",
    rating: 4.9,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: true,
    stock: 12,
    sold: 85,
    badge: "Top Seller",
    addedAt: "2026-07-01T10:00:00Z",
    review: [
      { rating: 5, user: "Elena R.", comment: "Exquisite sparkle and pristine finish!", date: "2026-07-05T12:00:00Z" },
      { rating: 5, user: "Marcus V.", comment: "My fiancee loved it above all words.", date: "2026-07-08T15:30:00Z" }
    ],
  },
  {
    _id: "prod-2",
    productId: "prod-2",
    name: "Zambian Emerald & Diamond Necklace",
    price: 145000,
    discountPrice: 130000,
    discountPercentage: 10,
    category: "Necklaces",
    img: "/img/product/2.jpg",
    image: "/img/product/2.jpg",
    description: "An imperial emerald centerpiece flanked by brilliant-cut natural diamonds.",
    rating: 4.95,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: true,
    stock: 8,
    sold: 42,
    badge: "New Arrival",
    addedAt: "2026-07-03T14:20:00Z",
    review: [
      { rating: 5, user: "Sophias L.", comment: "The emerald color is deep and mesmerizing.", date: "2026-07-06T09:15:00Z" }
    ],
  },
  {
    _id: "prod-3",
    productId: "prod-3",
    name: "Polished Platinum Wedding Band",
    price: 42000,
    discountPrice: 38000,
    discountPercentage: 9,
    category: "Rings",
    img: "/img/product/3.jpg",
    image: "/img/product/3.jpg",
    description: "Timeless 950 platinum wedding band designed for supreme comfort and luster.",
    rating: 4.8,
    isFlashSale: false,
    flashSale: false,
    featured: true,
    newArrival: true,
    stock: 20,
    sold: 120,
    badge: "Classic",
    addedAt: "2026-06-28T11:00:00Z",
    review: [
      { rating: 5, user: "David K.", comment: "Heavy, smooth, and extremely comfortable on the finger.", date: "2026-07-02T18:40:00Z" }
    ],
  },
  {
    _id: "prod-4",
    productId: "prod-4",
    name: "Victorian Sapphire Drop Earrings",
    price: 85000,
    discountPrice: 76500,
    discountPercentage: 10,
    category: "Earrings",
    img: "/img/product/4.jpg",
    image: "/img/product/4.jpg",
    description: "Elegant chandelier earrings featuring pear-cut royal blue sapphires.",
    rating: 4.85,
    isFlashSale: false,
    flashSale: false,
    featured: true,
    newArrival: true,
    stock: 14,
    sold: 65,
    badge: "Featured",
    addedAt: "2026-06-25T16:45:00Z",
    review: [
      { rating: 5, user: "Clara T.", comment: "The sapphire stones catch the evening light wonderfully.", date: "2026-07-01T20:10:00Z" }
    ],
  },
  {
    _id: "prod-5",
    productId: "prod-5",
    name: "Rose Gold Tennis Diamond Bracelet",
    price: 110000,
    discountPrice: 99000,
    discountPercentage: 10,
    category: "Bracelets",
    img: "/img/product/5.jpg",
    image: "/img/product/5.jpg",
    description: "Continuous line of individually set conflict-free diamonds in 18k rose gold.",
    rating: 4.9,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: false,
    stock: 10,
    sold: 95,
    badge: "Flash Deal",
    addedAt: "2026-06-20T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-6",
    productId: "prod-6",
    name: "Celestial Pearl Pendant",
    price: 32000,
    discountPrice: 28800,
    discountPercentage: 10,
    category: "Pendants",
    img: "/img/product/6.jpg",
    image: "/img/product/6.jpg",
    description: "Lustrous South Sea pearl suspended from a delicate diamond pavé bail.",
    rating: 4.75,
    isFlashSale: false,
    flashSale: false,
    featured: false,
    newArrival: true,
    stock: 18,
    sold: 30,
    badge: "New Arrival",
    addedAt: "2026-07-05T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-7",
    productId: "prod-7",
    name: "Heritage Gold Filigree Bangle",
    price: 92000,
    discountPrice: 82800,
    discountPercentage: 10,
    category: "Bangles",
    img: "/img/product/7.jpg",
    image: "/img/product/7.jpg",
    description: "Intricate 22k yellow gold bangle crafted with traditional hand-engraved details.",
    rating: 4.9,
    isFlashSale: false,
    flashSale: false,
    featured: true,
    newArrival: true,
    stock: 7,
    sold: 55,
    badge: "Exclusive",
    addedAt: "2026-07-02T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-8",
    productId: "prod-8",
    name: "Imperial Ruby Statement Ring",
    price: 125000,
    discountPrice: 112500,
    discountPercentage: 10,
    category: "Rings",
    img: "/img/product/8.jpg",
    image: "/img/product/8.jpg",
    description: "Vibrant cushion-cut Burmese ruby surrounded by a double halo of white diamonds.",
    rating: 4.95,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: false,
    stock: 5,
    sold: 70,
    badge: "Limited",
    addedAt: "2026-06-15T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-9",
    productId: "prod-9",
    name: "Amethyst Crown Charm",
    price: 18000,
    discountPrice: 16200,
    discountPercentage: 10,
    category: "Charms",
    img: "/img/product/9.jpg",
    image: "/img/product/9.jpg",
    description: "Enchanting royal amethyst crystal charm encased in polished sterling silver.",
    rating: 4.7,
    isFlashSale: false,
    flashSale: false,
    featured: false,
    newArrival: true,
    stock: 25,
    sold: 38,
    badge: "Charming",
    addedAt: "2026-07-06T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-10",
    productId: "prod-10",
    name: "Topaz Teardrop Chandelier Earrings",
    price: 54000,
    discountPrice: 48600,
    discountPercentage: 10,
    category: "Earrings",
    img: "/img/product/10.jpg",
    image: "/img/product/10.jpg",
    description: "Sparkling Swiss blue topaz faceted stones set in delicate 14k white gold.",
    rating: 4.8,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: false,
    stock: 15,
    sold: 78,
    badge: "Special",
    addedAt: "2026-06-22T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-12",
    productId: "prod-12",
    name: "Vintage Marquis Diamond Ring",
    price: 78000,
    discountPrice: 70200,
    discountPercentage: 10,
    category: "Rings",
    img: "/img/product/12.jpg",
    image: "/img/product/12.jpg",
    description: "Marquis-cut diamond ring featuring intricate vintage milgrain edging.",
    rating: 4.88,
    isFlashSale: false,
    flashSale: false,
    featured: true,
    newArrival: true,
    stock: 9,
    sold: 50,
    badge: "Vintage",
    addedAt: "2026-07-04T10:00:00Z",
    review: [],
  },
  {
    _id: "prod-13",
    productId: "prod-13",
    name: "Diamond Encrusted Hoop Earrings",
    price: 62000,
    discountPrice: 55800,
    discountPercentage: 10,
    category: "Earrings",
    img: "/img/product/13.jpg",
    image: "/img/product/13.jpg",
    description: "Medium gold hoops inside-out pavé set with brilliant sparkling diamonds.",
    rating: 4.92,
    isFlashSale: true,
    flashSale: true,
    featured: true,
    newArrival: true,
    stock: 11,
    sold: 88,
    badge: "Must Have",
    addedAt: "2026-07-01T15:00:00Z",
    review: [],
  },
];

// GET /api/products/filter?category=...&minPrice=...&maxPrice=...
router.get("/filter", (req, res) => {
  const { category, minPrice = 0, maxPrice = 1000000, priceOrder, search } = req.query;
  let filtered = [...sampleProducts];

  if (category && category !== "All" && category !== "undefined") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }
  if (search && search !== "undefined") {
    const lower = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
  }
  if (priceOrder === "low-to-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (priceOrder === "high-to-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  res.json(filtered);
});

// GET /api/products or /api/products?category=Rings&page=1
router.get("/", (req, res) => {
  const { category, sort, page = 1 } = req.query;
  let filtered = [...sampleProducts];

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (sort === "low-to-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high-to-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  res.json({
    success: true,
    data: filtered,
    totalPages: 1,
    currentPage: parseInt(page),
  });
});

// GET /api/products/search?q=diamond
router.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: sampleProducts });
  const lower = q.toLowerCase();
  const matched = sampleProducts.filter((p) =>
    p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)
  );
  res.json({ success: true, data: matched });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = sampleProducts.find((p) => p._id === req.params.id || p.productId === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  res.json({ success: true, data: product });
});

export default router;
