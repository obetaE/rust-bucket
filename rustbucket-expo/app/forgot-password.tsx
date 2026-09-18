import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, ArrowLeft, ArrowRight, MailCheck } from "lucide-react-native";
import { api } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.forgotPassword(email.trim());
      setSent(true);
      setDevCode(res.devResetCode ?? null);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 dark:bg-dark-background">
      <Pressable
        onPress={() => router.back()}
        className="mt-2 h-11 w-11 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
      >
        <ArrowLeft size={18} color={colors.foreground} />
      </Pressable>

      {!sent ? (
        <>
          <Text className="mt-6 font-display text-[30px] leading-tight text-foreground dark:text-dark-foreground">
            Reset your password
          </Text>
          <Text className="mt-2 text-[13px] leading-5 text-muted-foreground dark:text-dark-muted-foreground">
            Enter the email on your account and we&apos;ll send a 6-character code to reset your password.
          </Text>

          <View className="mt-7 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 dark:border-dark-border dark:bg-dark-card">
            <Mail size={16} color={colors.mutedForeground} />
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

          {error ? <Text className="mt-3 px-1 text-[12px] text-destructive dark:text-dark-destructive">{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={busy || !email}
            className="mt-5 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 dark:bg-dark-accent"
            style={{ opacity: busy || !email ? 0.5 : 1 }}
          >
            <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              {busy ? "Sending…" : "Send reset code"}
            </Text>
            <ArrowRight size={16} color={isDark ? "#0b120d" : "#f4ec8f"} />
          </Pressable>
        </>
      ) : (
        <View className="mt-10 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary dark:bg-dark-secondary">
            <MailCheck size={26} color={colors.fern} />
          </View>
          <Text className="mt-5 text-center font-display text-[24px] text-foreground dark:text-dark-foreground">
            Check your email
          </Text>
          <Text className="mt-2 text-center text-[13px] leading-5 text-muted-foreground dark:text-dark-muted-foreground">
            If an account exists for {email}, a reset code is on its way.
          </Text>

          {devCode ? (
            <View className="mt-5 rounded-2xl border border-dashed border-border bg-muted px-4 py-3 dark:border-dark-border dark:bg-dark-muted">
              <Text className="text-center text-[11px] text-muted-foreground dark:text-dark-muted-foreground">
                Dev mode — no email service wired up yet, so here&apos;s the code directly:
              </Text>
              <Text className="mt-1 text-center font-display text-[20px] tracking-[4px] text-accent dark:text-dark-fern">
                {devCode}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => router.push({ pathname: "/reset-password", params: { email } })}
            className="mt-6 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 dark:bg-dark-accent"
          >
            <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
              I have a code
            </Text>
            <ArrowRight size={16} color={isDark ? "#0b120d" : "#f4ec8f"} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
