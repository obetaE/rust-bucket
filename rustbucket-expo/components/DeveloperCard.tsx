import { View, Text, Pressable, Linking } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Code2, Mail, ArrowUpRight } from "lucide-react-native";
import { useTheme } from "@/lib/theme";

// Rust Bucket is a portfolio project — this is the deliberate route back to
// the person who built it.
const EMAIL = "obetachukwuka1@gmail.com";
const GITHUB = "obetaE";
const X_HANDLE = "ObetaEric_Codes";

const LINKS = [
  { label: EMAIL, hint: "Email", Icon: Mail, url: `mailto:${EMAIL}` },
  { label: `@${GITHUB}`, hint: "GitHub", Icon: GithubIcon, url: `https://github.com/${GITHUB}` },
  { label: `@${X_HANDLE}`, hint: "X", Icon: XIcon, url: `https://x.com/${X_HANDLE}` },
];

export function DeveloperCard() {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-2xl border p-5"
      style={{ borderColor: colors.fern, backgroundColor: colors.muted }}
    >
      <View className="flex-row items-center gap-2">
        <Code2 size={14} color={colors.fern} />
        <Text className="text-[11px] font-sans-bold uppercase tracking-wide text-fern dark:text-dark-fern">
          Built by
        </Text>
      </View>

      <Text className="mt-2.5 font-display text-[20px] text-foreground dark:text-dark-foreground">
        Obeta Chukwuka Eric
      </Text>
      <Text className="mt-1.5 text-[13px] leading-6 text-muted-foreground dark:text-dark-muted-foreground">
        Rust Bucket is a personal project — designed and built end to end, from the app to the API
        behind it. If you like how it feels, want something similar built, or just have feedback,
        I&apos;d genuinely love to hear from you.
      </Text>

      <View className="mt-4 gap-2">
        {LINKS.map(({ label, hint, Icon, url }) => (
          <Pressable
            key={url}
            onPress={() => Linking.openURL(url)}
            accessibilityRole="link"
            accessibilityLabel={`${hint}: ${label}`}
            className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 active:opacity-70 dark:border-dark-border dark:bg-dark-card"
          >
            <Icon size={15} color={colors.fern} />
            <View className="min-w-0 flex-1">
              <Text className="text-[10px] uppercase tracking-wide text-muted-foreground dark:text-dark-muted-foreground">
                {hint}
              </Text>
              <Text
                className="text-[13px] font-sans-bold text-foreground dark:text-dark-foreground"
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
            <ArrowUpRight size={15} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** This version of lucide dropped brand icons, so the mark is drawn here. */
function GithubIcon({ size = 16, color = "#000" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 .5A11.5 11.5 0 0 0 8.36 22.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </Svg>
  );
}

/**
 * lucide-react-native has no X glyph, so this is the mark drawn as a path —
 * a font character (𝕏) isn't guaranteed to exist on every Android device.
 */
function XIcon({ size = 16, color = "#000" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M18.9 2.2h3.4l-7.4 8.5L23.6 22h-6.8l-5.3-7-6.1 7H2l7.9-9.1L1.7 2.2h7l4.8 6.4zm-1.2 17.7h1.9L7.4 4.2H5.4z" />
    </Svg>
  );
}
