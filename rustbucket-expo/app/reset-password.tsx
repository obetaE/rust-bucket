import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole } from "lucide-react-native";
import { api } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function ResetPassword() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState(emailParam ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.resetPassword(email.trim(), code.trim(), newPassword);
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-8 dark:bg-dark-background">
        <Text className="text-center font-display text-[26px] text-foreground dark:text-dark-foreground">
          Password updated
        </Text>
        <Text className="mt-2 text-center text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
          You can now sign in with your new password.
        </Text>
        <Pressable
          onPress={() => router.replace("/login")}
          className="mt-6 flex-row items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 dark:bg-dark-accent"
        >
          <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
            Back to sign in
          </Text>
          <ArrowRight size={16} color={isDark ? "#0b120d" : "#f4ec8f"} />
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6 dark:bg-dark-background">
      <Pressable
        onPress={() => router.back()}
        className="mt-2 h-11 w-11 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
      >
        <ArrowLeft size={18} color={colors.foreground} />
      </Pressable>

      <Text className="mt-6 font-display text-[28px] leading-tight text-foreground dark:text-dark-foreground">
        Enter your code
      </Text>
      <Text className="mt-2 text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
        Codes expire after 15 minutes.
      </Text>

      <View className="mt-6 gap-3">
        <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 dark:border-dark-border dark:bg-dark-card">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            keyboardType="email-address"
            className="h-13 flex-1 py-3.5 text-[14px]"
            style={{ color: colors.foreground }}
          />
        </View>
        <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 dark:border-dark-border dark:bg-dark-card">
          <KeyRound size={16} color={colors.mutedForeground} />
          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="6-character code"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            maxLength={6}
            className="h-13 flex-1 py-3.5 text-[14px] tracking-[3px]"
            style={{ color: colors.foreground }}
          />
        </View>
        <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 dark:border-dark-border dark:bg-dark-card">
          <LockKeyhole size={16} color={colors.mutedForeground} />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            className="h-13 flex-1 py-3.5 text-[14px]"
            style={{ color: colors.foreground }}
          />
        </View>

        {error ? <Text className="px-1 text-[12px] text-destructive dark:text-dark-destructive">{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={busy || !email || code.length !== 6 || newPassword.length < 6}
          className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 dark:bg-dark-accent"
          style={{ opacity: busy || !email || code.length !== 6 || newPassword.length < 6 ? 0.5 : 1 }}
        >
          <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
            {busy ? "Updating…" : "Update password"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
