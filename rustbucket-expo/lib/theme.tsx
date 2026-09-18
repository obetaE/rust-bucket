import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "rustbucket:theme";

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  border: string;
  fern: string;
  palm: string;
  lime: string;
  glassTint: "light" | "dark";
};

// Color values for places that can't take a className — icon colors,
// BlurView tint, StatusBar style. Keep these in sync with tailwind.config.js.
export const palette: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: "#fdf6e4",
    foreground: "#0b290a",
    card: "#fffdf9",
    primary: "#0d380c",
    primaryForeground: "#f4ec8f",
    muted: "#f1ebd5",
    mutedForeground: "#596855",
    accent: "#91a33b",
    border: "#d4d3b9",
    fern: "#516f00",
    palm: "#a6a442",
    lime: "#f4ec8f",
    glassTint: "light",
  },
  dark: {
    background: "#0b120d",
    foreground: "#eef2df",
    card: "#141f17",
    primary: "#16281a",
    primaryForeground: "#e8d998",
    muted: "#1a241c",
    mutedForeground: "#9aa693",
    accent: "#7a9a4a",
    border: "rgba(255,255,255,0.09)",
    fern: "#8fae4a",
    palm: "#b8a86a",
    lime: "#e8d998",
    glassTint: "dark",
  },
};

type ThemeContextValue = {
  preference: ThemePreference;
  isDark: boolean;
  colors: ThemeColors;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(STORAGE_KEY)) as ThemePreference | null;
      if (saved) {
        setPreferenceState(saved);
        setColorScheme(saved);
      }
      setReady(true);
    })();
  }, [setColorScheme]);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    setColorScheme(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  };

  const isDark = colorScheme === "dark";

  if (!ready) return null;

  return (
    <ThemeContext.Provider
      value={{
        preference,
        isDark,
        colors: isDark ? palette.dark : palette.light,
        setPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
