import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, Image, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Heart, ArrowRight } from "lucide-react-native";
import { api, type Product } from "@/lib/api";
import { productImage, CATEGORIES } from "@/lib/products";
import { useTheme } from "@/lib/theme";
import { useSession } from "@/lib/session";

export default function Shop() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { products } = await api.products({ category, q: query });
      setProducts(products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    const t = setTimeout(load, query ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  useEffect(() => {
    api.favorites().then(({ products }) => setFavorites(new Set(products.map((p) => p._id)))).catch(() => {});
  }, []);

  const toggleFavorite = async (id: string) => {
    setFavorites((f) => {
      const next = new Set(f);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      await api.toggleFavorite(id);
    } catch {}
  };

  const hero = products.find((p) => p.tag === "Flagship") ?? products[0];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pb-3 pt-6">
          <Text className="text-[12px] text-muted-foreground dark:text-dark-muted-foreground">
            Good {timeOfDay()},
          </Text>
          <Text className="text-[21px] font-sans-bold text-foreground dark:text-dark-foreground">
            {user?.fullName?.split(" ")[0] ? `Find your next upgrade, ${user.fullName.split(" ")[0]}.` : "Find your next upgrade."}
          </Text>
        </View>

        <View className="px-5">
          <View className="flex-row items-center gap-3 rounded-full border border-border bg-card px-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
            <Search size={16} color={colors.mutedForeground} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search gadgets"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 flex-1 text-[14px]"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {!query && category === "All" && hero ? (
          <Pressable
            onPress={() => router.push(`/product/${hero._id}`)}
            className="relative mx-5 mt-5 h-72 overflow-hidden rounded-[1.75rem] bg-primary dark:bg-dark-primary"
          >
            <LinearGradient
              colors={isDark ? ["#1e2a20", "transparent"] : ["#516f0055", "transparent"]}
              style={{ position: "absolute", inset: 0, height: 176 }}
            />
            <Image
              source={productImage(hero)}
              className="absolute -right-5 -top-4 h-60 w-60"
              resizeMode="contain"
              style={{ transform: [{ rotate: "-10deg" }] }}
            />
            <View className="absolute inset-x-0 bottom-0 p-5">
              <View className="self-start rounded-full bg-lime px-3 py-1 dark:bg-dark-lime">
                <Text className="text-[10px] font-sans-bold uppercase text-evergreen dark:text-dark-background">
                  New flagship
                </Text>
              </View>
              <Text className="mt-3 font-display text-[26px] leading-tight text-primary-foreground dark:text-dark-primary-foreground">
                Heavy on sound.{"\n"}Light on noise.
              </Text>
              <View className="mt-3 flex-row items-center gap-2">
                <Text className="text-[13px] font-sans-bold text-lime dark:text-dark-lime">
                  Meet the {hero.name}
                </Text>
                <ArrowRight size={16} color={isDark ? "#e8d998" : "#f4ec8f"} />
              </View>
            </View>
          </Pressable>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 4 }}
          className="mt-5"
        >
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: active ? colors.primary : "transparent",
                  borderWidth: active ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  className="text-[12px] font-sans-bold"
                  style={{ color: active ? colors.primaryForeground : colors.foreground }}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="px-5 pt-5">
          <View className="mb-3 flex-row items-end justify-between">
            <View>
              <Text className="text-[11px] font-sans-bold uppercase text-fern dark:text-dark-fern">
                Curated gear
              </Text>
              <Text className="text-[20px] font-sans-bold text-foreground dark:text-dark-foreground">
                Shop the collection
              </Text>
            </View>
            <Text className="text-[12px] text-muted-foreground dark:text-dark-muted-foreground">
              {products.length} items
            </Text>
          </View>

          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : products.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
                No gear found. Try another search.
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {products.map((product) => (
                <Pressable
                  key={product._id}
                  onPress={() => router.push(`/product/${product._id}`)}
                  style={{ width: "47.5%" }}
                  className="overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-sm dark:border-dark-border dark:bg-dark-card"
                >
                  <View className="relative aspect-square bg-muted dark:bg-dark-muted">
                    <Image source={productImage(product)} className="h-full w-full" resizeMode="cover" />
                    <Pressable
                      onPress={() => toggleFavorite(product._id)}
                      className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded-full bg-card dark:bg-dark-card"
                    >
                      <Heart
                        size={15}
                        color={colors.fern}
                        fill={favorites.has(product._id) ? colors.fern : "transparent"}
                      />
                    </Pressable>
                  </View>
                  <View className="p-3">
                    <Text className="text-[10px] font-sans-bold uppercase text-fern dark:text-dark-fern">
                      {product.tag}
                    </Text>
                    <Text className="mt-1 font-sans-bold text-foreground dark:text-dark-foreground" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text className="mt-1 text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
                      ${product.price}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
