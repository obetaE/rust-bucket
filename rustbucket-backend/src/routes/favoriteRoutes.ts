import express from "express";
import mongoose from "mongoose";
import User from "../lib/models/User.ts";
import Product from "../lib/models/Product.ts";
import protectRoute from "../middleware/auth.middleware.ts";

const router = express.Router();

// GET /api/favorites — this user's favorited products
router.get("/", protectRoute, async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.favoriteProductIds } });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/favorites/:productId — toggles a product in this user's favorites
router.post("/:productId", protectRoute, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    const already = user!.favoriteProductIds.some(
      (id: mongoose.Types.ObjectId) => id.toString() === productId,
    );

    if (already) {
      user!.favoriteProductIds = user!.favoriteProductIds.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== productId,
      );
    } else {
      user!.favoriteProductIds.push(product._id as any);
    }
    await user!.save();

    res.json({ favorited: !already });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
