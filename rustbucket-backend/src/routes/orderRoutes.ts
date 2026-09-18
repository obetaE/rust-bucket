import express from "express";
import mongoose from "mongoose";
import Product from "../lib/models/Product.ts";
import Order, { type DeliveryAddress } from "../lib/models/Order.ts";
import protectRoute from "../middleware/auth.middleware.ts";

const router = express.Router();

// POST /api/orders — checkout. Body: { items: [{ productId, quantity }],
// deliveryAddress, cardLast4 }. Prices are looked up server-side from the
// current catalog, never trusted from the client, so nobody can submit a
// fake total.
router.post("/", protectRoute, async (req, res) => {
  try {
    const { items, deliveryAddress, cardLast4 } = req.body as {
      items: { productId: string; quantity: number }[];
      deliveryAddress?: DeliveryAddress;
      cardLast4?: string;
    };

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const valid = items.every(
      (i) =>
        mongoose.isValidObjectId(i?.productId) &&
        Number.isInteger(i?.quantity) &&
        i.quantity >= 1 &&
        i.quantity <= 99,
    );
    if (!valid) {
      return res.status(400).json({ message: "Some items in your bag are invalid" });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    const missing = items.find((i) => !byId.has(i.productId));
    if (missing) {
      return res.status(400).json({ message: "An item in your bag is no longer available" });
    }

    const orderItems = items.map((i) => {
      const product = byId.get(i.productId)!;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
      };
    });

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      deliveryAddress,
      cardLast4: String(cardLast4 ?? "").replace(/\D/g, "").slice(-4),
    });

    res.status(201).json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders — this user's order history
router.get("/", protectRoute, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
