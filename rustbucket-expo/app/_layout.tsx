import "../global.css";
import { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Outfit_700Bold, Outfit_600SemiBold } from "@expo-google-fonts/outfit";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { SessionProvider } from "@/lib/session";
import { CartProvider } from "@/lib/cart";

SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

function RootStack() {
  const { colors } = useTheme();
  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <ThemedStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="help" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="checkout/index" />
        <Stack.Screen name="checkout/success" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_700Bold,
    Outfit_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <SessionProvider>
        <CartProvider>
          <RootStack />
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
