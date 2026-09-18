import express from "express";
import mongoose from "mongoose";
import Product from "../lib/models/Product.ts";

const router = express.Router();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/products?category=Headphones&q=forge — the catalog, filterable.
// Public — browsing the shop doesn't require an account.
router.get("/", async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter: Record<string, unknown> = {};
    if (category && category !== "All") filter.category = category;
    // Escape the search term so characters like "(" or "+" are matched
    // literally instead of breaking (or slowing down) the regex.
    if (q) filter.name = { $regex: escapeRegex(String(q)), $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: 1 });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
