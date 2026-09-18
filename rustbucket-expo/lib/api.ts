import Constants from "expo-constants";
import { getToken } from "./auth";

// Where the backend lives.
//  - EXPO_PUBLIC_API_BASE_URL set (EAS builds, or a manual override): use it.
//  - Otherwise, in development: reuse the IP your phone already used to reach
//    Metro (e.g. "10.178.72.244:8081"), swapped to the backend's port. The
//    computer's IP changes between networks; this way it never goes stale.
function resolveApiBaseUrl() {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const port = process.env.EXPO_PUBLIC_API_PORT || "3001";
  const hostUri = Constants.expoConfig?.hostUri; // "10.178.72.244:8081"
  const host = hostUri?.split(":")[0];
  return `http://${host || "localhost"}:${port}/api`;
}

export const API_BASE_URL = resolveApiBaseUrl();

if (__DEV__) {
  console.log(`[api] Using backend at ${API_BASE_URL}`);
}

// A hosted backend on a free tier (e.g. Render) sleeps when idle and can take
// 30-50s to wake. Long enough to survive that, short enough that a dead
// server doesn't leave a spinner running forever. In development the backend
// is on your own computer, so anything past 15s means it isn't reachable.
const REQUEST_TIMEOUT_MS = __DEV__ ? 15_000 : 60_000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Set by SessionProvider: called when a signed-in request comes back 401
// (token expired or revoked), so the app signs out instead of failing
// silently on every screen.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let sentToken = false;
  if (options.auth !== false) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      sentToken = true;
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      if (__DEV__) {
        throw new ApiError(
          `No response from ${API_BASE_URL}. Is the backend running, and is your phone on the same Wi-Fi?`,
          0,
        );
      }
      throw new ApiError("The server is taking too long to respond. Please try again.", 0);
    }
    if (__DEV__) console.warn(`[api] ${options.method || "GET"} ${API_BASE_URL}${path} failed:`, e?.message);
    throw new ApiError("Couldn't reach Rust Bucket. Check your connection and try again.", 0);
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && sentToken) onUnauthorized?.();
    throw new ApiError(data.message || `Request failed (${response.status})`, response.status);
  }
  return data as T;
}

export type AuthUser = { id: string; email: string; fullName: string };
export type AuthResponse = { token: string; user: AuthUser };

export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageKey?: string;
  imageUrl?: string;
  tag: string;
  description: string;
  rating: number;
  reviewsCount: number;
};

export type OrderItem = { product: string; name: string; price: number; quantity: number };
export type DeliveryAddress = { fullName?: string; street?: string; city?: string; postcode?: string };
export type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: DeliveryAddress;
  cardLast4: string;
  status: "confirmed" | "packed" | "dispatched" | "delivered";
  createdAt: string;
};

export const api = {
  health: () => request<{ ok: boolean }>("/health", { auth: false }),

  // -- Auth --
  register: (email: string, password: string, fullName: string) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: { email, password, fullName }, auth: false }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  forgotPassword: (email: string) =>
    request<{ message: string; devResetCode?: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),
  resetPassword: (email: string, code: string, newPassword: string) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: { email, code, newPassword },
      auth: false,
    }),

  // -- Products --
  products: (params?: { category?: string; q?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category && params.category !== "All") qs.set("category", params.category);
    if (params?.q) qs.set("q", params.q);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<{ products: Product[] }>(`/products${suffix}`, { auth: false });
  },
  product: (id: string) => request<{ product: Product }>(`/products/${id}`, { auth: false }),

  // -- Favorites --
  favorites: () => request<{ products: Product[] }>("/favorites"),
  toggleFavorite: (productId: string) =>
    request<{ favorited: boolean }>(`/favorites/${productId}`, { method: "POST" }),

  // -- Orders --
  createOrder: (
    items: { productId: string; quantity: number }[],
    deliveryAddress: DeliveryAddress,
    cardLast4: string,
  ) =>
    request<{ order: Order }>("/orders", {
      method: "POST",
      body: { items, deliveryAddress, cardLast4 },
    }),
  myOrders: () => request<{ orders: Order[] }>("/orders"),
};
