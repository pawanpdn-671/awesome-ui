export interface BuilderPalette {
  id: string;
  label: string;
  description: string;
  category: 'neutral' | 'accent';
  previewColor: string;
  accentCssVars: Record<string, string>;
}

const accentPalettesData: Record<string, Record<number, string>> = {
  blue: {
    50: "#f3f7ff", 100: "#e3edff", 200: "#aebffd", 300: "#6c7ffa",
    400: "#3b41f0", 500: "#1f1bd6", 600: "#141199", 700: "#0d0a63",
    800: "#080638", 900: "#030214", 950: "#030214",
  },
  purple: {
    50: "#fbf4ff", 100: "#f4e4ff", 200: "#daabff", 300: "#af63fa",
    400: "#8024d9", 500: "#5600a8", 600: "#390076", 700: "#23004b",
    800: "#130028", 900: "#06000d", 950: "#06000d",
  },
  pink: {
    50: "#fff2f9", 100: "#ffe0f2", 200: "#ffa2d2", 300: "#f8539f",
    400: "#d61866", 500: "#a40039", 600: "#750027", 700: "#4a0018",
    800: "#27000b", 900: "#0c0002", 950: "#0c0002",
  },
  red: {
    50: "#fff2f1", 100: "#ffe1df", 200: "#ffa49e", 300: "#fa5248",
    400: "#da160b", 500: "#a80000", 600: "#770000", 700: "#4c0000",
    800: "#2a0000", 900: "#0d0000", 950: "#0d0000",
  },
  amber: {
    50: "#fffcf0", 100: "#fff7d8", 200: "#ffe184", 300: "#fabb2c",
    400: "#d68200", 500: "#a35000", 600: "#733200", 700: "#471b00",
    800: "#260c00", 900: "#0a0200", 950: "#0a0200",
  },
  green: {
    50: "#f2fdf4", 100: "#e0fce5", 200: "#9aebb0", 300: "#46c26d",
    400: "#128d39", 500: "#005d1c", 600: "#004011", 700: "#002809",
    800: "#001604", 900: "#000701", 950: "#000701",
  },
  teal: {
    50: "#effdfa", 100: "#d8fbf5", 200: "#81e9db", 300: "#30bead",
    400: "#048979", 500: "#005b4f", 600: "#003e35", 700: "#002721",
    800: "#001612", 900: "#000806", 950: "#000806",
  },
  cyan: {
    50: "#effdfe", 100: "#d8fbfe", 200: "#81e8f2", 300: "#30bccf",
    400: "#04879b", 500: "#005a69", 600: "#003d48", 700: "#00262d",
    800: "#001519", 900: "#000809", 950: "#000809",
  },
  indigo: {
    50: "#f2f4ff", 100: "#e3e7ff", 200: "#aeb7fd", 300: "#6673f9",
    400: "#2f3ae8", 500: "#151dc7", 600: "#0d1398", 700: "#080c63",
    800: "#040538", 900: "#010114", 950: "#010114",
  },
  sky: {
    50: "#f0f9ff", 100: "#dff3fe", 200: "#94d8fc", 300: "#38abf0",
    400: "#0676d1", 500: "#004c9e", 600: "#003270", 700: "#001d4a",
    800: "#000e2a", 900: "#00040f", 950: "#00040f",
  },
  rose: {
    50: "#fff0f3", 100: "#ffdee5", 200: "#ff9daf", 300: "#ef4d6b",
    400: "#cc1438", 500: "#9c001c", 600: "#700013", 700: "#49000c",
    800: "#280006", 900: "#0d0002", 950: "#0d0002",
  },
  neutral: {
    50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4",
    400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040",
    800: "#262626", 900: "#171717", 950: "#0a0a0a",
  },
  slate: {
    50: "#f6f7f9", 100: "#eceef2", 200: "#cdd2dd", 300: "#9da7b9",
    400: "#6d7890", 500: "#454e66", 600: "#2a3040", 700: "#161924",
    800: "#08090d", 900: "#000000", 950: "#000000",
  },
  zinc: {
    50: "#f8f8f7", 100: "#f1f1ef", 200: "#d7d7d3", 300: "#adaea6",
    400: "#7d7e75", 500: "#51524a", 600: "#31322c", 700: "#181915",
    800: "#090907", 900: "#000000", 950: "#000000",
  },
  gray: {
    50: "#f7f7f8", 100: "#efeff1", 200: "#d3d3d9", 300: "#a6a6b1",
    400: "#757582", 500: "#4a4a55", 600: "#2c2c34", 700: "#16161c",
    800: "#08080b", 900: "#000000", 950: "#000000",
  },
  stone: {
    50: "#f7f6f4", 100: "#efedea", 200: "#d4d0c9", 300: "#a9a196",
    400: "#797164", 500: "#4f483e", 600: "#322d27", 700: "#1b1915",
    800: "#0c0b09", 900: "#030302", 950: "#030302",
  },
};

function buildAccentVars(accent: Record<number, string>): Record<string, string> {
  const get = (k: number, fb: string) => accent[k] ?? fb;
  return {
    "--color-awesome-50": get(50, "#f3f7ff"),
    "--color-awesome-100": get(100, "#e3edff"),
    "--color-awesome-200": get(200, "#aebffd"),
    "--color-awesome-300": get(300, "#6c7ffa"),
    "--color-awesome-400": get(400, "#3b41f0"),
    "--color-awesome-500": get(500, "#1f1bd6"),
    "--color-awesome-600": get(600, "#141199"),
    "--color-awesome-700": get(700, "#0d0a63"),
    "--color-awesome-800": get(800, "#080638"),
    "--color-awesome-900": get(900, "#030214"),
    "--color-awesome-950": get(950, "#030214"),
    "--color-brand": get(500, "#1f1bd6"),
    "--color-brand-emphasis": get(600, "#141199"),
    "--color-brand-muted": get(200, "#aebffd"),
  };
}

function buildPalette(
  id: string,
  label: string,
  description: string,
  category: 'neutral' | 'accent',
  accentKey: string,
  previewColorKey?: string
): BuilderPalette {
  const accentData = (accentPalettesData as Record<string, Record<number, string>>);
  const accent = accentData[accentKey] || accentData["blue"]!;
  const previewPalette = previewColorKey ? (accentData[previewColorKey] || accent) : accent;

  return {
    id,
    label,
    description,
    category,
    previewColor: previewPalette[500] || "#1f1bd6",
    accentCssVars: buildAccentVars(accent),
  };
}

export const builderPalettes: BuilderPalette[] = [
  buildPalette(
    "slate",
    "Slate",
    "Cool gray base",
    "neutral",
    "blue",
    "slate"
  ),
  buildPalette(
    "zinc",
    "Zinc",
    "Warm gray base",
    "neutral",
    "neutral",
    "zinc"
  ),
  buildPalette(
    "stone",
    "Stone",
    "Earthy gray base",
    "neutral",
    "amber",
    "stone"
  ),
  buildPalette(
    "neutral",
    "Neutral",
    "Pure gray base",
    "neutral",
    "purple",
    "neutral"
  ),
  buildPalette(
    "blue-accent",
    "Blue",
    "Blue accent",
    "accent",
    "blue"
  ),
  buildPalette(
    "purple-accent",
    "Purple",
    "Purple accent",
    "accent",
    "purple"
  ),
  buildPalette(
    "emerald-accent",
    "Emerald",
    "Green accent",
    "accent",
    "green"
  ),
  buildPalette(
    "amber-accent",
    "Amber",
    "Warm amber accent",
    "accent",
    "amber"
  ),
  buildPalette(
    "rose-accent",
    "Rose",
    "Rose/red accent",
    "accent",
    "rose"
  ),
  buildPalette(
    "cyan-accent",
    "Cyan",
    "Cyan accent",
    "accent",
    "cyan"
  ),
  buildPalette(
    "teal-accent",
    "Teal",
    "Teal accent",
    "accent",
    "teal"
  ),
  buildPalette(
    "sky-accent",
    "Sky",
    "Sky blue accent",
    "accent",
    "sky"
  ),
  buildPalette(
    "indigo-accent",
    "Indigo",
    "Indigo accent",
    "accent",
    "indigo"
  ),
  buildPalette(
    "pink-accent",
    "Pink",
    "Pink accent",
    "accent",
    "pink"
  ),
];

export const defaultPaletteId = "slate";

export function getBuilderPalette(id: string): BuilderPalette {
  const found = builderPalettes.find((p) => p.id === id);
  if (found) return found;
  return builderPalettes[0] as BuilderPalette;
}

export { accentPalettesData as paletteColors };
