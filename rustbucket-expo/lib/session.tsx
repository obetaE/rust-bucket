import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setUnauthorizedHandler, type AuthUser } from "./api";
import { saveSession, getToken, getStoredUser, clearSession } from "./auth";

type SessionContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // A storage failure must never leave the app stuck on "loading" —
      // worst case, the user just has to sign in again.
      try {
        const token = await getToken();
        const storedUser = await getStoredUser();
        if (token && storedUser) setUser(storedUser);
      } catch (e) {
        console.warn("[session] Couldn't restore saved sign-in:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // An expired or revoked token signs the user out; the (tabs) layout then
  // sends them back to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession().finally(() => setUser(null));
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    await saveSession(token, user);
    setUser(user);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const { token, user } = await api.register(email, password, fullName);
    await saveSession(token, user);
    setUser(user);
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
