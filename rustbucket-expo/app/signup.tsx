import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Mail, LockKeyhole, ArrowRight, ArrowLeft } from "lucide-react-native";
import { useSession } from "@/lib/session";
import { useTheme } from "@/lib/theme";

export default function Signup() {
  const router = useRouter();
  const { register } = useSession();
  const { colors, isDark } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await register(email.trim(), password, fullName.trim());
      router.replace("/shop");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 }}>
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
          >
            <ArrowLeft size={18} color={colors.foreground} />
          </Pressable>

          <Text className="mt-6 font-display text-[32px] leading-tight text-foreground dark:text-dark-foreground">
            Create your account
          </Text>
          <Text className="mt-2 text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
            Considered technology, built for every day.
          </Text>

          <View className="mt-7 gap-3">
            <Field icon={<User size={16} color={colors.mutedForeground} />} value={fullName} onChangeText={setFullName} placeholder="Full name" />
            <Field icon={<Mail size={16} color={colors.mutedForeground} />} value={email} onChangeText={setEmail} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" />
            <Field icon={<LockKeyhole size={16} color={colors.mutedForeground} />} value={password} onChangeText={setPassword} placeholder="Password (min. 6 characters)" secureTextEntry />

            {error ? <Text className="px-1 text-[12px] text-destructive dark:text-dark-destructive">{error}</Text> : null}

            <Pressable
              onPress={submit}
              disabled={busy || !fullName || !email || password.length < 6}
              className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 dark:bg-dark-accent"
              style={{ opacity: busy || !fullName || !email || password.length < 6 ? 0.5 : 1 }}
            >
              <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
                {busy ? "Creating account…" : "Create account"}
              </Text>
              <ArrowRight size={16} color={isDark ? "#0b120d" : "#f4ec8f"} />
            </Pressable>
          </View>

          <Pressable onPress={() => router.replace("/login")} className="mt-6 self-center">
            <Text className="text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
              Already a member? <Text className="font-sans-bold text-accent dark:text-dark-fern">Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  icon,
  ...inputProps
}: { icon: React.ReactNode } & React.ComponentProps<typeof TextInput>) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 dark:border-dark-border dark:bg-dark-card">
      {icon}
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        className="h-13 flex-1 py-3.5 text-[14px]"
        style={{ color: colors.foreground }}
        {...inputProps}
      />
    </View>
  );
}
