export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface Palette {
  name: string;
  label: string;
  colors: ColorScale;
  shades?: Record<number, string>;
}

export const accentShadeOptions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type AccentShade = (typeof accentShadeOptions)[number];

function allShades(t: Record<string, string>): Record<number, string> {
  const shades: Record<number, string> = {};
  for (const key of Object.keys(t)) {
    const n = Number(key);
    if (!isNaN(n)) shades[n] = t[key]!;
  }
  return shades;
}

function tokenToScale(t: Record<string, string>, withShades?: { shades: Record<number, string> }): ColorScale {
  const g = (k: string) => t[k]!;
  if (withShades) Object.assign(withShades.shades, allShades(t));
  return {
    50: g("50"),
    100: g("100"),
    200: g("200"),
    300: g("300"),
    400: g("400"),
    500: g("500"),
    600: g("600"),
    700: g("700"),
    800: g("800"),
    900: g("900"),
    950: g("900"),
  };
}

export const neutralPalettes: Palette[] = [
  {
    name: "zinc",
    label: "Zinc",
    colors: tokenToScale({
      "50": "#f8f8f7",
      "100": "#f1f1ef",
      "200": "#d7d7d3",
      "300": "#adaea6",
      "400": "#7d7e75",
      "500": "#51524a",
      "600": "#31322c",
      "700": "#181915",
      "800": "#090907",
      "900": "#000000",
    }),
  },
  {
    name: "slate",
    label: "Slate",
    colors: tokenToScale({
      "50": "#f6f7f9",
      "100": "#eceef2",
      "200": "#cdd2dd",
      "300": "#9da7b9",
      "400": "#6d7890",
      "500": "#454e66",
      "600": "#2a3040",
      "700": "#161924",
      "800": "#08090d",
      "900": "#000000",
    }),
  },
  {
    name: "gray",
    label: "Gray",
    colors: tokenToScale({
      "50": "#f7f7f8",
      "100": "#efeff1",
      "200": "#d3d3d9",
      "300": "#a6a6b1",
      "400": "#757582",
      "500": "#4a4a55",
      "600": "#2c2c34",
      "700": "#16161c",
      "800": "#08080b",
      "900": "#000000",
    }),
  },
  {
    name: "stone",
    label: "Stone",
    colors: tokenToScale({
      "50": "#f7f6f4",
      "100": "#efedea",
      "200": "#d4d0c9",
      "300": "#a9a196",
      "400": "#797164",
      "500": "#4f483e",
      "600": "#322d27",
      "700": "#1b1915",
      "800": "#0c0b09",
      "900": "#030302",
    }),
  },
  {
    name: "neutral",
    label: "Neutral",
    colors: {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e5e5e5",
      "300": "#d4d4d4",
      "400": "#a3a3a3",
      "500": "#737373",
      "600": "#525252",
      "700": "#404040",
      "800": "#262626",
      "900": "#171717",
      "950": "#0a0a0a",
    },
  },
  {
    name: "black",
    label: "Black",
    colors: {
      "50": "#f5f5f5",
      "100": "#ebebeb",
      "200": "#cccccc",
      "300": "#9e9e9e",
      "400": "#6b6b6b",
      "500": "#3e3e3e",
      "600": "#222222",
      "700": "#0f0f0f",
      "800": "#050505",
      "900": "#000000",
      "950": "#000000",
    },
  },
];

function shadePalette(
  data: Record<string, string>,
  label: string,
  name: string
): Palette {
  const shades: Record<number, string> = {};
  const colors = tokenToScale(data, { shades });
  return { name, label, colors, shades };
}

export const accentPalettes: Palette[] = [
  shadePalette(
    { "50": "#f3f7ff", "100": "#e3edff", "150": "#cddbfe", "200": "#aebffd", "250": "#8da1fc", "300": "#6c7ffa", "350": "#5160f6", "400": "#3b41f0", "450": "#2a2ce5", "500": "#1f1bd6", "550": "#1915b8", "600": "#141199", "650": "#100d7d", "700": "#0d0a63", "750": "#0a074c", "800": "#080638", "850": "#050424", "900": "#030214" },
    "Blue", "blue"
  ),
  shadePalette(
    { "50": "#fbf4ff", "100": "#f4e4ff", "150": "#eacaff", "200": "#daabff", "250": "#c688ff", "300": "#af63fa", "350": "#9741eb", "400": "#8024d9", "450": "#6a0ec2", "500": "#5600a8", "550": "#47008f", "600": "#390076", "650": "#2d0060", "700": "#23004b", "750": "#1a0038", "800": "#130028", "850": "#0c001a", "900": "#06000d" },
    "Purple", "purple"
  ),
  shadePalette(
    { "50": "#fff2f9", "100": "#ffe0f2", "150": "#ffc5e5", "200": "#ffa2d2", "250": "#ff7bbb", "300": "#f8539f", "350": "#e93282", "400": "#d61866", "450": "#be064d", "500": "#a40039", "550": "#8c0030", "600": "#750027", "650": "#5e001f", "700": "#4a0018", "750": "#380011", "800": "#27000b", "850": "#190006", "900": "#0c0002" },
    "Pink", "pink"
  ),
  shadePalette(
    { "50": "#fff2f1", "100": "#ffe1df", "150": "#ffc8c4", "200": "#ffa49e", "250": "#ff7c74", "300": "#fa5248", "350": "#ed3226", "400": "#da160b", "450": "#c20700", "500": "#a80000", "550": "#8f0000", "600": "#770000", "650": "#610000", "700": "#4c0000", "750": "#3a0000", "800": "#2a0000", "850": "#1a0000", "900": "#0d0000" },
    "Red", "red"
  ),
  shadePalette(
    { "50": "#fff6ef", "100": "#ffeadd", "150": "#ffd4bb", "200": "#ffb88f", "250": "#ff985d", "300": "#f9782b", "350": "#e95d0a", "400": "#d44800", "450": "#bb3500", "500": "#a22500", "550": "#891b00", "600": "#721300", "650": "#5c0e00", "700": "#480900", "750": "#360600", "800": "#270400", "850": "#180200", "900": "#0a0000" },
    "Orange", "orange"
  ),
  shadePalette(
    { "50": "#fffcf0", "100": "#fff7d8", "150": "#ffeeb2", "200": "#ffe184", "250": "#ffd057", "300": "#fabb2c", "350": "#eb9f0c", "400": "#d68200", "450": "#bd6800", "500": "#a35000", "550": "#8a4000", "600": "#733200", "650": "#5c2600", "700": "#471b00", "750": "#361300", "800": "#260c00", "850": "#170600", "900": "#0a0200" },
    "Amber", "amber"
  ),
  shadePalette(
    { "50": "#fffee6", "100": "#fffbc2", "150": "#fff494", "200": "#ffea60", "250": "#ffdc2e", "300": "#facb00", "350": "#eab400", "400": "#d59c00", "450": "#be8400", "500": "#a56e00", "550": "#8d5800", "600": "#754500", "650": "#5f3500", "700": "#492600", "750": "#371c00", "800": "#271200", "850": "#180a00", "900": "#0b0400" },
    "Yellow", "yellow"
  ),
  shadePalette(
    { "50": "#f2fdf4", "100": "#e0fce5", "150": "#c3f6ce", "200": "#9aebb0", "250": "#6dd98e", "300": "#46c26d", "350": "#27a750", "400": "#128d39", "450": "#057427", "500": "#005d1c", "550": "#004e16", "600": "#004011", "650": "#00330d", "700": "#002809", "750": "#001e06", "800": "#001604", "850": "#000e02", "900": "#000701" },
    "Green", "green"
  ),
  shadePalette(
    { "50": "#effdfa", "100": "#d8fbf5", "150": "#b3f5eb", "200": "#81e9db", "250": "#54d5c6", "300": "#30bead", "350": "#15a392", "400": "#048979", "450": "#007163", "500": "#005b4f", "550": "#004c41", "600": "#003e35", "650": "#00322b", "700": "#002721", "750": "#001e19", "800": "#001612", "850": "#000f0c", "900": "#000806" },
    "Teal", "teal"
  ),
  shadePalette(
    { "50": "#effdfe", "100": "#d8fbfe", "150": "#b2f5fa", "200": "#81e8f2", "250": "#54d4e3", "300": "#30bccf", "350": "#15a1b6", "400": "#04879b", "450": "#006f81", "500": "#005a69", "550": "#004a57", "600": "#003d48", "650": "#00313a", "700": "#00262d", "750": "#001d22", "800": "#001519", "850": "#000e11", "900": "#000809" },
    "Cyan", "cyan"
  ),
  shadePalette(
    { "50": "#f2f4ff", "100": "#e3e7ff", "150": "#cdd3fe", "200": "#aeb7fd", "250": "#8b96fc", "300": "#6673f9", "350": "#4754f2", "400": "#2f3ae8", "450": "#1f28da", "500": "#151dc7", "550": "#1018b0", "600": "#0d1398", "650": "#0a0f7d", "700": "#080c63", "750": "#06084c", "800": "#040538", "850": "#020324", "900": "#010114" },
    "Indigo", "indigo"
  ),
  shadePalette(
    { "50": "#f4fde6", "100": "#e7faca", "150": "#d3f597", "200": "#b9eb66", "250": "#9bdd39", "300": "#7ec91b", "350": "#63b109", "400": "#4b9600", "450": "#387c00", "500": "#2a6400", "550": "#205200", "600": "#184200", "650": "#123300", "700": "#0d2600", "750": "#091c00", "800": "#061300", "850": "#030b00", "900": "#010500" },
    "Lime", "lime"
  ),
  shadePalette(
    { "50": "#f0f9ff", "100": "#dff3fe", "150": "#c0e8fd", "200": "#94d8fc", "250": "#63c3f8", "300": "#38abf0", "350": "#1890e3", "400": "#0676d1", "450": "#005fb8", "500": "#004c9e", "550": "#003e86", "600": "#003270", "650": "#00275c", "700": "#001d4a", "750": "#001539", "800": "#000e2a", "850": "#00081c", "900": "#00040f" },
    "Sky", "sky"
  ),
  shadePalette(
    { "50": "#fff0f3", "100": "#ffdee5", "150": "#ffc2ce", "200": "#ff9daf", "250": "#fa748d", "300": "#ef4d6b", "350": "#df2d4f", "400": "#cc1438", "450": "#b50426", "500": "#9c001c", "550": "#850017", "600": "#700013", "650": "#5c000f", "700": "#49000c", "750": "#380009", "800": "#280006", "850": "#1a0004", "900": "#0d0002" },
    "Rose", "rose"
  ),
];

export const allPalettes: Palette[] = [...neutralPalettes, ...accentPalettes];

export function shiftAccentScale(
  palette: Palette,
  primaryShade: number
): ColorScale {
  const shades = palette.shades;
  if (!shades || !shades[primaryShade]) return { ...palette.colors };

  const tokenKeys = Object.keys(shades)
    .map(Number)
    .sort((a, b) => a - b);
  const closest = (target: number) => {
    let best = tokenKeys[0]!;
    let min = Infinity;
    for (const k of tokenKeys) {
      const d = Math.abs(k - target);
      if (d < min) { min = d; best = k; }
    }
    return shades[best]!;
  };

  const out = { ...palette.colors };
  const steps: [number, number][] = [
    [50, -450], [100, -400], [200, -300], [300, -200],
    [400, -100], [500, 0], [600, 100], [700, 200],
    [800, 300], [900, 400], [950, 450],
  ];
  for (const [aws, offset] of steps) {
    const key = aws as keyof ColorScale;
    out[key] = closest(primaryShade + offset);
  }
  return out;
}

function invertedSurface(s: ColorScale) {
  return {
    50: s[950],
    100: s[900],
    200: s[800],
    300: s[700],
    400: s[600],
    500: s[500],
    600: s[400],
    700: s[300],
    800: s[200],
    900: s[100],
    950: s[50],
  };
}

type CSSVars = Record<string, string>;

function buildVars(s: ColorScale, a: ColorScale): CSSVars {
  return {
    "--color-surface-50": s[50],
    "--color-surface-100": s[100],
    "--color-surface-200": s[200],
    "--color-surface-300": s[300],
    "--color-surface-400": s[400],
    "--color-surface-500": s[500],
    "--color-surface-600": s[600],
    "--color-surface-700": s[700],
    "--color-surface-800": s[800],
    "--color-surface-900": s[900],
    "--color-surface-950": s[950],
    "--color-awesome-50": a[50],
    "--color-awesome-100": a[100],
    "--color-awesome-200": a[200],
    "--color-awesome-300": a[300],
    "--color-awesome-400": a[400],
    "--color-awesome-500": a[500],
    "--color-awesome-600": a[600],
    "--color-awesome-700": a[700],
    "--color-awesome-800": a[800],
    "--color-awesome-900": a[900],
    "--color-awesome-950": a[950],
    "--color-brand": a[500],
    "--color-brand-emphasis": a[600],
    "--color-brand-muted": a[200],
    "--color-glow": `${a[400]}66`,
  };
}

export function getThemeVars(
  neutral: Palette,
  accent: Palette,
  isLight: boolean
): CSSVars {
  const s = isLight ? invertedSurface(neutral.colors) : neutral.colors;
  return buildVars(s, accent.colors);
}

export function generateCSSVariables(neutral: Palette, accent: Palette): string {
  const dark = buildVars(neutral.colors, accent.colors);
  const light = buildVars(invertedSurface(neutral.colors), accent.colors);
  const fmt = (vars: CSSVars) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
  return `:root {\n${fmt(dark)}\n}\n\nhtml.light {\n${fmt(light)}\n}`;
}
