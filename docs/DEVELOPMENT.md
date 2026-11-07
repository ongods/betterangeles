# Development and quality harness

Use Node.js 22.14.0 from `.nvmrc`, then run `npm ci`. In Windows PowerShell,
use `npm.cmd` if the execution policy blocks `npm.ps1`.

## Daily workflow

1. Read `AGENTS.md` and inspect `git status` before changing code.
2. Follow the existing module and content conventions. Keep changes focused.
3. Add a regression test when application behavior changes.
4. Run `npm run check` while working and `npm run check:ci` before review.

| Command                             | What it checks                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run check` / `npm run harness` | Formatting, lint, types, tests, and content QA                                                   |
| `npm run check:ci`                  | All local checks, production build, and built-content QA                                         |
| `npm run lint`                      | TypeScript/React rules, typed promise checks, import boundaries, and Node scripts; warnings fail |
| `npm run typecheck`                 | Strict application and tooling TypeScript projects                                               |
| `npm test`                          | All loader regression tests once                                                                 |
| `npm run test:watch`                | Vitest watch mode                                                                                |
| `npm run format:check`              | Read-only Prettier check                                                                         |
| `npm run format`                    | Apply the repository's Prettier style                                                            |
| `npm run qa:content`                | Curated content, links, reference integrity, and downloads                                       |

Checks stop on the first failure. Fix that failure and rerun the command.
`check:ci` rebuilds before checking `dist`; do not validate stale build output.
The harness does not need credentials, a running dev server, or network access
after dependencies are installed. CI uses a clean environment without `.env.local`.

Pre-commit runs ESLint and Prettier on staged code and formats staged YAML,
Markdown, JSON, CSS, and HTML. Pre-push runs the local checks. GitHub Actions
runs the full `check:ci` command on Linux and Windows for pushes and pull requests.
Running `npm ci` installs the hooks through the existing Husky prepare script.

## Architecture and readability

Application flow is `pages/composed components -> shared modules -> content`.

- `src/pages`: route behavior, state, and page composition.
- `src/components/layout`, `home`, and `sections`: composed site sections.
- `src/components/ui`: reusable presentation primitives.
- `src/data`: curated navigation, categories, and YAML loading.
- `src/lib`: shared rendering and content utilities.
- `src/hooks` and `src/types`: shared hooks and types.
- `content/services` and `content/government`: publishable Markdown and indexes.
- `content/reference`: retained evidence and source review snapshots.

ESLint prevents shared modules and UI primitives from importing pages or
composed sections. It also prevents application imports from `content/reference`.
Use the existing loader interfaces instead of adding another content-loading
path. Keep branching readable through early returns and small named functions;
ESLint limits nested control flow to four levels.

Type-aware rules catch floating promises and awaiting non-promises. Await a
promise or attach an error handler. `void` is appropriate only when the callee
already handles rejection. Prefer explicit types at module boundaries and avoid
casts that hide uncertain external data.

## Testing changes

Place focused `*.test.ts` or `*.test.tsx` files beside the behavior being tested.
Import test APIs from `vitest`; globals are intentionally disabled. The test
configuration shares the application Vite configuration so raw Markdown, YAML,
JSON, and dynamic content imports are exercised through the same transforms.
The default environment is Node, so these tests do not claim browser or
accessibility coverage.

Existing tests cover metadata with LF/CRLF line endings, optional JSON,
JSON/environment interpolation precedence, missing documents, service index
registration, government loading, unknown categories, and cache reuse. The
existing content QA command checks real pages, local links, reference hashes,
directory entries, and PDFs. Its `--build` mode also checks emitted page chunks,
download bytes, and excluded reference datasets.

Prefer assertions on returned content and behavior over implementation details
or large snapshots. Add a failure case when fixing error handling. Keep test
fixtures independent of current officials' names and network responses. Restore
mocks and environment changes; Vitest does this automatically after each test.
Focused tests (`it.only` / `describe.only`) fail in CI.

Government categories without registered indexes and incomplete source drafts
already exist. The harness preserves the documented source gaps rather than
inventing content. When adding a category, register its index in `yamlLoader.ts`
and update the appropriate top-level YAML. A source-gap entry requires actual
source review; do not add one merely to silence a failure.

## Formatting and saved evidence

Prettier follows `.prettierrc` and `.editorconfig`. `.gitattributes` keeps text
line endings consistent across Windows and Linux; binary downloads remain binary.
`content/reference` is excluded from formatting and linting because saved source
evidence, review snapshots, and their recorded hashes must retain their bytes.
Published content and application code remain checked.

The November planning import adds a separate immutable Google Doc snapshot and
publication inventory under `content/reference/angeles-city`. The offline
`scripts/import-angeles-planning.mjs` produces curated records in
`src/data/angeles.json`; it does not make reference evidence a runtime dependency.
`scripts/qa-angeles-planning.mjs` is included in content QA and checks source
identifiers, canonical barangay rows, snapshot integrity, inventory consistency,
and planning-evidence exclusion from the build. See
[implementation status](IMPLEMENTATION-STATUS.md) before refreshing a dataset.

Culture and events loads the official city's public Events Calendar and
WordPress news APIs directly in the browser. Requests omit credentials, bypass
the browser cache, and time out after 15 seconds. The page refreshes on visit,
every five minutes while visible, when it regains focus, and on manual refresh.
An unavailable feed does not hide the other feed; an earlier successful response
is labeled with its last successful update if refresh fails. There is no static
event fallback. The city currently allows cross-origin reads; an upstream policy
change will show the error state and official-site link. Tests mock the feeds, so
the quality harness remains independent of network availability.

## Existing tools considered

The repository already had ESLint, Prettier, strict TypeScript, Husky,
lint-staged, and a substantial content QA command. The harness composes these
tools through npm scripts instead of replacing them with another framework.

- [Vitest](https://vitest.dev/guide/features) reuses Vite transforms and supports
  TypeScript and module mocks. It supplies the missing regression-test layer.
- [Node's test runner](https://nodejs.org/api/test.html) is a useful built-in
  alternative, but would need extra transformation support for this app's raw
  YAML/Markdown imports and Vite environment variables.
- [Knip](https://knip.dev/explanations/how-knip-works) can find unused code and
  dependencies. It is deferred: the immediate gaps are executable tests and
  consistent gates; dynamic content imports would also need careful graph
  configuration before unused-file reports could become a reliable gate.
- [typescript-eslint typed rules](https://typescript-eslint.io/getting-started/typed-linting/)
  add promise correctness checks using the existing dependency.
- [ESLint import restrictions](https://eslint.org/docs/latest/rules/no-restricted-imports)
  enforce this repository's shared-module boundaries without another plugin.

Add further tooling only to address an observed gap. Keep commands documented
here and in `AGENTS.md`, and keep local and CI entry points aligned.
