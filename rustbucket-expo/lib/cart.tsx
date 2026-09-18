import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "./api";

type CartContextValue = {
  cart: Record<string, { product: Product; quantity: number }>;
  count: number;
  total: number;
  add: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartContextValue["cart"]>({});

  const add = (product: Product) => {
    setCart((c) => {
      const existing = c[product._id];
      return {
        ...c,
        [product._id]: { product, quantity: (existing?.quantity ?? 0) + 1 },
      };
    });
  };

  const setQuantity = (productId: string, quantity: number) => {
    setCart((c) => {
      if (quantity < 1) return c;
      const existing = c[productId];
      if (!existing) return c;
      return { ...c, [productId]: { ...existing, quantity } };
    });
  };

  const remove = (productId: string) => {
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });
  };

  const clear = () => setCart({});

  const items = Object.values(cart);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider value={{ cart, count, total, add, setQuantity, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
