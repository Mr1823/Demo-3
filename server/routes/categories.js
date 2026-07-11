import express from "express";

const router = express.Router();

const categories = [
  { _id: "cat-1", categoryName: "Rings", categoryPic: "/img/categories/1.jpg" },
  { _id: "cat-2", categoryName: "Necklaces", categoryPic: "/img/categories/2.jpg" },
  { _id: "cat-3", categoryName: "Earrings", categoryPic: "/img/categories/3.jpg" },
  { _id: "cat-4", categoryName: "Bracelets", categoryPic: "/img/categories/4.jpg" },
  { _id: "cat-5", categoryName: "Pendants", categoryPic: "/img/categories/5.jpg" },
  { _id: "cat-6", categoryName: "Charms", categoryPic: "/img/categories/6.jpg" },
  { _id: "cat-7", categoryName: "Bangles", categoryPic: "/img/categories/7.jpg" },
  { _id: "cat-8", categoryName: "Bridal Sets", categoryPic: "/img/categories/8.jpg" },
];

router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
