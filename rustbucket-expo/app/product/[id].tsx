import { useState, useEffect } from "react";
import { View, Text, Pressable, Image, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Heart, Star, ShoppingBag } from "lucide-react-native";
import { api, type Product } from "@/lib/api";
import { productImage } from "@/lib/products";
import { GlassSurface } from "@/components/GlassSurface";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { add, count } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .product(id)
      .then(({ product }) => setProduct(product))
      .catch((e: any) => setError(e?.message || "Couldn't load this product"))
      .finally(() => setLoading(false));
    api
      .favorites()
      .then(({ products }) => setFavorite(products.some((p) => p._id === id)))
      .catch(() => {});
  }, [id, attempt]);

  const toggleFavorite = async () => {
    setFavorite((f) => !f);
    try {
      await api.toggleFavorite(id);
    } catch {}
  };

  const handleAdd = () => {
    if (!product) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!loading && !product) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8 dark:bg-dark-background">
        <Text className="text-center text-[14px] text-foreground dark:text-dark-foreground">
          {error || "This product isn't available."}
        </Text>
        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="rounded-full border border-border px-5 py-3 dark:border-dark-border"
          >
            <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">Go back</Text>
          </Pressable>
          <Pressable
            onPress={() => setAttempt((a) => a + 1)}
            className="rounded-full bg-primary px-5 py-3 dark:bg-dark-accent"
          >
            <Text className="text-[13px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              Try again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="relative h-[52vh] min-h-[420px] overflow-hidden rounded-b-[2.5rem] bg-secondary dark:bg-dark-secondary">
          <SafeAreaView edges={["top"]} className="absolute inset-x-5 top-2 z-10 flex-row justify-between">
            <RoundButton onPress={() => router.back()}>
              <ArrowLeft size={18} color={colors.foreground} />
            </RoundButton>
            <View className="flex-row gap-2">
              <RoundButton onPress={toggleFavorite}>
                <Heart size={18} color={colors.fern} fill={favorite ? colors.fern : "transparent"} />
              </RoundButton>
              <Pressable
                onPress={() => router.push("/cart")}
                className="relative h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm dark:bg-dark-card"
              >
                <ShoppingBag size={18} color={colors.foreground} />
                {count > 0 && (
                  <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-fern dark:bg-dark-fern">
                    <Text className="text-[9px] font-sans-bold text-primary-foreground">{count}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </SafeAreaView>

          <Image source={productImage(product)} className="h-full w-full" resizeMode="cover" />

          <GlassSurface intensity={40} className="absolute bottom-4 left-5 rounded-full border px-4 py-2" style={{ borderColor: colors.border }}>
            <Text className="text-[11px] font-sans-bold text-foreground dark:text-dark-foreground">
              Free express delivery
            </Text>
          </GlassSurface>
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-[11px] font-sans-bold uppercase text-fern dark:text-dark-fern">
                {product.category} · {product.tag}
              </Text>
              <Text className="mt-1 font-display text-[28px] leading-tight text-foreground dark:text-dark-foreground">
                {product.name}
              </Text>
            </View>
            <Text className="text-[19px] font-sans-bold text-foreground dark:text-dark-foreground">
              ${product.price}
            </Text>
          </View>

          <View className="mt-3 flex-row items-center gap-1.5">
            <Star size={14} color={colors.palm} fill={colors.palm} />
            <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
              {product.rating}
            </Text>
            <Text className="text-[12px] text-muted-foreground dark:text-dark-muted-foreground">
              ({product.reviewsCount} reviews)
            </Text>
          </View>

          <Text className="mt-4 text-[13px] leading-6 text-muted-foreground dark:text-dark-muted-foreground">
            {product.description}
          </Text>

          <View className="my-5 flex-row gap-2">
            {["2-year cover", "30-day returns", "Carbon neutral"].map((x) => (
              <View
                key={x}
                className="flex-1 rounded-xl bg-muted p-3 dark:bg-dark-muted"
              >
                <Text className="text-center text-[10px] font-sans-bold text-foreground dark:text-dark-foreground">
                  {x}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleAdd}
            className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5 dark:bg-dark-accent"
          >
            <ShoppingBag size={16} color={colors.primaryForeground} />
            <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              {added ? "Added to bag" : "Add to bag"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function RoundButton({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} className="h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm dark:bg-dark-card">
      {children}
    </Pressable>
  );
}
