# Repo Code Quality + Style Analysis

**Repo:** Grafana fork (vunetsystems/nairobi, Grafana 11.2.x)
**Stack:** Go backend (`pkg/`) + TypeScript/React frontend (`public/app/`, `packages/@grafana/*`)
**Structure:** Monorepo — Yarn workspaces + Nx + Lerna + Go workspaces

Mature codebase, strong conventions, heavy tooling. Style is not a suggestion — CI blocks.

---

## 1. Tooling (Automated Style Enforcement)

| Tool | Purpose | Config |
|---|---|---|
| Prettier | TS/JS format | `.prettierrc.js` — `trailingComma: es5`, single quotes, printWidth 120 |
| EditorConfig | Whitespace | `.editorconfig` — 2 spaces TS/JS/SCSS, tabs Go, LF, trim trailing, final newline |
| ESLint | TS/JS lint | `.eslintrc` — extends `@grafana/eslint-config`, custom rules |
| Stylelint | SCSS lint | `stylelint.config.js` |
| golangci-lint | Go lint | `.golangci.toml` — custom depguard bans deprecated pkgs |
| Betterer | Regression gate | `.betterer.ts` — locks error counts; new code can't regress |
| Lefthook | Pre-commit hook | `lefthook.yml` — parallel: betterer, eslint --fix, prettier, gofmt, cue-fix |
| Husky | Backup pre-commit | `.husky/pre-commit` |
| pa11y | A11y CI gate | `.pa11yci.conf.js`, `.pa11yci-pr.conf.js` |
| TypeScript | Type check | `tsconfig.json` — `strict: true`, `useUnknownInCatchVariables: true` |

**Takeaway:** Your generated code should pass `eslint`, `prettier`, `gofmt`, `betterer precommit`.

---

## 2. Frontend Style (TS/React)

Source of truth: `contribute/style-guides/frontend.md`. Based on Airbnb React style.

### 2.1 Naming

| Case | Usage |
|---|---|
| `PascalCase` | classes, types, interfaces (NO `I` prefix — `ButtonProps` not `IButtonProps`), enums, React components |
| `camelCase` | functions, methods, vars, props, state, emotion class keys |
| `ALL_CAPS` | module constants |
| `kebab-case` | directory names (`features/new-feature/...`) |

File name matches primary export case:
- `DashboardRow.tsx` (component export)
- `math.ts` (util group)
- `constants.ts`, `actions.ts`, `reducers.ts`
- `*.test.ts(x)` — colocated with subject

### 2.2 Components

**Function declarations preferred over arrow functions:**

```tsx
// bad
export const Component = (props: Props) => { ... }
// bad
export const Component: React.FC<Props> = (props) => { ... }
// good
export function Component(props: Props) { ... }
```

- Callback props + handlers prefixed `on*` (not `handle*`)
- Keep components small + focused; break large into subs
- Class components still allowed in legacy code (e.g. `DashboardRow.tsx`); new code = functional

### 2.3 Exports

- Named exports only. No `export default`.
- Declaration exports: `export const foo = ...`.
- Export only what is used outside the module.

### 2.4 Typing

- Let TS infer locally
- Annotate empty arrays: `const xs: string[] = []`
- Explicit return types on new exported functions (lint not yet enforced — legacy debt)
- `strict: true`; avoid `any`

### 2.5 Styling (Emotion-in-JS)

Object syntax, camelCase keys:

```tsx
const getStyles = (theme: GrafanaTheme2) => ({
  elementWrapper: css({
    padding: theme.spacing(1, 2),
    background: theme.colors.background.secondary,
  }),
});
```

Rules:
- Use `useStyles2(getStyles)` to memoize
- Compose with `cx`, not prop-driven `getStyles`
- Theme tokens always (`theme.spacing`, `theme.colors.*`) — no hex literals
- No hard border-radius (`@grafana/no-border-radius-literal` lint)
- Respect reduced-motion: `theme.transitions.handleMotion('no-preference', 'reduce')`
- SASS deprecated, `gf-form` banned by Betterer

### 2.6 Imports

`import/order` enforced — 5 groups, blank line between, alphabetized:

```tsx
import { css, cx } from '@emotion/css';        // 1. builtin/external
import { indexOf } from 'lodash';
import { Component } from 'react';

import { GrafanaTheme2 } from '@grafana/data'; // 2. internal (@grafana/*, app/*)
import { selectors } from '@grafana/e2e-selectors';
import appEvents from 'app/core/app_events';

import { ShowConfirmModalEvent } from '../../../../types/events'; // 3. parent

import { DashboardModel } from '../../state/DashboardModel';      // 4. sibling

import { RowOptionsButton } from '../RowOptions/RowOptionsButton'; // 5. index
```

**Restricted imports:**
- `useDispatch`/`useSelector` → from `app/types` (typed wrappers)
- `Trans`, `t` → from `app/core/internationalization` (not `react-i18next` directly)
- Lodash: member imports only (`import { indexOf } from 'lodash'`)
- Core plugins can't reach into core (`import/no-restricted-paths`)
- No barrel files (`no-barrel-files` plugin)

### 2.7 Feature Layout

```
public/app/features/<feature>/
├── components/        # React components
├── containers/        # Page-level
├── state/             # Redux actions, reducers, selectors
├── api.ts             # HTTP calls (not in thunks)
├── utils.ts
├── types.ts
├── constants.ts
└── *.test.tsx         # Colocated
```

### 2.8 Redux

- Redux Toolkit only (`createSlice`)
- No mutation in reducers/thunks
- Typed thunks
- `reducerTester` / `thunkTester` fluent helpers
- Selectors only — never access state directly

### 2.9 i18n

Namespaced keys, always via wrapper:

```tsx
import { Trans, t } from 'app/core/internationalization';

const label = t('browse-dashboards.new-folder-form.name-label', 'Folder name');
<Trans i18nKey="browse-dashboards.new-folder-form.cancel-label">Cancel</Trans>
```

### 2.10 Testing

- React Testing Library
- `@testing-library/user-event` for interactions
- Stable test IDs: `data-testid={selectors.components.DashboardRow.title(title)}` from `@grafana/e2e-selectors`
- Jest `describe` / `it`
- Arrange-act-assert structure
- `jest/no-focused-tests` = error (no `.only` committed)

### 2.11 Accessibility

- `jsx-a11y/recommended` on all `*.tsx` (test files excluded)
- Semantic HTML (`<button type="button">`)
- `aria-expanded`, `aria-label`
- `jsx-a11y/label-has-associated-control` with custom control list
- Opt-outs documented inline with `// eslint-disable-next-line ...`

---

## 3. Backend Style (Go)

Source: `contribute/backend/style-guide.md`, `contribute/backend/package-hierarchy.md`.
Base: Effective Go + Go Code Review Comments. `gofmt -s` enforced pre-commit.

### 3.1 Package Architecture (Ben Johnson's standard layout)

```
pkg/services/<feature>/             # Root: interfaces + domain types + errors
├── <feature>.go                    # Interface + types
├── errors.go                       # Sentinel errors
├── models.go
├── <feature>_mock.go               # Generated mockery mock
└── service/                        # Impl sub-package
    ├── <feature>_service.go
    ├── <feature>_service_test.go
    └── <feature>_service_integration_test.go
```

Rules:
- Root package = interfaces + domain types only; avoid depending on other services
- Sub-packages depend on root, not the other way (avoid cycles)
- Test doubles in `<feature>test` sub-package
- Store interface separate from service logic
- Name sub-packages for project-wide uniqueness (`teaimpl` not `impl`)

### 3.2 Service Pattern

```go
package service

type DashboardServiceImpl struct {
    cfg                  *setting.Cfg
    log                  log.Logger
    dashboardStore       dashboards.Store
    folderStore          folder.FolderStore
    ac                   accesscontrol.AccessControl
    metrics              *dashboardsMetrics
}

var (
    _ dashboards.DashboardService             = (*DashboardServiceImpl)(nil)
    _ dashboards.DashboardProvisioningService = (*DashboardServiceImpl)(nil)
)

func ProvideDashboardServiceImpl(
    cfg *setting.Cfg, dashboardStore dashboards.Store, /* ... */
) (*DashboardServiceImpl, error) {
    /* ... */
}

func (dr *DashboardServiceImpl) GetDashboard(ctx context.Context, query *GetDashboardQuery) (*Dashboard, error) {
    return dr.dashboardStore.GetDashboard(ctx, query)
}
```

Conventions:
- `ProvideXxx` constructor (Wire DI)
- Compile-time interface satisfaction: `_ Iface = (*Impl)(nil)`
- `context.Context` always first param
- Query / Command structs — not positional args
- Per-service `log.Logger` (`log.New("dashboard-service")`)
- Per-service Prometheus metrics

### 3.3 Error Handling

- Typed sentinel errors in `errors.go`: `ErrDashboardTitleEmpty`, `ErrDashboardInvalidUid`
- Go 1.13 stdlib errors — no `pkg/errors`
- Wrap with `fmt.Errorf("...: %w", err)`

### 3.4 Interface Mocking

```go
// DashboardService is a service for operating on dashboards.
//
//go:generate mockery --name DashboardService --structname FakeDashboardService --inpackage --filename dashboard_service_mock.go
type DashboardService interface { /* ... */ }
```

- Mockery generates mocks; `//go:generate` comment above interface
- Manual mocks with testify `mock.Mock` for smaller interfaces
- `AssertExpectations(t)` to verify call counts

### 3.5 Testing

- stdlib `testing` + testify
- `require.*` = halting checks (use for errors)
- `assert.*` = soft checks
- `t.Run` for sub-tests
- `t.Cleanup` preferred over `defer`
- Integration tests: `TestIntegrationXxx` + `if testing.Short() { t.Skip(...) }`
- One `TestMain` per package calling `testsuite.Run(m)`
- DB tests MUST have `TestMain` for cleanup

### 3.6 Banned Dependencies (depguard)

| Banned | Reason | Use instead |
|---|---|---|
| `io/ioutil` | Deprecated Go 1.16+ | `io` / `os` |
| `github.com/pkg/errors` | Go 1.13 stdlib covers it | `errors`, `fmt.Errorf("%w")` |
| `gopkg.in/yaml.v2` | Outdated | `gopkg.in/yaml.v3` |
| `github.com/gofrs/uuid` | Duplicate dep | `github.com/google/uuid` |
| `github.com/xorcare/pointer` | | `pkg/util.Pointer` |
| Core pkg imports in core plugins | Layering | — |

### 3.7 Misc Go Rules

- Avoid globals (legacy has many — migration in progress)
- Prefer value types; pointers only for mutation / perf / nil-semantics
- `simplejson` legacy — new code uses `encoding/json`
- No foreign keys in migrations (historical)
- XORM `Insert`/`InsertOne` return affected rows, not PK — easy footgun

---

## 4. Monorepo + Build

- **Yarn workspaces** + **Nx** (`nx.json`, `project.json`) — task caching
- **Lerna** versions `@grafana/*` packages together, pinned to Grafana version
- **Go workspaces** (`go.work`)
- **Webpack** (dev + prod in `scripts/webpack/`)
- **CUE schemas** (`kinds/`) for data model — `make fix-cue` on commit
- **Drone CI** (`.drone.yml`, `.drone.star`)
- **Sonar** (`sonar-project.properties`)

---

## 5. Universal SE Principles — Scorecard

| Principle | Score | Evidence |
|---|---|---|
| SRP | strong | small components/services, break-up rules enforced |
| DIP | strong | interfaces in root pkg, impl in subpkg, DI via `Provide*` |
| ISP | strong | `DashboardService` / `PluginService` / `Store` split vs one god-interface |
| OCP | good | feature flags via `featuremgmt`, plugin architecture |
| DRY | good | shared `@grafana/ui`, `@grafana/data`, `@grafana/runtime` |
| YAGNI | mixed | legacy xorm/simplejson over-engineering, actively deprecated |
| Testing | strong | unit + integration + e2e (Cypress + Playwright), a11y CI (pa11y) |
| A11y | strong | jsx-a11y, pa11y, semantic HTML, ARIA, reduced-motion |
| i18n | strong | namespaced keys, custom wrapper, lint-enforced imports |
| Error handling | good | typed sentinel errors, `require`/`assert` discipline |
| Immutability | good | Redux Toolkit, no-mutate rule |
| Naming | strong | documented + linted casing |
| Dead code | tracked | Betterer prevents regression; deprecated paths documented |
| Observability | strong | `log.Logger`, Prometheus metrics per service |
| Security | good | `.trivyignore`, SECURITY.md, depguard, CLA required |
| Dependency hygiene | strong | depguard deny list, banned deprecated pkgs |
| Cohesion | strong | package-by-feature (frontend + backend) |

### Weak Spots (acknowledged internally)

- Legacy Angular being removed (`public/app/angular`, Grafana 11 target)
- Class components remain in dashboard/panel area
- Global vars in backend config (migration in progress)
- `simplejson` + `xorm` legacy
- SASS → Emotion migration ongoing (`gf-form` banned)
- Many files on Betterer ignore list during migration

---

## 6. Checklist for Future Code Consistency

### TS/React

1. `function Foo(props: Props)` — not arrow const, not `React.FC`
2. Named exports only, no default
3. Import order: external → `@grafana/*` / `app/*` → parent → sibling → index, alphabetized, blank line between groups
4. Lodash: `import { x } from 'lodash'`
5. Props interface above component, callbacks `on*`
6. Emotion object-syntax, `useStyles2`, theme tokens only, no hex, no literal border-radius
7. `data-testid` via `@grafana/e2e-selectors` when stable
8. Redux: `createSlice`, selectors, no mutation
9. i18n: `t('<feature>.<area>.<key>', 'fallback')` from `app/core/internationalization`
10. Strict TS; no `any` unless justified; explicit return types on exports
11. `kebab-case` folder, `PascalCase.tsx` for components, `camelCase.ts` for utils, `*.test.tsx` colocated

### Go

1. Package-by-feature: interface at root, impl in sub-pkg
2. `ProvideX` constructor returning concrete type
3. `context.Context` first arg
4. Query / Command structs — not positional args
5. Sentinel errors in `errors.go`
6. `_ Iface = (*Impl)(nil)` compile-time check
7. `//go:generate mockery ...` comment above interface
8. testify `require` / `assert`, `t.Run`, `t.Cleanup`
9. Integration test = `TestIntegrationXxx` + `testing.Short()` skip
10. No `io/ioutil`, `pkg/errors`, `yaml.v2`, `simplejson` (new code); stdlib `encoding/json`
11. `gofmt -s` before commit

### Commits / PRs

- Jira-style prefix observed: `CCBD-XXXX:` / `VUQA-XXXX:` / plain `Subject (#PR)`
- `first-commit (#NNN)` pattern used for release branches — fork convention, not upstream Grafana

---

## 7. Key Reference Files

- `.eslintrc` — lint rules
- `.prettierrc.js` — format config
- `.editorconfig` — whitespace
- `.golangci.toml` — Go lint + depguard
- `.betterer.ts` — regression gate
- `lefthook.yml` — pre-commit hooks
- `tsconfig.json` — TS strict config
- `contribute/style-guides/frontend.md` — frontend style (authoritative)
- `contribute/style-guides/redux.md` — redux patterns
- `contribute/style-guides/styling.md` — emotion + themes
- `contribute/style-guides/accessibility.md` — a11y rules
- `contribute/backend/style-guide.md` — Go style
- `contribute/backend/package-hierarchy.md` — Go arch
- `contribute/backend/services.md` — service structure
