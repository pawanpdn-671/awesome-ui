import { allPalettes, type Palette } from "@/lib/color-palettes";

function PaletteScale({ palette }: { palette: Palette }) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  return (
    <div className="rounded-xl border border-surface-800 overflow-hidden">
      <div className="px-4 py-2.5 bg-surface-900/50 border-b border-surface-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-surface-200">{palette.label}</span>
        <span className="text-xs text-surface-500 font-mono">{palette.name}</span>
      </div>
      <div className="grid grid-cols-11">
        {steps.map((s) => {
          const color = palette.colors[s];
          if (!color) return null;
          const isDark = s >= 400;
          return (
            <div
              key={s}
              className="flex flex-col items-center justify-center py-3 px-1 text-[10px] font-mono"
              style={{ backgroundColor: color }}
            >
              <span style={{ color: isDark ? "#fff" : "#000", fontWeight: 600 }}>
                {s}
              </span>
              <span style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
                {color.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ColorsPage() {
  const neutral = allPalettes.filter((p) =>
    ["zinc", "slate", "gray", "stone", "neutral", "black"].includes(p.name)
  );
  const accent = allPalettes.filter(
    (p) => !["zinc", "slate", "gray", "stone", "neutral", "black"].includes(p.name)
  );

  return (
    <div>
      <h1>Colors</h1>
      <p>
        Complete color reference from <code>@awesomeui/tokens</code>. All colors
        are available as design tokens and CSS custom properties.
      </p>

      <h2 id="import">Import</h2>
      <div className="not-prose">
        <div className="rounded-lg bg-surface-950 border border-surface-800 p-4 font-mono text-sm text-surface-300 overflow-x-auto">
          <pre>{`import { colors } from '@awesomeui/tokens'

// Access any color by name and shade
colors.blue[500]    // => "#1f1bd6"
colors.slate[200]   // => "#cdd2dd"
colors.green[400]   // => "#128d39"`}</pre>
        </div>
      </div>

      <h2 id="neutral">Neutral Palettes</h2>
      <p>Neutral colors used for surfaces, text, borders, and backgrounds.</p>
      <div className="not-prose space-y-3">
        {neutral.map((p) => (
          <PaletteScale key={p.name} palette={p} />
        ))}
      </div>

      <h2 id="accent">Accent Palettes</h2>
      <p>Accent colors used for interactive elements, highlights, and branding.</p>
      <div className="not-prose space-y-3">
        {accent.map((p) => (
          <PaletteScale key={p.name} palette={p} />
        ))}
      </div>

      <h2 id="css-variables">CSS Custom Properties</h2>
      <p>
        All design tokens are exposed as CSS custom properties. See the{" "}
        <a href="/docs/theming">theming documentation</a> for usage details.
      </p>
    </div>
  );
}
