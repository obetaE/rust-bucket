import { useState } from "react";
import { View, Text, Pressable, TextInput, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, LockKeyhole, ArrowRight } from "lucide-react-native";
import { GlassSurface } from "@/components/GlassSurface";
import { useSession } from "@/lib/session";
import { useTheme } from "@/lib/theme";

const headphones = require("../assets/products/rust-bucket-headphones.png");

// The login screen is always a dark, glassy surface. Light mode keeps the
// brand green but pushed deeper than the app's usual primary, so the glass
// card and lime type read cleanly on top of it.
const SURFACES = {
  // The product photo has a pale studio background, so the tint has to be
  // strong for the screen to stay dark once it's blurred.
  light: { base: "#051a07", tint: "rgba(6,34,9,0.8)", glow: "rgba(244,236,143,0.16)" },
  dark: { base: "#070c08", tint: "rgba(7,12,8,0.84)", glow: "rgba(232,217,152,0.12)" },
};

export default function Login() {
  const router = useRouter();
  const { login } = useSession();
  const { isDark, colors } = useTheme();
  const surface = isDark ? SURFACES.dark : SURFACES.light;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace("/shop");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const disabled = busy || !email || !password;

  return (
    <View className="flex-1" style={{ backgroundColor: surface.base }}>
      {/* Full-bleed blurred backdrop, then a tint that deepens towards the form */}
      <Image source={headphones} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={40} />
      <LinearGradient
        colors={[surface.tint, surface.tint, surface.base]}
        locations={[0, 0.45, 0.92]}
        style={StyleSheet.absoluteFill}
      />

      {/* Hero product, centred */}
      <View className="h-[42%] w-full items-center justify-center">
        <View
          className="absolute h-64 w-64 rounded-full"
          style={{ backgroundColor: surface.glow, transform: [{ scale: 1.1 }] }}
        />
        <Image source={headphones} className="h-[82%] w-[82%]" resizeMode="contain" />
      </View>

      <SafeAreaView edges={["bottom"]} className="flex-1 justify-end px-6 pb-8">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Text className="text-[11px] font-sans-bold uppercase tracking-[3px] text-palm dark:text-dark-palm">
            Sound, made substantial.
          </Text>
          <Text className="mt-2 font-display text-[36px] leading-[40px] text-lime dark:text-dark-lime">
            Welcome to{"\n"}Rust Bucket.
          </Text>

          <GlassSurface
            intensity={50}
            tint="dark"
            className="mt-7 rounded-[28px] p-4"
            style={{
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <View className="gap-3">
              <GlassInput icon={<Mail size={16} color={colors.lime} />}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="rgba(244,236,143,0.45)"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  className="h-12 flex-1 text-[14px]"
                  style={{ color: colors.lime }}
                />
              </GlassInput>
              <GlassInput icon={<LockKeyhole size={16} color={colors.lime} />}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="rgba(244,236,143,0.45)"
                  secureTextEntry
                  autoComplete="password"
                  className="h-12 flex-1 text-[14px]"
                  style={{ color: colors.lime }}
                />
              </GlassInput>

              {error ? <Text className="px-1 text-[12px] text-[#ff8a80]">{error}</Text> : null}

              <Pressable onPress={() => router.push("/forgot-password")} className="self-end" hitSlop={8}>
                <Text className="text-[12px] font-sans-medium text-palm dark:text-dark-palm">
                  Forgot password?
                </Text>
              </Pressable>

              <Pressable
                onPress={submit}
                disabled={disabled}
                className="mt-1 flex-row items-center justify-center gap-2 rounded-2xl bg-lime py-3.5 dark:bg-dark-lime"
                style={{ opacity: disabled ? 0.5 : 1 }}
              >
                <Text className="text-[14px] font-sans-bold text-evergreen dark:text-dark-background">
                  {busy ? "Signing in…" : "Sign in"}
                </Text>
                <ArrowRight size={16} color={isDark ? "#0b120d" : "#0b290a"} />
              </Pressable>
            </View>
          </GlassSurface>

          <Pressable onPress={() => router.push("/signup")} className="mt-5 self-center" hitSlop={8}>
            <Text className="text-[13px] text-palm dark:text-dark-palm">
              New here? <Text className="font-sans-bold text-lime dark:text-dark-lime">Create an account</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function GlassInput({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl px-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.07)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      }}
    >
      {icon}
      {children}
    </View>
  );
}
