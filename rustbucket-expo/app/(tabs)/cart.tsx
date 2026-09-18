import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react-native";
import { useCart } from "@/lib/cart";
import { productImage, hasBundledImage } from "@/lib/products";
import { useTheme } from "@/lib/theme";

export default function Cart() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cart, total, setQuantity, remove } = useCart();
  const items = Object.values(cart);

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-6 dark:bg-dark-background" edges={["top"]}>
      <Text className="text-center font-sans-bold text-[17px] text-foreground dark:text-dark-foreground">
        Your bag
      </Text>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <ShoppingBag size={44} color={colors.mutedForeground} />
          <Text className="mt-4 font-sans-bold text-[19px] text-foreground dark:text-dark-foreground">
            Your bag is quiet
          </Text>
          <Text className="mt-1 text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
            Add some sound to get started.
          </Text>
          <Pressable
            onPress={() => router.push("/shop")}
            className="mt-6 rounded-full bg-primary px-6 py-3 dark:bg-dark-accent"
          >
            <Text className="text-[13px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              Browse gear
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView className="mt-5" contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            {items.map(({ product, quantity }) => (
              <View
                key={product._id}
                className="flex-row gap-3 rounded-2xl border border-border bg-card p-3 dark:border-dark-border dark:bg-dark-card"
              >
                <Image
                  source={productImage(product)}
                  className="h-[88px] w-[88px] rounded-xl bg-muted dark:bg-dark-muted"
                  resizeMode={hasBundledImage(product) ? "contain" : "cover"}
                />
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="min-w-0 flex-1">
                      <Text className="text-[11px] text-fern dark:text-dark-fern">{product.category}</Text>
                      <Text className="font-sans-bold text-foreground dark:text-dark-foreground" numberOfLines={1}>
                        {product.name}
                      </Text>
                    </View>
                    <Pressable onPress={() => remove(product._id)} hitSlop={8}>
                      <X size={16} color={colors.mutedForeground} />
                    </Pressable>
                  </View>
                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="font-sans-bold text-foreground dark:text-dark-foreground">
                      ${product.price}
                    </Text>
                    <View className="flex-row items-center gap-3 rounded-full bg-muted px-2 py-1 dark:bg-dark-muted">
                      <Pressable onPress={() => setQuantity(product._id, quantity - 1)} hitSlop={6}>
                        <Minus size={13} color={colors.foreground} />
                      </Pressable>
                      <Text className="text-[12px] font-sans-bold text-foreground dark:text-dark-foreground">
                        {quantity}
                      </Text>
                      <Pressable onPress={() => setQuantity(product._id, quantity + 1)} hitSlop={6}>
                        <Plus size={13} color={colors.foreground} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="border-t border-border pb-28 pt-4 dark:border-dark-border">
            <View className="flex-row justify-between py-1">
              <Text className="text-[13px] text-muted-foreground dark:text-dark-muted-foreground">Subtotal</Text>
              <Text className="font-sans-bold text-foreground dark:text-dark-foreground">${total}</Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-[13px] text-muted-foreground dark:text-dark-muted-foreground">Delivery</Text>
              <Text className="font-sans-bold text-fern dark:text-dark-fern">Free</Text>
            </View>
            <View className="mt-2 flex-row justify-between border-t border-border py-3 dark:border-dark-border">
              <Text className="text-[17px] font-sans-bold text-foreground dark:text-dark-foreground">Total</Text>
              <Text className="text-[17px] font-sans-bold text-foreground dark:text-dark-foreground">${total}</Text>
            </View>
            <Pressable
              onPress={() => router.push("/checkout")}
              className="mt-2 flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5 dark:bg-dark-accent"
            >
              <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
                Secure checkout
              </Text>
              <ArrowRight size={16} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
