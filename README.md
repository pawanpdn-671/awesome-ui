# AwesomeUI

**Cross-framework component platform** — define components once in a framework-agnostic Intermediate Representation (IR), then transpile to any supported framework.

```bash
npx awesomeui add button --framework react
npx awesomeui add dialog --framework vue
npx awesomeui add badge --framework svelte
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Component IR                       │
│               (`.ir.json` — framework-agnostic)      │
│  props │ slots │ events │ template AST │ styles      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
           ┌──────────────────┐
           │   Transpiler     │
           │   (per framework) │
           └────────┬─────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  Framework Component │
        │  (.tsx / .vue / .js) │
        └──────────────────────┘
```

### Packages

| Package                              | Description                                                 |
| ------------------------------------ | ----------------------------------------------------------- |
| `@awesomeui/core`                    | IR schema, Zod validators, TypeScript types, error handling |
| `@awesomeui/cli`                     | CLI for `init`, `add`, `list` commands                      |
| `@awesomeui/transpiler-shared`       | Base transpiler class, expression parser, utilities         |
| `@awesomeui/transpiler-react`        | React / Next.js TSX transpiler                              |
| `@awesomeui/transpiler-vue`          | Vue 3 SFC transpiler                                        |
| `@awesomeui/transpiler-svelte`       | Svelte 5 (runes) transpiler                                 |
| `@awesomeui/transpiler-solid`        | SolidJS TSX transpiler                                      |
| `@awesomeui/transpiler-angularjs`    | AngularJS 1.x transpiler                                    |
| `@awesomeui/transpiler-react-native` | React Native TSX transpiler                                 |

---

## Quick Start

```bash
# Initialize config
npx awesomeui init --framework react

# Add a component
npx awesomeui add button
npx awesomeui add dialog
npx awesomeui add card

# With other frameworks
npx awesomeui add badge --framework vue --output ./src/components
npx awesomeui add alert --framework svelte
npx awesomeui add tooltip --framework solid
```

### Commands

| Command           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `init`            | Creates `awesomeui.config.json` in your project                  |
| `add <component>` | Transpiles a component from the registry to the target framework |
| `list`            | Lists all available components                                   |

### `awesomeui.config.json`

```json
{
	"framework": "react",
	"style": "tailwind",
	"outputDir": "./src/components/ui",
	"typescript": true,
	"components": ["button", "dialog", "card"]
}
```

---

## Framework Support

| Framework       | Transpiler                           | Status     |
| --------------- | ------------------------------------ | ---------- |
| React / Next.js | `@awesomeui/transpiler-react`        | ✅         |
| Vue 3           | `@awesomeui/transpiler-vue`          | ✅         |
| Svelte 5        | `@awesomeui/transpiler-svelte`       | ✅         |
| SolidJS         | `@awesomeui/transpiler-solid`        | ✅         |
| AngularJS 1.x   | `@awesomeui/transpiler-angularjs`    | ✅         |
| React Native    | `@awesomeui/transpiler-react-native` | ✅         |
| Angular         | —                                    | 🚧 Planned |

---

## Available Components

| Category     | Components                                                      |
| ------------ | --------------------------------------------------------------- |
| Primitive    | `button`                                                        |
| Layout       | `card`, `accordion`, `accordion-item`                           |
| Form         | `input`, `checkbox`, `select`, `switch`, `textarea`             |
| Data Display | `badge`, `avatar`, `table`                                      |
| Feedback     | `alert`, `skeleton`, `toast`, `loading`, `progress`             |
| Navigation   | `sidebar`, `menubar`, `tabs`, `tab`, `pagination`, `breadcrumb` |
| Overlay      | `dialog`, `tooltip`, `dropdown-menu`                            |

All 26 components are bundled directly in the CLI — no network calls during install.

---

## Component IR Format

Components are defined as framework-agnostic JSON files using an Intermediate Representation (IR).

```json
{
	"name": "button",
	"version": "1.0.0",
	"category": "primitive",
	"props": {
		"variant": { "type": "enum", "values": ["primary", "secondary", "outline"], "default": "primary" },
		"disabled": { "type": "boolean", "default": false }
	},
	"slots": {
		"default": { "description": "Button label content" },
		"icon": { "description": "Optional icon" }
	},
	"events": {
		"onClick": { "description": "Fired when clicked" }
	},
	"template": {
		"tag": "button",
		"attributes": { "type": "button", "disabled": "{{props.disabled}}" },
		"class": "{{styles.base}} {{styles.variant[props.variant]}}",
		"children": [{ "slot": "icon" }, { "tag": "span", "children": [{ "slot": "default", "fallback": "Button" }] }]
	},
	"styles": {
		"base": "inline-flex items-center justify-center gap-2 rounded-md font-medium",
		"variant": {
			"primary": "bg-blue-600 text-white",
			"secondary": "bg-gray-100 text-gray-900",
			"outline": "border border-gray-300 bg-transparent"
		}
	}
}
```

Expressions use `{{...}}` mustache syntax and are parsed by `@awesomeui/transpiler-shared`.

---

## Development

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setup

```bash
git clone <repo>
npm install
```

### Scripts

```bash
npm run build     # Build all packages
npm run test      # Run all tests across all packages
npm run lint      # Type-check all packages
npm run clean     # Clean all dist directories
```

### Adding a New Transpiler

1. Create a package under `packages/transpilers/<name>/`
2. Extend `BaseTranspiler` from `@awesomeui/transpiler-shared`
3. Add a `case` to `createTranspiler()` in `packages/cli/src/commands/add.ts`
4. Add the framework name to the `framework` enum in `packages/cli/src/config.ts`

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run test` to verify
5. Submit a pull request

---

## License

This repository is source-available for viewing purposes only.

No reuse, modification, redistribution, or derivative work is permitted
without explicit written permission from the author.

See the LICENSE file for full terms.
