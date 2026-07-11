import express from "express";

const router = express.Router();

const reviews = [
  {
    _id: "rev-1",
    name: "Elena Rostova",
    review: "The craftsmanship and radiance of my solitaire diamond ring surpassed all expectations. A truly royal experience from start to finish.",
    rating: 5,
    location: "Milan, Italy",
  },
  {
    _id: "rev-2",
    name: "Marcus Vance",
    review: "I ordered the Zambian Emerald necklace for our anniversary. The sparkle and deep hue left my wife completely speechless. Exceptional quality!",
    rating: 5,
    location: "London, UK",
  },
  {
    _id: "rev-3",
    name: "Sophia Laurent",
    review: "Customer service and delivery speed were impeccable. The 18k gold finish feels luxurious and timeless. I will definitely be returning.",
    rating: 5,
    location: "Paris, France",
  },
  {
    _id: "rev-4",
    name: "David Kensington",
    review: "The polished platinum wedding band has such a solid, premium weight on the finger. Perfectly sized and beautifully packaged.",
    rating: 5,
    location: "New York, USA",
  },
];

router.get("/", (req, res) => {
  res.json(reviews);
});

export default router;
