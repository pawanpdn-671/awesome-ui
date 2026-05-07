---
trigger: always_on
---

# AwesomeUI Platform - Workspace Rules

## Project Overview

Building a cross-framework component platform (React, Vue, Svelte, Angular, Solid) with AI-powered component generation. Components stored as Intermediate Representation (IR) JSON, transpiled to frameworks on-demand.

## Code Quality Standards

### TypeScript First

- All code MUST be TypeScript with strict mode enabled
- No `any` types without explicit justification comment
- Export types/interfaces for all public APIs
- Use Zod for runtime validation of all external data

### Testing Requirements

- Unit tests for all IR transformation functions
- Snapshot tests for each framework transpiler
- E2E tests for CLI commands
- AI outputs must be validated against schemas before processing

### File Structure Convention

packages/
├── core/ # IR schema, validators, base types
├── transpilers/ # Framework-specific code generators
│ ├── react/
│ ├── vue/
│ └── shared/
├── cli/ # Command-line interface
├── ai/ # AI prompt templates & generation logic
├── website/ # Documentation & interactive demo
└── shared/ # Utilities, constants, helpers

### Naming Conventions

- **Files**: kebab-case (`button-component.ts`)
- **Classes**: PascalCase (`ButtonTranspiler`)
- **Functions**: camelCase (`generateVueComponent`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_STYLE_TOKENS`)
- **Interfaces**: PascalCase with `I` prefix (`IComponentIR`)
- **Types**: PascalCase (`ComponentVariant`)

### Git Practices

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- PRs require: schema validation passing, snapshot updates, changelog entry
- Main branch protected: no direct commits, CI must pass

### AI Agent Specific Rules

1. **Never delete existing framework transpilers** - add new ones alongside
2. **Always regenerate snapshots** when modifying transpiler output
3. **Validate IR before generating framework code** - use Zod schemas
4. **Keep AI prompts in `/ai/prompts/`** as markdown files with versioning
5. **Rate limit AI calls** - implement token counting and caching
6. **No API keys in code** - always read from env or user input

### Performance Constraints

- Framework transpilation: <50ms per component
- CLI startup time: <200ms
- AI generation: show streaming progress, timeout after 30s
- Bundle size: core package <10kb, each transpiler <5kb

### Security Requirements

- Sanitize all user inputs before AI prompts
- Validate AI output JSON schema before processing
- Never execute generated code on server (only client-side sandbox)
- Rate limit by IP for AI endpoints
- Log all AI generations for audit (no PII)

### Documentation Standard

- Every public function needs JSDoc with examples
- Every component IR needs usage example in all frameworks
- README per package with API reference
- `/docs` folder for architecture decisions (ADR format)

### Error Handling Pattern

```typescript
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Always use Result type for fallible operations
function generateComponent(input: unknown): Result<ComponentIR, ValidationError>;
```
