# Kolar — Code Style & Quality Profile

> Reference doc for writing new code consistent with the existing repo. Derived from `.eslintrc.json`, `.prettierrc`, `tsconfig.base.json`, `nx.json`, `STYLE_GUIDE.md`, and a sweep of `libs/` + `apps/`.

---

## 1. Stack

- **Monorepo:** Nx 20, Yarn, TypeScript 5.7, React 18.
- **Styling:** Emotion CSS-in-JS (`@emotion/css`), Grafana theme tokens (`useStyles2`, `useTheme2`).
- **Host platform:** Grafana plugin (`@grafana/ui`, `@grafana/data`, `@grafana/runtime`, `@grafana/schema`).
- **State / async:** rxjs-heavy, custom typed `EventBus`, `zustand` for stores, `react-hook-form` (forked as `vu-react-hook-form`).
- **i18n:** `i18next` + `react-i18next`.
- **Backend:** Go 1.23 (`Magefile.go`, `go.mod`). Frontend is the bulk.

---

## 2. Layer Topology

Enforced via `@nx/enforce-module-boundaries` in `.eslintrc.json`. Violations fail lint.

```
resources → platform → common → data → components → core → modules → apps/plugins
external/ui ─┐
@grafana/ui ─┴→ components
```

Path aliases in `tsconfig.base.json` (`@vu/common`, `@vu/components`, `@vu/core`, `@vu/data`, `@vu/platform`, `@vu/resources`, `@vu/ui`, `@vu/utils`, `@vu/webpack`, `@vunet/ui`, `@vu/sqlParser`, module-specific `@vu/modules/*`). Deep `libs/*` imports banned.

Project tags drive the dep graph: `lib:*`, `core:*`, `module:*`, `plugin:*`, `app:*`.

---

## 3. Formatting & Lint

### Prettier (`.prettierrc`)
- 120 cols, single quotes, semicolons, `trailingComma: "es5"`, 2-space indent, no tabs.

### ESLint extends
`eslint:recommended`, `@typescript-eslint/recommended`, `unicorn/recommended`, `security/recommended`, `sonarjs/recommended`, `prettier`.

### Hard bans (error)
- `no-console` (allow `warn`/`error` only)
- `no-var`, `prefer-const`
- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unused-vars`
- `new-cap`, `curly`, `no-proto`, `no-unreachable`, `no-unneeded-ternary`
- `require-await`
- `react/jsx-no-bind` (arrow OK, `.bind`/named refs banned)
- `react/jsx-pascal-case`, `react/self-closing-comp`, `react/boolean-prop-naming` (nested validated)
- `react/jsx-max-depth: 8`
- `import/order` alphabetized + grouped with blank lines between groups
- `react-hooks/rules-of-hooks`

### Warn-only (stylistic tightening debt)
- `react-hooks/exhaustive-deps`
- `@typescript-eslint/no-non-null-assertion`
- `@typescript-eslint/ban-ts-comment`
- `sonarjs/cognitive-complexity: 18`
- `sonarjs/no-duplicate-string`, `no-nested-template-literals`
- `unicorn/consistent-destructuring`, `consistent-function-scoping`, `explicit-length-check`, `no-array-callback-reference`, `no-array-for-each`, `prefer-spread`

### Restricted imports
- `moment` — banned.
- `date-fns-tz` — banned.
- `@grafana/ui` primitives (`Button`, `Icon`, `IconButton`, `useStyles`, `useTheme`) — use `@vu/components`.
- `locationService` from `@grafana/runtime` — use `vuLocationService`.
- `DateTime`, `dateMath`, `dateTime`, `dateTimeAsMoment` from `@grafana/data` — warn (app-owned time utils).

---

## 4. File & Naming Conventions (`STYLE_GUIDE.md`)

- `.tsx` = PascalCase.
- One exported component per file.
- ≤600 lines per file (offenders exist in modules — see §8).
- File structure order:
  1. Imports
  2. Type definitions
  3. Component
  4. Local helpers / utilities (scoped to this file only)
  5. `getStyles`
- Barrel `index.ts` per lib; consumers import from `@vu/components` etc.
- PR title format: `<type>: [Ticket]:[Title]` (`feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `ci`, `build`, `revert`).
- Time on the wire: UTC ISO or epoch. Never local-tz strings.
- No customer names in code.

---

## 5. Patterns Observed

- **`React.forwardRef` + `displayName`** for primitive components (`VuButton`).
- **Styles** via `useStyles2(getStyles)` + `@emotion/css` `css({...})` factories. Theme tokens (`theme.spacing`, `theme.colors`, `theme.typography`). No raw hex/px for design tokens.
- **Typed EventBus** (`Bus<T extends { type: string }>`) wraps rxjs `Subject` with discriminated-union events. Overloaded `listen(matcher)` returns Observable; `listen(matcher, handler)` returns Subscription.
- **Type-safety utilities:** `invariant`, `assertValue`, `ensureValue`, `ensureValueOrDefault` — `asserts`-based narrowing. `unknown` preferred over `any` (see `getFieldErrorMessage`).
- **Perf hygiene:** heavy `useMemo` / `useCallback` / `React.memo`. `jsx-no-bind` forces stable handlers.
- **i18n:** `useTranslation()`, tagged-template idiom `` t`key` `` everywhere user-facing.
- **Meta-driven UI:** `DynamicForm` + `ComponentMapper` render forms from schema. `TableView<T>` generic, column metadata driven.
- **Module boundary tags:** see §2.

---

## 6. Comment & Doc Style

- JSDoc on public utilities and component props (param-by-param `@param`).
- Inline comments preserve rationale for Grafana-specific hacks (e.g. scrollbar override in `rootPage.tsx`, "Fork of grafana/..." headers).
- Triple-slash `///` used as emphasis for TODO/WARN notes.

---

## 7. Principles Honored

- **SRP / small lib surface:** layered libs, strict dep graph.
- **DIP-ish:** consumers depend on `@vu/components` abstractions, not Grafana primitives directly.
- **Open/closed via meta:** forms and tables config-driven.
- **Type-driven design:** discriminated unions, `asserts`, `Path<T>` from RHF, generic components (`TableView<T extends IObject>`).
- **Explicit over implicit:** `curly`, Pascal JSX, boolean prop naming prefixes.

---

## 8. Drift From Own Rules

| Area | Rule | Drift |
|---|---|---|
| File size | ≤600 LOC | `ReportTemplateDetails.tsx` 1129, `events.tsx` 1058, `ManageReportContents.tsx` 1023, `TableView.tsx` 959, `CreateOrEditInsightCard.tsx` 904, `LogForm.tsx` 894, `PipelineEditorSvg.tsx` 893 |
| Tests | Jest infra present | ~2 `.spec.*` files vs ~1669 ts/tsx source files — weakest spot |
| Null policy | `unicorn/no-null` disabled | Mixed `null`/`undefined` semantics |
| Complexity | `sonarjs/cognitive-complexity` warn only | Large files accumulate complexity |
| Hook deps | `react-hooks/exhaustive-deps` warn | Stale-closure risk |
| Non-null | `no-non-null-assertion` warn | `!` allowed |
| Imports | `sort-imports` disabled for declarations | Only `import/order` enforced |
| Fork debt | "Fork of grafana/..." headers | Upstream drift marker |

---

## 9. Checklist for New Code

1. Place in the correct lib per dep graph. Set tags in `project.json`.
2. Import from `@vu/*` alias, not `libs/*`. Group order: `builtin|external` → `internal` → `parent|sibling` → `type` → `index`, alphabetized, blank line between groups.
3. PascalCase `.tsx`, one exported component, ≤600 LOC. File order: imports → types → component → helpers → `getStyles`.
4. Styles via `useStyles2(getStyles)` + `theme.*` tokens. No hex/px literals for design tokens.
5. No `any`. Use `unknown` + narrowing, `asserts`, `invariant`, `ensureValue`.
6. No `console.log` (use `warn` / `error`). No `moment`. No raw `locationService`. No `@grafana/ui` `Button` / `Icon` / `IconButton` — use `@vu/components`.
7. Times in UTC epoch/ISO. Never local-tz strings on the wire.
8. i18n all user-facing strings (`useTranslation`, `` t`key` ``).
9. Stable callbacks (`useCallback`); no `.bind` in JSX; arrow handlers OK.
10. Boolean props prefixed `is` / `has` / `can` / `should` (enforced by `react/boolean-prop-naming`, nested validated).
11. Forms: `vu-react-hook-form` + `DynamicForm` meta. Not ad-hoc.
12. Cross-component comms: typed `Bus<T>` with `{ type: string }` union events.
13. JSDoc on public utilities and component props.
14. Commit / PR title: `<type>: [Ticket]:[Title]` with Conventional-Commits type.

---

## 10. Repo-Level Improvement Priorities

- Split 700+ LOC modules into sub-components + hooks.
- Land real unit/integration tests (Jest + React Testing Library infra already configured).
- Promote `cognitive-complexity`, `react-hooks/exhaustive-deps`, `no-non-null-assertion` to errors incrementally.
- Dedupe "fork of Grafana" files or formalize the fork layer.
- Pick one of `null` / `undefined` project-wide.

---

## 11. Evidence Pointers

- Lint config: `.eslintrc.json`
- Format: `.prettierrc`
- TS paths: `tsconfig.base.json`
- Nx config: `nx.json`
- Style guide: `STYLE_GUIDE.md`
- Primitive example: `libs/components/src/lib/button/VuButton.tsx`
- EventBus: `libs/level2/common/src/lib/utils/bus.ts`
- Type-safety utils: `libs/level2/common/src/lib/utils/invariant.ts`, `ensureValue.ts`, `getFieldErrorMessage.ts`
- Meta-driven form: `libs/components/src/lib/form/dynamicForm/DynamicForm.tsx`
- Generic table: `libs/components/src/lib/table/TableView.tsx`
- Root composition: `libs/core/src/lib/rootPage.tsx`
