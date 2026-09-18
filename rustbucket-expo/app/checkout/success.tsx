import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Box } from "lucide-react-native";
import { useTheme } from "@/lib/theme";

export default function CheckoutSuccess() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-primary px-8 dark:bg-dark-background"
      style={{ backgroundColor: isDark ? "#0b120d" : "#0d380c" }}
    >
      <View className="h-24 w-24 items-center justify-center rounded-full bg-lime dark:bg-dark-lime">
        <Check size={40} color={isDark ? "#0b120d" : "#0d380c"} />
      </View>
      <Text className="mt-8 text-[11px] font-sans-bold uppercase text-palm dark:text-dark-palm">
        Order confirmed
      </Text>
      <Text className="mt-2 text-center font-display text-[32px] leading-tight text-lime dark:text-dark-lime">
        Your gear is on the way.
      </Text>
      <Text className="mt-4 text-center text-[13px] leading-6 text-palm dark:text-dark-palm">
        Your order is confirmed and arrives in 2–3 business days.
      </Text>

      <View className="my-8 w-full flex-row items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
        <Box size={22} color={isDark ? "#e8d998" : "#f4ec8f"} />
        <View>
          <Text className="text-[13px] font-sans-bold text-lime dark:text-dark-lime">Order confirmed</Text>
          <Text className="text-[11px] text-palm dark:text-dark-palm">Next: Packed and dispatched</Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace("/shop")}
        className="w-full items-center rounded-full bg-lime py-3.5 dark:bg-dark-lime"
      >
        <Text className="text-[14px] font-sans-bold text-evergreen dark:text-dark-background">
          Keep browsing
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
