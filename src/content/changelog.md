# Design System Changelog

Canonical record of local shadcn customizations for team rollout.

## 2026-03-26

Scope: Button, Tooltip, and core design-token definitions.

### Button Component

- Source: `src/components/ui/button.tsx`.
- Radius changed from `rounded-md` to `rounded-sm` (base, `sm`, and `lg` sizes).
- Cursor behavior standardized: enabled buttons use pointer; disabled buttons use not-allowed cursor.
- Click feedback added: enabled buttons shift down by 2px on active press (`enabled:active:translate-y-0.5`).
- Disabled hover visuals suppressed by moving variant hover rules to `enabled:hover:*`.
- Added optional `disabledTooltip` prop. Tooltip renders only when button is disabled and the prop is provided.
- Added optional `loading` state to support slow API actions and async submit flows with clear in-button progress feedback.
- Loading behavior: shows a left spinner (`Loader`), disables interaction while pending, and switches cursor to `cursor-progress`.
- Icon-only loading behavior: shows spinner only (hides original icon while loading) to avoid dual-icon overlap.

### Tooltip Component

- Source: `src/components/ui/tooltip.tsx`.
- Added `TooltipPrimitive.Arrow` globally so all tooltips show the triangle.
- Radius changed from `rounded-md` to `rounded-sm`.
- Colors moved to dedicated tooltip tokens (not tied to primary color).

### Global Definitions

- `src/index.css`: `--radius-sm` now resolves to 4px (`calc(var(--radius) * 0.4)`).
- Heading alignment fix: global `h1` and `h2` now use `var(--foreground)`.
- Added tooltip tokens: `--tooltip`, `--tooltip-foreground`, and theme color mappings.
- Removed component-token overrides from `@media (prefers-color-scheme: dark)` to avoid mixed token sources.
- Locked native UI shift to explicit theme state: `:root` uses `color-scheme: light`; `.dark` uses `color-scheme: dark`.

### Changelog Page

- Added `/changelog` route in `src/main.tsx`.
- Added markdown content source at `src/content/changelog.md`.
- `src/pages/changelog.tsx` now renders changelog entries from markdown (using `react-markdown` + `remark-gfm`) for easier ongoing maintenance.
