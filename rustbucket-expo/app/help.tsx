import { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  UserCog,
  MessageCircle,
} from "lucide-react-native";
import { useTheme } from "@/lib/theme";

type Article = { q: string; a: string };
type Topic = { title: string; Icon: typeof Truck; articles: Article[] };

const TOPICS: Topic[] = [
  {
    title: "Orders & delivery",
    Icon: Truck,
    articles: [
      {
        q: "How long will my order take?",
        a: "Express delivery is free on every order and arrives in 2–3 business days. Orders placed after 4pm are picked the next working day.",
      },
      {
        q: "Where do you deliver?",
        a: "We deliver nationwide. Enter your address at checkout and you'll see the delivery window before you pay.",
      },
      {
        q: "How do I track my order?",
        a: "Open the You tab and look under Orders. Each order shows its current stage: confirmed, packed, dispatched or delivered.",
      },
      {
        q: "Can I change my delivery address?",
        a: "Yes, as long as the order hasn't been dispatched. Start a live chat with your order details and we'll update it.",
      },
    ],
  },
  {
    title: "Returns & refunds",
    Icon: RotateCcw,
    articles: [
      {
        q: "What is your returns policy?",
        a: "Every product has 30 days to change your mind. Items should come back in their original packaging, with the accessories included.",
      },
      {
        q: "How do I start a return?",
        a: "Message us in live chat with your order and the reason. We'll send a prepaid label and arrange collection.",
      },
      {
        q: "When will I be refunded?",
        a: "Refunds are issued to your original payment method within 5 working days of your return arriving with us.",
      },
      {
        q: "My item arrived damaged. What now?",
        a: "Don't send it back yet — start a chat with a photo of the damage and we'll replace it straight away.",
      },
    ],
  },
  {
    title: "Warranty & repairs",
    Icon: ShieldCheck,
    articles: [
      {
        q: "What does the warranty cover?",
        a: "Every product includes 2-year cover against manufacturing faults. Accidental damage and normal battery wear aren't included.",
      },
      {
        q: "How do I book a repair?",
        a: "Start a live chat with your order and a description of the fault. In-warranty repairs are free, including postage both ways.",
      },
      {
        q: "Can I get a battery replaced?",
        a: "Yes. Out-of-warranty battery replacements are charged at a flat fee, quoted before any work starts.",
      },
    ],
  },
  {
    title: "Payments & pricing",
    Icon: CreditCard,
    articles: [
      {
        q: "Which payment methods do you take?",
        a: "Credit and debit cards at checkout. Card details are never stored on your device — only the last four digits are kept with the order.",
      },
      {
        q: "Is my payment secure?",
        a: "Checkout runs over an encrypted connection, and order totals are calculated on our server rather than in the app.",
      },
      {
        q: "Do you price match?",
        a: "If you find the same product cheaper elsewhere within 14 days of buying, send us the link and we'll refund the difference.",
      },
    ],
  },
  {
    title: "Account & app",
    Icon: UserCog,
    articles: [
      {
        q: "I forgot my password.",
        a: "On the sign-in screen, tap Forgot password and enter your email. You'll get a 6-character code that's valid for 15 minutes.",
      },
      {
        q: "How do I change the app's appearance?",
        a: "Open the You tab and pick Light, Dark or Auto under Appearance. Auto follows your phone's own setting.",
      },
      {
        q: "How do I save something for later?",
        a: "Tap the heart on any product. Your favourites stay on your account and follow you to any device you sign in on.",
      },
      {
        q: "Products aren't loading.",
        a: "That's usually a connection issue. Check you're online, then pull down on the Shop tab to refresh.",
      },
    ],
  },
];

export default function HelpCenter() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOPICS;
    return TOPICS.map((topic) => ({
      ...topic,
      articles: topic.articles.filter(
        (a) => a.q.toLowerCase().includes(q) || a.a.toLowerCase().includes(q),
      ),
    })).filter((topic) => topic.articles.length > 0);
  }, [query]);

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((current) => (current === key ? null : key));
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <SafeAreaView edges={["top"]} className="bg-primary px-5 pb-7 pt-4 dark:bg-dark-primary">
        <View className="flex-row items-center justify-center">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="absolute left-0 h-11 w-11 items-center justify-center rounded-full bg-white/10"
          >
            <ArrowLeft size={18} color={colors.lime} />
          </Pressable>
          <Text className="text-center font-sans-bold text-[17px] text-primary-foreground dark:text-dark-primary-foreground">
            Help centre
          </Text>
        </View>

        <Text className="mt-5 font-display text-[24px] leading-tight text-lime dark:text-dark-lime">
          How can we help?
        </Text>
        <Text className="mt-1 text-[12px] text-palm dark:text-dark-palm">
          Answers to the questions we get most.
        </Text>

        <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-white/10 px-4">
          <Search size={16} color={colors.lime} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search help articles"
            placeholderTextColor="rgba(244,236,143,0.5)"
            accessibilityLabel="Search help articles"
            className="h-12 flex-1 text-[14px]"
            style={{ color: colors.lime }}
          />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {results.length === 0 ? (
          <View className="items-center rounded-2xl border border-dashed border-border py-12 dark:border-dark-border">
            <Text className="px-8 text-center text-[13px] text-muted-foreground dark:text-dark-muted-foreground">
              Nothing matches “{query.trim()}”. Try a different word, or start a live chat.
            </Text>
          </View>
        ) : (
          results.map((topic) => (
            <View key={topic.title} className="mb-6">
              <View className="mb-3 flex-row items-center gap-2">
                <topic.Icon size={15} color={colors.fern} />
                <Text className="text-[12px] font-sans-bold uppercase tracking-wide text-fern dark:text-dark-fern">
                  {topic.title}
                </Text>
              </View>

              <View className="gap-2">
                {topic.articles.map((article) => {
                  const key = `${topic.title}:${article.q}`;
                  const isOpen = open === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => toggle(key)}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: isOpen }}
                      className="rounded-2xl border border-border bg-card p-4 dark:border-dark-border dark:bg-dark-card"
                    >
                      <View className="flex-row items-center gap-3">
                        <Text className="flex-1 text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
                          {article.q}
                        </Text>
                        <ChevronDown
                          size={16}
                          color={colors.mutedForeground}
                          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
                        />
                      </View>
                      {isOpen && (
                        <Text className="mt-2.5 text-[13px] leading-6 text-muted-foreground dark:text-dark-muted-foreground">
                          {article.a}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <Pressable
          onPress={() => router.back()}
          className="mt-2 flex-row items-center gap-3 rounded-2xl border p-4"
          style={{ borderColor: colors.fern, backgroundColor: colors.muted }}
        >
          <MessageCircle size={18} color={colors.fern} />
          <View className="flex-1">
            <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
              Still stuck?
            </Text>
            <Text className="text-[11px] text-muted-foreground dark:text-dark-muted-foreground">
              Start a live chat — we usually reply straight away.
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
