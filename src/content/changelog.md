# Design System Changelog

Canonical record of local shadcn customizations for team rollout.

## 2026-04-30 (typography)

Scope: Typography system rollout — an 11-step type scale tuned for info-dense product surfaces, plus `Heading`, `Text`, `Code`, and `Kbd` primitives that consume the scale.

### Type Scale

- Source: `src/index.css`.
- Added a typographic scale tuned for info-dense product surfaces (default body 14px, mirroring the density used by Linear, Stripe Dashboard, Vercel, and Datadog).
- 11 steps total — sized for actual product needs, not marketing surfaces:
  - Title: `title-lg`, `title-md`, `title-sm`, `title-xs` (page → card hierarchy).
  - Body: `body-lg`, `body-md` (default), `body-sm`, `body-xs` (metadata).
  - Caption: a single `caption` step at 11/14 with positive tracking (intended for uppercase eyebrows + status microcopy).
  - Code: `code-md`, `code-sm` (mono numerals + snippets).
- No display tier (36–56px hero sizes). Pure product surfaces don't need them; big-number metrics belong in a future `Metric` / `Stat` component, not a heading scale.
- Tracking convention encoded into the tokens themselves:
  - Titles tighten slightly (`-0.42px` → `0`) so they don't drift apart at larger sizes.
  - Body stays at 0 tracking.
  - Sub-body and caption widen tracking (`+0.06`, `+0.12`, `+0.22`) so small copy doesn't collapse visually at 11–13px.
- Weight pairs: `400` regular (body, code), `500` medium (caption), `600` semibold (titles).
- Line-heights snap to 4-px grid increments wherever possible so adjacent text blocks share a vertical rhythm.
- Each token is exposed in three forms:
  - Raw vars: `--type-{step}-size`, `--type-{step}-line`, `--type-{step}-track`, `--type-{step}-weight`.
  - Tailwind v4 composite text utilities: `text-title-lg`, `text-title-md`, `text-body-sm`, `text-caption`, `text-code-md`, etc. — each utility sets size, line-height, letter-spacing, and font-weight in one class.
  - React component props: `<Heading size="title-lg" />`, `<Text size="body-sm" />`, `<Code size="md" />`.

### Color Tokens

- Source: `src/index.css`.
- Added `--foreground-subtle` (alias of `--neutral-500` in light, dark-mode-aware via the existing neutral ramp) for the third foreground tier between `foreground` and `muted-foreground`. Used for de-emphasized rows, eyebrow microcopy, table metadata, and inactive nav items.
- Exposed `--foreground-subtle` to Tailwind as `text-foreground-subtle` via `@theme inline`.
- Promoted `--code-bg` to a Tailwind utility (`bg-code-bg`) via `@theme inline`, and added a dark-mode override mapping it to `var(--neutral-100)` so inline code reads correctly on both themes.

### Font Stack Tokens

- Source: `src/index.css`.
- Promoted `--heading` and `--mono` to Tailwind utilities (`font-heading`, `font-mono`) via `@theme inline`, alongside the pre-existing `font-sans`. Components and consumers can now reach for the same font tokens without inline `style={{ fontFamily }}`.

### Typography Components

- Added `src/components/ui/typography.tsx` with the new primitives and `src/components/ui/typography-variants.ts` for the CVA configs (extracted to satisfy fast-refresh lint).
- `<Heading>`:
  - `level={1..6}` renders the matching semantic tag (`h1`–`h6`).
  - `size` defaults to a sensible step for each level (`h1 → title-lg`, `h2 → title-md`, `h3 → title-sm`, `h4/h5/h6 → title-xs`); pass `size` to override without changing semantics.
  - `tone` selects the color tier (`default`, `muted`, `subtle`, `destructive`, `success`, `info`, `warning`, `inverse`).
  - `weight` and `tracking` are escape hatches; `asChild` supported via Radix `Slot`.
- `<Text>`:
  - `as="p|span|div|li|strong|em|small"` controls the rendered element; default `<p>`.
  - `size` covers `body-lg`/`body-md`/`body-sm`/`body-xs`/`caption`; default `body-md`.
  - First-class layout knobs: `tabular` (digits lock width via `tabular-nums`, critical for tables and numeric columns), `mono` (switches to `font-mono`), `truncate`, `align`, `transform`.
  - Same `tone`/`weight` system as `Heading`.
- `<Code>`:
  - Variants: `default` (filled `bg-code-bg`), `muted` (uses muted tokens, intended for IDs alongside copy), `ghost` (no fill, font-only).
  - `size` is `md` (default) or `sm`.
  - `block` prop renders a `<pre><code>` with `overflow-x-auto` for snippet blocks.
- `<Kbd>`:
  - Single primitive matching the keyboard-key affordance used in the new Command palette demo.
  - Geometry: 20px tall, 1px `border-border`, `bg-muted`, 10px mono font, 4-px radius, intentionally smaller than chips so it reads as a key rather than a tag.

### Library Exports

- Source: `src/index.ts`.
- Re-exported `typography` so consumers can import `Heading`, `Text`, `Code`, `Kbd` from `@vunet/vuds-x` directly.

### Demo App Fonts

- Source: `src/main.tsx`.
- Loaded `@fontsource/ibm-plex-sans/600.css` so the new title-tier weights render at the correct stroke (previously only 400/500 were loaded; 600 was being browser-synthesized).

### Trial Page

- Source: `src/pages/trial.tsx`.
- Added a top-of-page Typography section ahead of the existing Buttons section so the type system reads as foundational. Sub-sections:
  - **Typography Scale**: each of the 11 steps rendered with a left-rail spec hint (`size / line / tracking / weight`) and a real product-style sample on the right.
  - **Tone**: full matrix of all eight tones, including the `inverse` tone rendered on a primary surface so the on-dark variant can be evaluated.
  - **Tabular Numerals**: side-by-side comparison of proportional vs `tabular` so the column-alignment behavior is visible at a glance.
  - **Heading by Level**: `<h1>`–`<h6>` with each one labelled with its default size mapping.
  - **Code + Kbd**: inline `Code` variants (`default`, `ghost`, `muted`), a `block` snippet, and a `⌘ K` keyboard hint composed of `Kbd` chips.

## 2026-04-30

Scope: Surface, layering, and form-control primitive rollout — Card, Skeleton, Avatar, Switch, Progress, Slider, Toggle, Toggle Group, Scroll Area, Accordion, Tabs, Popover, Select, Dialog, Sheet, and Command/Combobox.

### New Component Dependencies

- Added project dependencies: `@radix-ui/react-accordion`, `@radix-ui/react-avatar`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, and `cmdk`.

### Card Component

- Added `src/components/ui/card.tsx`.
- Introduced `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.
- Surface uses `bg-card` / `text-card-foreground` with a `rounded-lg` corner to match the larger-surface scale set by `--radius-lg`.
- Default elevation uses `shadow-xs` so cards sit on the page without competing with focused controls.
- `CardHeader` supports an optional `CardAction` slot via container query (`grid-cols-[1fr_auto]` only when an action is present), so action-less headers stay left-aligned without extra columns.
- `CardFooter` collapses border padding when the parent or footer adds `border-t`, matching the same pattern used inside `Field` and `Alert`.

### Skeleton Component

- Added `src/components/ui/skeleton.tsx`.
- Single primitive: `Skeleton` using `bg-muted` and `animate-pulse`, with `rounded-sm` to match the small-control radius scale.
- Intentionally minimal so callers compose shapes (rectangles, circles, lines) by overriding `className`.

### Avatar Component

- Added `src/components/ui/avatar.tsx` using `@radix-ui/react-avatar` primitives.
- Introduced `Avatar`, `AvatarImage`, `AvatarFallback`.
- Default size is `size-8` (32px) so avatars align visually with `Button` `default`/`icon` controls.
- Fallback uses `bg-muted` / `text-muted-foreground` and `text-xs font-medium` for consistent initials styling.

### Switch Component

- Added `src/components/ui/switch.tsx` using `@radix-ui/react-switch` primitives.
- Track sized 30×18 with a 14px thumb so it reads as a control distinct from `Checkbox` (square, 16px).
- States:
  - `checked`: `bg-primary` track.
  - `unchecked`: `bg-input` track in light, `bg-input/60` in dark for clearer affordance against the page background.
- Focus ring follows the shared 3-px ring pattern used on `Button` and `Checkbox` (`focus-visible:ring-ring/50 focus-visible:ring-[3px]`).

### Progress Component

- Added `src/components/ui/progress.tsx` using `@radix-ui/react-progress` primitives.
- Track height is `h-1.5` (6px), track color `bg-muted`, fill `bg-primary`.
- Indicator animates via `transform: translateX` with a `transition-transform` so values change smoothly in place.

### Slider Component

- Added `src/components/ui/slider.tsx` using `@radix-ui/react-slider` primitives.
- Supports horizontal and vertical orientation via `data-[orientation=*]` styling on track/range.
- Multiple thumbs supported by deriving thumb count from `value`/`defaultValue`.
- Thumb visuals:
  - 16px circle with `border-2 border-primary` and `bg-background` for clear contrast on both light and dark themes.
  - hover halo via `hover:ring-primary/20 hover:ring-4`.
  - focus ring uses the same 3-px ring style as `Button` for consistency.
- Disabled track + thumbs use `data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed`, matching disabled affordance across the system.

### Toggle Component

- Added `src/components/ui/toggle.tsx` using `@radix-ui/react-toggle` primitives.
- Variants: `default` (transparent ground) and `outline` (border + shadow), aligned with `Button` outline visuals.
- Sizes match `Button` heights so toggles can sit alongside buttons in a row without alignment drift: `default` 32px, `sm` 24px, `lg` 40px.
- On state uses `bg-accent` / `text-accent-foreground` instead of `bg-primary` so toggles read as “active” without competing with primary CTAs.

### Toggle Group Component

- Added `src/components/ui/toggle-group.tsx` using `@radix-ui/react-toggle-group` primitives.
- Variant + size are propagated from the group to children via React context, so `<ToggleGroupItem />` doesn’t need each variant set explicitly.
- Adjacent items collapse borders (outline variant) and share edge rounding via `first:rounded-l-sm last:rounded-r-sm` and `data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l`, matching the grouped-control behavior already established in `ButtonGroup`.

### Scroll Area Component

- Added `src/components/ui/scroll-area.tsx` using `@radix-ui/react-scroll-area` primitives.
- Exposes `ScrollArea` (root + viewport composed) and a standalone `ScrollBar` for advanced cases.
- Scrollbar uses `bg-border` thumb on a transparent border-side track for a flush, neutral look against `Card` and `Popover` surfaces.
- Viewport inherits the parent border radius (`rounded-[inherit]`) so scrollable content respects card corners.

### Accordion Component

- Added `src/components/ui/accordion.tsx` using `@radix-ui/react-accordion` primitives.
- Items separated with `border-b last:border-b-0` for a quiet visual ladder; no per-item background fill.
- Trigger uses `hover:underline` (matches the linkish affordance already used by the `link` button variant) and rotates a `ChevronDownIcon` on `data-state=open`.
- Open/close use newly-added shared keyframes (see Global Definitions below).

### Tabs Component

- Added `src/components/ui/tabs.tsx` using `@radix-ui/react-tabs` primitives.
- `TabsList` is a 36px-tall pill (`bg-muted`) holding `TabsTrigger` chips, sized for parity with `Button` `sm`.
- Active trigger surfaces with `bg-background` and `shadow-xs` so the selected state lifts off the muted track.
- Dark-mode active state uses `bg-input/30` so the active chip stays distinguishable on the dark muted background.

### Popover Component

- Added `src/components/ui/popover.tsx` using `@radix-ui/react-popover` primitives.
- Surface uses `bg-popover`, `text-popover-foreground`, `border`, `shadow-md`, with the same `data-[state=open]:animate-in` motion pattern already used by `DropdownMenu` and `TooltipContent`.
- Default `align="center"` and `sideOffset=4` to match how dropdowns offset from triggers.

### Select Component

- Added `src/components/ui/select.tsx` using `@radix-ui/react-select` primitives.
- Trigger geometry matches `Input`: `rounded-sm`, 32px default height, with a `data-size="sm"` variant at 24px to match `Button` `sm` and `Input` compact callsites.
- Trigger colors:
  - light: transparent fill on `border-input`.
  - dark: `bg-input/30` (matches `Input` disabled fill semantics) with a `bg-input/50` hover for clearer affordance.
- Hover on the trigger uses `bg-accent/40` (light) so the field hint mirrors how `DropdownMenuItem` uses `bg-accent` for active items.
- Focus ring uses the shared 3-px ring style for consistency with `Button` and `Checkbox`.
- Content surface uses `bg-popover` with the same animate-in/animate-out / slide-in motion as `DropdownMenu` for a unified popover language.
- Item active state uses `focus:bg-accent` and renders an `ItemIndicator` (`CheckIcon`) inside an absolutely-positioned right-side slot, leaving label space free of leading checks.

### Dialog Component

- Added `src/components/ui/dialog.tsx` using `@radix-ui/react-dialog` primitives.
- Composed primitives: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`.
- Overlay uses `bg-black/50` for a single, neutral scrim on both themes.
- Content surface: centered, `rounded-lg`, `bg-background`, `shadow-lg`, with `zoom-in-95`/`zoom-out-95` and fade motion to match other layered surfaces.
- Optional inline close button (`showCloseButton`) is on by default and uses an `XIcon` lucide glyph at `size-4` to match other system icons.

### Sheet Component

- Added `src/components/ui/sheet.tsx` reusing `@radix-ui/react-dialog` primitives (Sheet shares Dialog underneath; the public surface is intentionally separate).
- `side` prop supports `right` (default), `left`, `top`, and `bottom`, with side-specific borders so the sheet reads as a slide-in panel rather than a centered modal.
- Side-specific motion (`slide-in-from-*` / `slide-out-to-*`) wires to `data-state` for open/close transitions; durations differ for open (500ms) and close (300ms) so dismissals feel fast and entrances feel deliberate.

### Command / Combobox Component

- Added `src/components/ui/command.tsx` using `cmdk` primitives.
- Composed primitives: `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`.
- Input uses a leading `SearchIcon` and matches `Input` typography (`text-sm`) so the palette field feels native to the rest of the form layer.
- Items use `data-[selected=true]:bg-accent / text-accent-foreground` (the same hover language as `DropdownMenuItem`) so keyboard- and pointer-active rows look identical.
- `CommandDialog` reuses the new `Dialog` primitive but hides the dialog title/description via `sr-only` (kept for assistive tech) and renders the command surface flush inside the dialog (`p-0`).

### Global Definitions

- Source: `src/index.css`.
- Added accordion height-animation keyframes and tokens inside `@theme inline`:
  - `--animate-accordion-down: accordion-down 0.2s ease-out`
  - `--animate-accordion-up: accordion-up 0.2s ease-out`
  - `@keyframes accordion-down` from height 0 to `var(--radix-accordion-content-height)`.
  - `@keyframes accordion-up` from `var(--radix-accordion-content-height)` to height 0.
- These animations are consumed by `Accordion` via Tailwind v4’s `animate-accordion-down` / `animate-accordion-up` utilities.

### Library Exports

- Source: `src/index.ts`.
- Re-exported all newly added primitives so consumers can import from `@vunet/vuds-x` directly:
  - `accordion`, `avatar`, `card`, `command`, `dialog`, `popover`, `progress`, `scroll-area`, `select`, `sheet`, `skeleton`, `slider`, `switch`, `tabs`, `toggle`, `toggle-group`.

### Trial Page

- Source: `src/pages/trial.tsx`.
- Added live demos for every new component, each with state where it makes sense (Switch, Slider single + range, Toggle Group single + multiple, Tabs, Command, Popover, Dialog, Sheet, Progress with auto-stepping value).
- Added a `⌘K` / `Ctrl+K` shortcut on the trial page that toggles the `CommandDialog` palette.
- Card demo composes `Progress` inside a card to show real layout interplay (Pro plan summary + Storage usage).
- Skeleton demo is laid out inside a `Card` row to show the loading pattern in context (avatar circle + two text lines + action stub).
- Sheet demo iterates all four sides (`right`, `left`, `top`, `bottom`) with the same internal `Field` form so the side variants can be compared directly.
- Tabs demo populates each panel with a real `Card` (Overview, Usage with `Progress` bars, Billing) instead of placeholder text so the active-state visuals can be evaluated against real content.
- Avatar demo includes a stacked, ring-bordered group (`+4` tail) to validate `ring-2 ring-background` rendering on real surfaces.

## 2026-04-29

Scope: Skills ledger page for agent skills, AI tooling, and external sources used during repo creation and maintenance.

### Data Table Component

- Added `src/components/ui/data-table.tsx` using `@tanstack/react-table`.
- Added code-local product notes documenting the current fintech/enterprise table stance:
  - visible query state
  - explicit selection scope
  - numeric alignment and tabular figures
  - client/server row-model split
  - prop-gated add-on surface for later table features.
- Added a transaction-review demo to `src/pages/trial.tsx` with saved-view style buttons, filter chips, column visibility, row selection, bulk actions, export action, and dense pagination.

### Skills Page

- Added markdown content source at `src/content/skills.md`.
- Added `/skills` route via `src/pages/skills.tsx`.
- Added shared markdown renderer at `src/components/markdown-content-page.tsx` and moved Changelog rendering to it.
- Added Skills links on the landing page and trial badge link area.

## 2026-04-16

Scope: Form-field composition rollout (`Field` + `Input`) and button disabled-state polish, with expanded trial page coverage.

### Field Component

- Added `src/components/ui/field.tsx`.
- Introduced form-composition primitives:
  - `Field`, `FieldLabel`, `FieldDescription`, `FieldError`
  - `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator`, `FieldContent`, `FieldTitle`.
- Added shared `required` context on `Field` so:
  - `FieldLabel` can show a required asterisk indicator (`*`) automatically.
  - `FieldLabel` can opt out via `hideRequiredIndicator`.
- Added prop-driven label help affordance on `FieldLabel`:
  - `info` renders inline info icon with tooltip content.
  - `infoAriaLabel` customizes icon trigger accessible label.
  - Space between label cluster (`label` + optional `*`) and info icon is `gap-1` (4px).
- Tightened required-indicator spacing in `FieldLabel` from `gap-2` (8px) to `gap-0.5` (2px) for closer label-to-asterisk alignment.
- Added orientation variants for `Field` (`vertical`, `horizontal`, `responsive`) and field-group container rules for mixed layouts.
- Updated field vertical rhythm to better separate hierarchy levels:
  - tighter within a field (`Field` internal gap reduced to `gap-1` (4px), description nudged with `mt-0.5`)
  - wider between sibling fields (`FieldGroup` default spacing increased).
- Updated invalid-state messaging color behavior:
  - `FieldDescription` now switches to destructive red when parent `Field` is invalid (`data-invalid=true`) so helper/error copy matches input/error semantics.
- Added `FieldGroup` spacing variants for form hierarchy:
  - `spacing="field"` (default): 12px between sibling fields in one logical block.
  - `spacing="section"`: 24px between major field blocks/groups.
  - nested direct `FieldGroup` children normalize to 12px internal grouping in both modes.
- Added `src/components/ui/field-context.ts` to host field context/hook and keep `field.tsx` component-export-only for fast-refresh lint compliance.

### Input Component

- Added `src/components/ui/input.tsx`.
- Integrated `Input` with field context so native `required` is inherited from parent `Field` unless explicitly overridden per input.
- Added consistent input visual states for focus, invalid, disabled, and dark mode.
- Updated input surface fill behavior:
  - enabled inputs now use transparent background (no default fill)
  - disabled inputs keep muted fill (`bg-input/20`, dark: `bg-input/30`)
  - parent disabled field state (`data-disabled=true`) also applies disabled fill for visual consistency.
- Updated disabled cursor behavior on `Input`:
  - parent disabled field state (`data-disabled=true`) now applies `cursor-not-allowed` on the input itself.
  - removed `disabled:pointer-events-none` so cursor feedback is visible on hover over disabled inputs.

### Global Definitions

- Source: `src/index.css`.
- Added `--field-input-max-width: 24rem` to cap single-line field widths for readability in wide layouts.

### Button Component

- Source: `src/components/ui/button.tsx`.
- Disabled-state visual polish:
  - Added `disabled:shadow-none`.
  - Updated loading cursor treatment to use not-allowed semantics (`cursor-not-allowed`) instead of progress cursor.

### Trial Page

- Source: `src/pages/trial.tsx`.
- Added dedicated Input demo section with:
  - basic
  - field + description
  - required (asterisk + native required propagation)
  - field group
  - disabled
  - invalid
  - horizontal inline
  - fieldset + grouped address inputs.
- Updated Field Group demo to show nested group hierarchy:
  - outer `FieldGroup spacing="section"` for block-level separation
  - inner `FieldGroup` instances for tighter field-level proximity.
- Added Field Group spacing note in demo (`field 12px`, `section 24px`, `nested group 12px`) to document active scale inline.

## 2026-03-27

Scope: Alert primitive rollout and semantic color-token refinement, plus Button Group, Dropdown Menu, Checkbox, Radio Group, and Sonner primitives with expanded trial page coverage.

### Alert Component

- Added `src/components/ui/alert.tsx`.
- Introduced `Alert`, `AlertTitle`, `AlertDescription`, and `AlertAction`.
- Aligned container radius with buttons (`rounded-sm`) for consistent control geometry.
- Expanded `variant` support to: `default`, `mildWarning`, `severeWarning`, `critical`, `success`, plus `destructive` as a compatibility alias.
- Aligned API and structure with shadcn docs (`role="alert"`, icon + content layout, optional top-right action slot).
- Fixed initial layout regression where description content collapsed into a narrow column; updated alert grid rules to use a stable explicit icon/content column split in this codebase.
- `AlertDescription` now uses `text-current/90` so text remains legible across semantic filled surfaces.
- `critical`/`destructive` alerts now reuse the shared critical/destructive tokens (`critical`, `critical-soft`, `critical-border`) to reduce redundant red ramps.

### Semantic Color Tokens

- Added semantic subtle-surface ramps for reusable non-component-specific usage:
  - `warning-mild-subtle`, `warning-mild-subtle-border`, `warning-mild-subtle-foreground`
  - `warning-severe-subtle`, `warning-severe-subtle-border`, `warning-severe-subtle-foreground`
  - `success-subtle`, `success-subtle-border`, `success-subtle-foreground`
- Renamed warning severity tokens from `warning-low-*`/`warning-high-*` to `warning-mild-*`/`warning-severe-*` for clearer intent alignment with component variant names.
- Updated light and dark theme definitions and `@theme inline` mappings to use the renamed warning tokens and new subtle-surface aliases.

### Trial Page

- Source: `src/pages/trial.tsx`.
- Added Checkbox demo.
- Added Radio Group demo.
- Added dedicated Alert demos:
  - success/default example
  - info/default example
  - critical example
  - severe warning example with action button
  - mild warning example
  - success variant example.
- Added Button Group demo coverage:
  - base horizontal group
  - vertical group
  - text + button group
  - complex grouped layout with nested dropdown interactions and radio submenu state.
- Updated section separators so `<hr />` appears only at major section boundaries:
  - between button demos and button-group demos
  - between button-group demos and badge demos.

### Checkbox Component

- Added `src/components/ui/checkbox.tsx` using `@radix-ui/react-checkbox` primitives.
- Added project dependency: `@radix-ui/react-checkbox`.
- Included a basic controlled Checkbox demo in `src/pages/trial.tsx` ("Enable email updates") for immediate visual and interaction testing.

### Label Component

- Added `src/components/ui/label.tsx` using `@radix-ui/react-label` primitives.
- Added project dependency: `@radix-ui/react-label`.
- Introduced for consistency with shadcn form-control labeling patterns and upcoming form-field composition work.

### Radio Group Component

- Added `src/components/ui/radio-group.tsx` using `@radix-ui/react-radio-group` primitives.
- Added project dependency: `@radix-ui/react-radio-group`.
- Finalized radio visual behavior to:
  - unselected state uses neutral border (`border-input`)
  - selected state uses a clear primary fill dot (`bg-current` in indicator).
- Included a basic standalone Radio Group demo in `src/pages/trial.tsx` (`Default`, `Comfortable`, `Compact`) without form wrappers.

### Sonner (Toast) Component

- Added `src/components/ui/sonner.tsx` and installed `sonner`.
- Mounted global toaster in `src/main.tsx` via `<Toaster richColors />`.
- Added Sonner demo coverage in `src/pages/trial.tsx`:
  - `Without Description`
  - `With Description`
  - `With Button` (description + action button)
  - type examples: `Default`, `Success`, `Info`, `Warning`, `Error`, `Promise`.
- Kept Sonner's native toast layout for consistency across all toast variants.
- Centralized toast type icons in the shared toaster config for consistency with existing iconography:
  - success: `CheckCircle2`
  - info: `Info`
  - warning: `AlertTriangle`
  - error: `AlertCircle`
  - loading/promise: shared `Spinner` component.
- Styled Sonner action buttons globally via toaster options to use primary token colors (`--primary`, `--primary-foreground`) with small-button sizing.

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
