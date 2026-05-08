import { colors, radius, shadows } from "@awesomeui/tokens";

export interface Theme {
  name: string;
  colors: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  isDark: boolean;
}

export const darkTheme: Theme = {
  name: "dark",
  isDark: true,
  colors: {
    background: colors.surface[950],
    foreground: colors.surface[50],
    muted: colors.surface[400],
    mutedForeground: colors.surface[500],
    border: colors.surface[800],
    ring: colors.awesome[500],
    accent: colors.awesome[500],
    accentForeground: "#ffffff",
    secondary: colors.surface[800],
    secondaryForeground: colors.surface[100],
    destructive: colors.danger[500],
    destructiveForeground: "#ffffff",
    card: colors.surface[900],
    cardForeground: colors.surface[100],
    popover: colors.surface[900],
    popoverForeground: colors.surface[100],
  },
  radius: {
    ...radius,
  },
  shadows: {
    ...shadows,
  },
};

export const lightTheme: Theme = {
  name: "light",
  isDark: false,
  colors: {
    background: "#ffffff",
    foreground: colors.surface[900],
    muted: colors.surface[500],
    mutedForeground: colors.surface[400],
    border: colors.surface[200],
    ring: colors.awesome[500],
    accent: colors.awesome[500],
    accentForeground: "#ffffff",
    secondary: colors.surface[100],
    secondaryForeground: colors.surface[800],
    destructive: colors.danger[500],
    destructiveForeground: "#ffffff",
    card: "#ffffff",
    cardForeground: colors.surface[900],
    popover: "#ffffff",
    popoverForeground: colors.surface[900],
  },
  radius: {
    ...radius,
  },
  shadows: {
    ...shadows,
  },
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
};

export function generateCSSVariables(theme: Theme): string {
  const vars: string[] = [];
  for (const [key, value] of Object.entries(theme.colors)) {
    vars.push(`  --${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    vars.push(`  --radius-${key}: ${value};`);
  }
  return `:root {\n${vars.join("\n")}\n}`;
}

export function getTheme(name: keyof typeof themes): Theme {
  return themes[name] || themes.dark;
}
