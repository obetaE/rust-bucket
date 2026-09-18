/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light — warm cream, deep evergreen, pale lime.
        // Hex computed precisely from the web mockup's oklch tokens.
        background: "#fdf6e4",
        foreground: "#0b290a",
        card: "#fffdf9",
        "card-foreground": "#0b290a",
        primary: "#0d380c",
        "primary-foreground": "#f4ec8f",
        secondary: "#eae196",
        "secondary-foreground": "#0d380c",
        muted: "#f1ebd5",
        "muted-foreground": "#596855",
        accent: "#91a33b",
        "accent-foreground": "#f4ec8f",
        border: "#d4d3b9",
        destructive: "#e7000b",
        evergreen: "#0b290a",
        fern: "#516f00",
        palm: "#a6a442",
        lime: "#f4ec8f",

        // Dark — NOT a generic gray inversion. The mockup's own .dark block
        // was leftover shadcn boilerplate, disconnected from the actual
        // brand. This is a real "richer, more mature" dark mode: deep pine
        // surfaces, antique gold in place of bright lime, muted moss accent.
        "dark-background": "#0b120d",
        "dark-foreground": "#eef2df",
        "dark-card": "#141f17",
        "dark-card-foreground": "#eef2df",
        "dark-primary": "#16281a",
        "dark-primary-foreground": "#e8d998",
        "dark-secondary": "#1e2a20",
        "dark-secondary-foreground": "#eef2df",
        "dark-muted": "#1a241c",
        "dark-muted-foreground": "#9aa693",
        "dark-accent": "#7a9a4a",
        "dark-accent-foreground": "#0b120d",
        "dark-border": "rgba(255,255,255,0.09)",
        "dark-destructive": "#e2574a",
        "dark-evergreen": "#eef2df",
        "dark-fern": "#8fae4a",
        "dark-palm": "#b8a86a",
        "dark-lime": "#e8d998",
      },
      fontFamily: {
        display: ["Outfit_700Bold", "sans-serif"],
        "display-semibold": ["Outfit_600SemiBold", "sans-serif"],
        sans: ["Inter_400Regular", "sans-serif"],
        "sans-medium": ["Inter_500Medium", "sans-serif"],
        "sans-semibold": ["Inter_600SemiBold", "sans-serif"],
        "sans-bold": ["Inter_700Bold", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
        "3xl": "36px",
      },
    },
  },
  plugins: [],
};
