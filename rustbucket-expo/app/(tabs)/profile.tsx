import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PackageCheck, LifeBuoy, ChevronRight, Sun, Moon, SmartphoneNfc } from "lucide-react-native";
import { useSession } from "@/lib/session";
import { useTheme } from "@/lib/theme";
import { api, type Order } from "@/lib/api";
import { DeveloperCard } from "@/components/DeveloperCard";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useSession();
  const { colors, preference, setPreference } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.myOrders().then(({ orders }) => setOrders(orders)).catch(() => {});
  }, []);

  const initials = (user?.fullName || "You")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text className="text-center font-sans-bold text-[17px] text-foreground dark:text-dark-foreground">
          Your account
        </Text>

        <View className="mt-7 flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary dark:bg-dark-accent">
            <Text className="text-[18px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              {initials}
            </Text>
          </View>
          <View>
            <Text className="text-[19px] font-sans-bold text-foreground dark:text-dark-foreground">
              {user?.fullName}
            </Text>
            <Text className="text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <Text className="mt-8 text-[12px] font-sans-bold uppercase tracking-wide text-fern dark:text-dark-fern">
          Appearance
        </Text>
        <View className="mt-3 flex-row gap-2 rounded-2xl border border-border bg-card p-1.5 dark:border-dark-border dark:bg-dark-card">
          {(
            [
              { key: "light", label: "Light", Icon: Sun },
              { key: "dark", label: "Dark", Icon: Moon },
              { key: "system", label: "Auto", Icon: SmartphoneNfc },
            ] as const
          ).map(({ key, label, Icon }) => {
            const active = preference === key;
            return (
              <Pressable
                key={key}
                onPress={() => setPreference(key)}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5"
                style={{ backgroundColor: active ? colors.primary : "transparent" }}
              >
                <Icon size={14} color={active ? colors.primaryForeground : colors.mutedForeground} />
                <Text
                  className="text-[12px] font-sans-bold"
                  style={{ color: active ? colors.primaryForeground : colors.mutedForeground }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Orders */}
        <Text className="mt-8 text-[12px] font-sans-bold uppercase tracking-wide text-fern dark:text-dark-fern">
          Orders
        </Text>
        <View className="mt-3 gap-2">
          {orders.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-border p-4 dark:border-dark-border">
              <Text className="text-[12px] text-muted-foreground dark:text-dark-muted-foreground">
                No orders yet.
              </Text>
            </View>
          ) : (
            orders.slice(0, 3).map((order) => (
              <View
                key={order._id}
                className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 dark:border-dark-border dark:bg-dark-card"
              >
                <PackageCheck size={18} color={colors.fern} />
                <View className="min-w-0 flex-1">
                  <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} · ${order.total}
                  </Text>
                  <Text className="text-[11px] capitalize text-muted-foreground dark:text-dark-muted-foreground">
                    {order.status}
                  </Text>
                </View>
              </View>
            ))
          )}
          <Pressable
            onPress={() => router.push("/help")}
            accessibilityRole="button"
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 dark:border-dark-border dark:bg-dark-card"
          >
            <LifeBuoy size={18} color={colors.fern} />
            <Text className="flex-1 text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
              Warranty & repairs
            </Text>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* About the developer */}
        <Text className="mt-8 text-[12px] font-sans-bold uppercase tracking-wide text-fern dark:text-dark-fern">
          About
        </Text>
        <View className="mt-3">
          <DeveloperCard />
        </View>

        <Pressable
          onPress={handleSignOut}
          className="mt-8 items-center rounded-full border border-border bg-secondary py-3.5 dark:border-dark-border dark:bg-dark-secondary"
        >
          <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
