import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SecureStore keys may only contain letters, numbers, ".", "-" and "_".
const TOKEN_KEY = "rustbucket.token";
const USER_KEY = "rustbucket.user";

export type StoredUser = { id: string; email: string; fullName: string };

// The device keychain on iOS/Android. SecureStore doesn't exist on web, so
// the web build falls back to AsyncStorage (localStorage) — fine for a
// preview, never where real credentials live.
const storage =
  Platform.OS === "web"
    ? {
        get: (key: string) => AsyncStorage.getItem(key),
        set: (key: string, value: string) => AsyncStorage.setItem(key, value),
        remove: (key: string) => AsyncStorage.removeItem(key),
      }
    : {
        get: (key: string) => SecureStore.getItemAsync(key),
        set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        remove: (key: string) => SecureStore.deleteItemAsync(key),
      };

export async function saveSession(token: string, user: StoredUser) {
  await storage.set(TOKEN_KEY, token);
  await storage.set(USER_KEY, JSON.stringify(user));
}

export async function getToken() {
  return storage.get(TOKEN_KEY);
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const raw = await storage.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearSession() {
  await storage.remove(TOKEN_KEY);
  await storage.remove(USER_KEY);
}
