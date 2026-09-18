import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  CreditCard,
  PackageCheck,
  WalletCards,
  LockKeyhole,
} from "lucide-react-native";
import { useCart } from "@/lib/cart";
import { api } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export default function Checkout() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cart, total, clear } = useCart();

  const [step, setStep] = useState(1);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const cardDigits = cardNumber.replace(/\D/g, "");
  const itemCount = Object.keys(cart).length;

  // Prototype payment — nothing is charged — but each step still checks its
  // fields so an order can't be placed with a blank address or card.
  const stepError = (): string | null => {
    if (itemCount === 0) return "Your bag is empty.";
    if (step === 1 && (!fullName.trim() || !street.trim() || !city.trim())) {
      return "Please add your name, street and city.";
    }
    if (step === 2) {
      if (cardDigits.length < 12 || cardDigits.length > 19) return "Enter a valid card number.";
      if (!/^(0[1-9]|1[0-2])\s*\/?\s*\d{2}$/.test(expiry.trim())) return "Enter the expiry as MM / YY.";
      if (!/^\d{3,4}$/.test(cvc)) return "Enter the 3 or 4 digit CVC.";
    }
    return null;
  };

  const advance = async () => {
    const problem = stepError();
    if (problem) {
      setError(problem);
      return;
    }
    if (step < 3) {
      setError(null);
      setStep(step + 1);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const items = Object.values(cart).map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      }));
      await api.createOrder(
        items,
        { fullName, street, city, postcode },
        cardDigits,
      );
      clear();
      router.replace("/checkout/success");
    } catch (e: any) {
      setError(e.message || "Payment failed — please try again");
      setPaying(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-6 dark:bg-dark-background">
      <View className="flex-row items-center justify-center">
        <Pressable
          onPress={() => {
            setError(null);
            if (step > 1) setStep(step - 1);
            else router.back();
          }}
          className="absolute left-0 h-11 w-11 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
        >
          <ArrowLeft size={18} color={colors.foreground} />
        </Pressable>
        <Text className="font-sans-bold text-[17px] text-foreground dark:text-dark-foreground">Checkout</Text>
      </View>

      <View className="my-6 flex-row gap-2">
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: n <= step ? colors.fern : colors.muted }}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-[11px] font-sans-bold uppercase text-fern dark:text-dark-fern">
          Step {step} of 3
        </Text>
        <Text className="mt-1 font-display text-[22px] text-foreground dark:text-dark-foreground">
          {step === 1 ? "Delivery details" : step === 2 ? "Payment method" : "Review order"}
        </Text>

        {step === 1 && (
          <View className="mt-6 gap-3">
            <Field icon={<User size={15} color={colors.mutedForeground} />} value={fullName} onChangeText={setFullName} placeholder="Full name" />
            <Field icon={<MapPin size={15} color={colors.mutedForeground} />} value={street} onChangeText={setStreet} placeholder="Street address" />
            <View className="flex-row gap-3">
              <View className="flex-1"><Field value={city} onChangeText={setCity} placeholder="City" /></View>
              <View className="flex-1"><Field value={postcode} onChangeText={setPostcode} placeholder="Postcode" /></View>
            </View>
            <View className="rounded-2xl border p-4" style={{ borderColor: colors.fern, backgroundColor: colors.muted }}>
              <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">Express delivery</Text>
              <Text className="text-[11px] text-muted-foreground dark:text-dark-muted-foreground">2–3 business days · Free</Text>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="mt-6 gap-3">
            <View className="flex-row items-center gap-3 rounded-2xl border p-4" style={{ borderColor: colors.fern, backgroundColor: colors.muted }}>
              <CreditCard size={18} color={colors.foreground} />
              <View>
                <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">Credit or debit card</Text>
                <Text className="text-[11px] text-muted-foreground dark:text-dark-muted-foreground">Encrypted and secure</Text>
              </View>
            </View>
            <Field icon={<CreditCard size={15} color={colors.mutedForeground} />} value={cardNumber} onChangeText={setCardNumber} placeholder="Card number" keyboardType="number-pad" maxLength={23} />
            <View className="flex-row gap-3">
              <View className="flex-1"><Field value={expiry} onChangeText={setExpiry} placeholder="MM / YY" keyboardType="number-pad" maxLength={7} /></View>
              <View className="flex-1"><Field value={cvc} onChangeText={setCvc} placeholder="CVC" keyboardType="number-pad" maxLength={4} secureTextEntry /></View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View className="mt-6 gap-3">
            <View className="rounded-2xl bg-muted p-5 dark:bg-dark-muted">
              <View className="flex-row items-center gap-3">
                <PackageCheck size={18} color={colors.fern} />
                <View>
                  <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">Express delivery</Text>
                  <Text className="text-[11px] text-muted-foreground dark:text-dark-muted-foreground">{street}, {city}</Text>
                </View>
              </View>
            </View>
            <View className="rounded-2xl bg-muted p-5 dark:bg-dark-muted">
              <View className="flex-row items-center gap-3">
                <WalletCards size={18} color={colors.fern} />
                <View>
                  <Text className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground">
                    Card ending {cardDigits.slice(-4) || "····"}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground dark:text-dark-muted-foreground">Ready for secure payment</Text>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between border-t border-border pt-5 dark:border-dark-border">
              <Text className="text-[17px] font-sans-bold text-foreground dark:text-dark-foreground">Order total</Text>
              <Text className="text-[17px] font-sans-bold text-foreground dark:text-dark-foreground">${total}</Text>
            </View>
          </View>
        )}

        {error ? <Text className="mt-3 text-[12px] text-destructive dark:text-dark-destructive">{error}</Text> : null}

        <Pressable
          onPress={advance}
          disabled={paying}
          className="mt-8 flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5 dark:bg-dark-accent"
          style={{ opacity: paying ? 0.6 : 1 }}
        >
          <Text className="text-[14px] font-sans-bold text-primary-foreground dark:text-dark-accent-foreground">
            {paying ? "Processing securely…" : step === 3 ? `Pay $${total}` : "Continue"}
          </Text>
          <ArrowRight size={16} color={colors.primaryForeground} />
        </Pressable>
        <View className="mt-4 flex-row items-center justify-center gap-1.5">
          <LockKeyhole size={11} color={colors.mutedForeground} />
          <Text className="text-[10px] text-muted-foreground dark:text-dark-muted-foreground">
            256-bit encrypted checkout · Prototype payment
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  icon,
  ...inputProps
}: { icon?: React.ReactNode } & React.ComponentProps<typeof TextInput>) {
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
