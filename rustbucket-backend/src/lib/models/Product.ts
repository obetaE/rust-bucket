import mongoose from "mongoose";

// imageKey maps to an asset already bundled in the Expo app (see
// lib/products.ts on the frontend) — the backend doesn't host images,
// since these are fixed product renders shipped with the app itself, not
// user uploads.
export const IMAGE_KEYS = [
  "headphones",
  "earbuds",
  "speaker",
  "phone",
  "watch",
  "laptop",
] as const;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Headphones", "Earbuds", "Speakers", "Phones", "Wearables", "Computers", "Accessories"],
    },
    price: { type: Number, required: true },
    // Either a bundled render (imageKey) or a remote photo (imageUrl).
    imageKey: { type: String, enum: [...IMAGE_KEYS, ""], default: "" },
    imageUrl: { type: String, default: "" },
    tag: { type: String, default: "" },
    description: { type: String, default: "" },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.pre("validate", function () {
  if (!this.imageKey && !this.imageUrl) {
    this.invalidate("imageKey", "A product needs an imageKey or an imageUrl");
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
