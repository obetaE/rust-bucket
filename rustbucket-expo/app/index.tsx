import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Rect, Path, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useSession } from "@/lib/session";
import { useTheme } from "@/lib/theme";

function Mark({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect width={64} height={64} rx={18} fill="#132a13" />
      <Path
        d="M18 18h18c9 0 14 4 14 11 0 4-2 7-6 9l7 10H39l-5-8h-5v8H18V18Zm11 9v6h7c2 0 3-1 3-3s-1-3-3-3h-7Z"
        fill="#ecf39e"
      />
      <Circle cx={49} cy={16} r={5} fill="#90a955" />
    </Svg>
  );
}

export default function Splash() {
  const router = useRouter();
  const { user, loading } = useSession();
  const { isDark } = useTheme();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const tagOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.back(1.2)) });
    tagOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, [opacity, scale, tagOpacity]);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      router.replace(user ? "/shop" : "/login");
    }, 1300);
    return () => clearTimeout(t);
  }, [loading, user, router]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));

  return (
    <View
      className="flex-1 items-center justify-center bg-primary dark:bg-dark-background"
      style={{ backgroundColor: isDark ? "#0b120d" : "#0d380c" }}
    >
      <Animated.View style={logoStyle} className="items-center">
        <Mark size={76} />
        <Text className="mt-5 font-display text-[30px] text-lime dark:text-dark-lime">
          rust bucket
        </Text>
      </Animated.View>
      <Animated.Text
        style={tagStyle}
        className="absolute bottom-16 text-[11px] font-sans-semibold uppercase tracking-[3px] text-palm dark:text-dark-palm"
      >
        Technology with staying power
      </Animated.Text>
    </View>
  );
}
