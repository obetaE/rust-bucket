import { BlurView } from "expo-blur";
import type { ViewProps } from "react-native";
import { useTheme } from "@/lib/theme";

// The one glass effect used everywhere — the bottom nav, floating toasts,
// the delivery badge on the product image, the login card. expo-blur is used
// over expo-glass-effect because the latter is iOS-only (Apple's native
// Liquid Glass material).
//
// On Android, BlurView renders as a translucent tint unless the experimental
// Dimezis renderer is switched on. That renderer is deliberately NOT used: it
// can blank out screens pushed on top of it. Where a real blur matters (the
// login backdrop), blur the image itself with `blurRadius` instead.
export function GlassSurface({
  children,
  className,
  intensity = 40,
  tint,
  style,
  ...rest
}: ViewProps & { intensity?: number; tint?: "light" | "dark" }) {
  const { isDark } = useTheme();
  return (
    <BlurView
      intensity={intensity}
      tint={tint ?? (isDark ? "dark" : "light")}
      style={[{ overflow: "hidden" }, style]}
      className={className}
      {...rest}
    >
      {children}
    </BlurView>
  );
}
