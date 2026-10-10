import { useEffect, type ComponentProps } from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Home, ShoppingBag, LifeBuoy, User } from "lucide-react-native";
import { GlassSurface } from "@/components/GlassSurface";
import { useSession } from "@/lib/session";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme";

const TABS = [
  { name: "shop", label: "Shop", Icon: Home },
  { name: "cart", label: "Bag", Icon: ShoppingBag },
  { name: "support", label: "Support", Icon: LifeBuoy },
  { name: "profile", label: "You", Icon: User },
] as const;

type GlassTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

function GlassTabBar({ state, navigation }: GlassTabBarProps) {
  const { colors, isDark } = useTheme();
  const { count } = useCart();

  return (
    <View className="absolute inset-x-3 bottom-3">
      <GlassSurface
        intensity={isDark ? 55 : 40}
        className="flex-row rounded-[1.4rem] border p-2"
        style={{
          borderColor: colors.border,
          backgroundColor: isDark ? "rgba(20,31,23,0.55)" : "rgba(255,255,255,0.55)",
        }}
      >
        {state.routes.map((route, index) => {
          const meta = TABS.find((t) => t.name === route.name);
          if (!meta) return null;
          const focused = state.index === index;
          const Icon = meta.Icon;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="relative h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl"
              style={{ backgroundColor: focused ? (isDark ? "#e8d998" : "#0d380c") : "transparent" }}
            >
              <Icon size={16} color={focused ? (isDark ? "#0b120d" : "#f4ec8f") : colors.mutedForeground} />
              <Text
                className="text-[10px] font-sans-bold"
                style={{ color: focused ? (isDark ? "#0b120d" : "#f4ec8f") : colors.mutedForeground }}
              >
                {meta.label}
              </Text>
              {meta.name === "cart" && count > 0 && (
                <View className="absolute right-5 top-1.5 h-2 w-2 rounded-full bg-palm dark:bg-dark-palm" />
              )}
            </Pressable>
          );
        })}
      </GlassSurface>
    </View>
  );
}

export default function TabsLayout() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="shop"
    >
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="support" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
