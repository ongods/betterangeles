# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run check        # Formatting, lint, types, tests, and content QA
npm run check:ci     # All checks plus production build and built-content QA
npm test             # Run loader regression tests once
npm run test:watch   # Watch mode while changing behavior
npm run typecheck    # TypeScript check without a Vite build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run dev:yaml     # Convert YAML to JSON, then start dev server
npm run setup        # Interactive setup script for new installations
```

Pre-commit hook runs `lint-staged` automatically (ESLint + Prettier on staged files).
Pre-push runs `npm run check`. CI runs `npm run check:ci` on Linux and Windows.
Use Node.js from `.nvmrc` and `npm ci` for a reproducible installation.

## Quality Harness

Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for the quality workflow,
architecture boundaries, test conventions, and tooling decisions.

- Reuse the existing loaders and UI primitives before adding abstractions.
- Shared code in `src/data`, `src/lib`, `src/hooks`, `src/types`, and
  `src/components/ui` must not import pages or composed site sections.
- Never import `content/reference` evidence into application code or reformat
  saved source snapshots. Reference evidence is excluded from Prettier.
- Handle rejected promises, or use `void` only when rejection is handled inside
  the called function. ESLint checks asynchronous code with type information.
- Add focused regression tests for behavior changes. Test public behavior using
  Vitest and the same Vite transforms as the application.
- Run `npm run check:ci` before handing off a code change. Report failing checks
  and existing limitations; do not disable checks to obtain a passing result.
- Keep changes focused and preserve unrelated work already in the working tree.
- Do not invent missing government content to satisfy QA. Existing source gaps
  are recorded in the source manifest and remain explicit.

## Architecture

This is a React 19 + TypeScript + Vite app for Philippine Local Government Units (LGUs). It uses React Router, Tailwind CSS, i18next for multilingual support, and a YAML-based content system.

### Routing

`src/App.tsx` defines these route families:

- `/` — Home page
- `/services` / `/services/:category` — Services listing
- `/government` / `/government/:category` — Government section listing
- `/services/:category/:documentSlug` — Service document viewer
- `/government/:category/:documentSlug` — Government document viewer
- `/:documentSlug` / `/:lang/:documentSlug` — Document viewer (markdown content, used by both services and government)

### Content System

Content is stored as YAML and Markdown files under `content/`. Two parallel content trees exist:

#### Services (`content/services/`)

1. **`src/data/services.yaml`** — Top-level service categories (name, slug, icon, description). The `icon` field must be a valid Lucide React icon name.
2. **`content/services/{category-slug}/index.yaml`** — Lists pages under each category (`pages:` array with `name`, `slug`, `description`).
3. **`content/services/{category-slug}/{page-slug}.md`** — Actual markdown content for each service page.

When adding a new service category, you must:

- Add an entry to `src/data/services.yaml`
- Create `content/services/{slug}/index.yaml`
- Add the static import and mapping entry to `src/data/yamlLoader.ts` (`categoryIndexMap`)

#### Government (`content/government/`)

1. **`src/data/government.yaml`** — Top-level government categories (name, slug, icon, description).
2. **`content/government/{category-slug}/index.yaml`** — Lists pages under each category.
3. **`content/government/{category-slug}/{page-slug}.md`** — Markdown content for each department/office page.

When adding a new government category, you must:

- Add an entry to `src/data/government.yaml`
- Create `content/government/{slug}/index.yaml`
- Add the static import and mapping entry to `src/data/yamlLoader.ts` (`categoryIndexMap`, shared with services)

Markdown files are loaded dynamically via `import()` in `src/lib/markdownLoader.ts`. The title is extracted from the first `# Heading` and the description from the first paragraph.

#### Companion JSON files

A markdown page can have an optional companion JSON file with the same slug (e.g. `executive.md` + `executive.json`). The loader attempts to import the JSON and passes it to `interpolate()`, which replaces `{PLACEHOLDER}` tokens in the markdown. Resolution order: JSON value → `VITE_<KEY>` env var → unchanged token.

Example: `{MAYOR}` in the markdown is replaced with the `MAYOR` value from `executive.json`, or `VITE_MAYOR` if no JSON file exists.

### Internationalization

- i18next with `HttpBackend` loads translation files from `public/locales/{lang}/common.json`
- Language detection order: `localStorage` → `navigator` → `htmlTag`
- Fallback language: `en`
- Supported languages are defined in `src/types/index.ts` (`LanguageType`)
- Currently only `public/locales/en/common.json` exists

### Environment Variables

The app uses `VITE_GOVERNMENT_NAME` (referenced in `Services.tsx`) for branding. Additional env vars are configured via the setup script.

### UI Components

Reusable primitives live in `src/components/ui/`: `Section`, `Heading`, `Text`, `Card`, `ListItem`, `Breadcrumbs`, `ScrollToTop`. Use these instead of raw HTML elements for consistency.

### Code Style

- Single quotes, 2-space indentation, trailing commas (ES5), semicolons, 80-char line width (enforced by Prettier)
- Arrow functions omit parens for single arguments
