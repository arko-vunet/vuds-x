# Design System Changelog

Canonical record of local shadcn customizations for team rollout.

## 2026-03-27

Scope: Button Group and Dropdown Menu primitives, plus trial page demos.

### Button Group Component

- Added `src/components/ui/button-group.tsx`.
- Introduced `ButtonGroup`, `ButtonGroupSeparator`, and `ButtonGroupText` primitives.
- Added orientation support (`horizontal` and `vertical`) with `role="group"` and `data-slot` attributes.
- Implemented grouped-control styling behavior so adjacent buttons collapse borders and share edge rounding, matching shadcn grouped layouts.
- Added nested group spacing rules so complex groups (multiple inner `ButtonGroup` blocks) align like the docs patterns.

### Dropdown Menu Component

- Added `src/components/ui/dropdown-menu.tsx`.
- Introduced a full shadcn-style Radix wrapper with:
  - `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`
  - `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuSeparator`
  - `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`
  - `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`
  - plus `DropdownMenuCheckboxItem`, `DropdownMenuLabel`, `DropdownMenuShortcut`, `DropdownMenuPortal`.
- Added item variants support (`default`, `destructive`) so destructive actions can be styled in menus.

### Trial Page

- Source: `src/pages/trial.tsx`.
- Added Button Group demo coverage:
  - base horizontal group
  - vertical group
  - text + button group
  - complex grouped layout with nested dropdown interactions and radio submenu state.
- Updated section separators so `<hr />` appears only at major section boundaries:
  - between button demos and button-group demos
  - between button-group demos and badge demos.

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
- Vertical sizing tightened for better density:
  - `default` buttons now render at exactly 32px height.
  - `sm` buttons now render at exactly 24px height.
  - `lg` remains unchanged for now.
- `sm` label typography reduced by one step (`text-xs`) to match the smaller control height.
- Height tokens for `default` and `sm` moved to explicit px classes (`h-[32px]`, `h-[24px]`) to prevent rem-based drift from root font-size changes.
- Icon-only sizing aligned with the same scale:
  - `icon` now maps to 32px.
  - Added `icon-sm` at 24px.
  - Added `icon-lg` at 40px.
- Icon-loading detection now applies to all icon-only sizes (`icon`, `icon-sm`, `icon-lg`) for consistent spinner behavior.

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
- Root typography normalized to web defaults:
  - Changed `:root` base from 18px to 16px (no desktop/mobile split).
  - Reason: rem values should be predictable and align with ecosystem defaults; this avoids unexpected scaling (for example, `h-8` becoming 36px).
- Kept visual hierarchy stable after root-size normalization:
  - Body tracking scaled from `0.18px` to `0.16px`.
  - `--radius` increased to `0.703125rem` so effective corner rounding stays consistent in px after the rem baseline changed.

### Changelog Page

- Added `/changelog` route in `src/main.tsx`.
- Added markdown content source at `src/content/changelog.md`.
- `src/pages/changelog.tsx` now renders changelog entries from markdown (using `react-markdown` + `remark-gfm`) for easier ongoing maintenance.
