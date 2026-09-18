import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Send, MessageCircle, CircleHelp } from "lucide-react-native";
import { useTheme } from "@/lib/theme";

export default function Support() {
  const router = useRouter();
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    "Hi! I'm Moss, your Rust Bucket guide. How can I help?",
  ]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      text,
      "Thanks — I've got that. A support specialist will follow up shortly.",
    ]);
    setText("");
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <SafeAreaView edges={["top"]} className="bg-primary px-5 pb-7 pt-4 dark:bg-dark-primary">
        <Text className="text-center font-sans-bold text-[17px] text-primary-foreground dark:text-dark-primary-foreground">
          Customer care
        </Text>
        <Text className="mt-5 text-[13px] text-palm dark:text-dark-palm">
          Real help, minus the runaround.
        </Text>
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white/10 p-4">
            <MessageCircle size={18} color={colors.lime} />
            <Text className="mt-3 font-sans-bold text-[13px] text-primary-foreground dark:text-dark-primary-foreground">
              Live chat
            </Text>
            <Text className="text-[10px] text-palm dark:text-dark-palm">You&apos;re in it — just type below</Text>
          </View>
          <Pressable
            onPress={() => router.push("/help")}
            accessibilityRole="button"
            accessibilityLabel="Open the help centre"
            className="flex-1 rounded-2xl bg-white/10 p-4 active:opacity-70"
          >
            <CircleHelp size={18} color={colors.lime} />
            <Text className="mt-3 font-sans-bold text-[13px] text-primary-foreground dark:text-dark-primary-foreground">
              Help centre
            </Text>
            <Text className="text-[10px] text-palm dark:text-dark-palm">Delivery, returns & warranty</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5 py-5" contentContainerStyle={{ gap: 10 }}>
        {messages.map((message, i) => (
          <View
            key={`${message}-${i}`}
            className="max-w-[85%] rounded-2xl px-4 py-3"
            style={{
              alignSelf: i % 2 ? "flex-end" : "flex-start",
              backgroundColor: i % 2 ? colors.primary : colors.muted,
            }}
          >
            <Text className="text-[13px]" style={{ color: i % 2 ? colors.primaryForeground : colors.foreground }}>
              {message}
            </Text>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="flex-row gap-2 px-5 pb-24">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type your message…"
          placeholderTextColor={colors.mutedForeground}
          className="h-12 flex-1 rounded-full border border-border bg-card px-4 text-[14px] dark:border-dark-border dark:bg-dark-card"
          style={{ color: colors.foreground }}
          onSubmitEditing={send}
        />
        <Pressable
          onPress={send}
          className="h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-dark-accent"
        >
          <Send size={16} color={colors.primaryForeground} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
