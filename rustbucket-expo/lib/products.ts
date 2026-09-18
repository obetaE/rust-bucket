import type { ImageSourcePropType } from "react-native";
import type { Product } from "./api";

// Products carry either an imageKey — one of the renders bundled with the
// app — or an imageUrl pointing at a remote photo. These map both to
// something <Image source> accepts.
export const productImages: Record<string, number> = {
  headphones: require("../assets/products/rust-bucket-headphones.png"),
  earbuds: require("../assets/products/rust-bucket-earbuds.png"),
  speaker: require("../assets/products/rust-bucket-speaker.png"),
  phone: require("../assets/products/rust-bucket-phone.png"),
  watch: require("../assets/products/rust-bucket-watch.png"),
  laptop: require("../assets/products/rust-bucket-laptop.png"),
};

export function imageForKey(key: string) {
  return productImages[key] ?? productImages.headphones;
}

export function productImage(product: Pick<Product, "imageKey" | "imageUrl">): ImageSourcePropType {
  if (product.imageKey && productImages[product.imageKey]) return productImages[product.imageKey];
  if (product.imageUrl) return { uri: product.imageUrl };
  return productImages.headphones;
}

/** True when the product uses a bundled render (transparent studio shot). */
export function hasBundledImage(product: Pick<Product, "imageKey">) {
  return Boolean(product.imageKey && productImages[product.imageKey]);
}

export const CATEGORIES = [
  "All",
  "Phones",
  "Computers",
  "Wearables",
  "Headphones",
  "Earbuds",
  "Speakers",
  "Accessories",
] as const;
