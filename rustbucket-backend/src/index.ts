import express from "express";
import "dotenv/config";
import cors from "cors";
import { networkInterfaces } from "node:os";

import authRoutes from "./routes/authRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import favoriteRoutes from "./routes/favoriteRoutes.ts";
import orderRoutes from "./routes/orderRoutes.ts";
import { connectDB } from "./lib/config/db.ts";
import { syncCatalog } from "./lib/catalog.ts";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

// One line per request once it finishes — e.g. "POST /api/auth/register 201 84ms".
app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
});

// GET /api/health — public, no auth. Lets the app (and you) check the server
// is awake before making real requests; Render's free tier sleeps when idle.
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Rust Bucket backend running on port ${PORT}`);
  // The addresses a phone on the same Wi-Fi can use to reach this server.
  for (const addrs of Object.values(networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family === "IPv4" && !a.internal && !a.address.startsWith("169.254.")) {
        console.log(`  → http://${a.address}:${PORT}/api/health`);
      }
    }
  }
  connectDB()
    .then(syncCatalog)
    .then(({ added, total }) => {
      console.log(`Catalogue ready: ${total} products${added.length ? ` (${added.length} new)` : ""}`);
    })
    .catch((error) => console.error("Couldn't sync the product catalogue:", error));
});
