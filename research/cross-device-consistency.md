# Cross-Device Visual Consistency

> **Purpose**: This document serves two roles. **Part 1** explains *why* the same web interface looks different across screens—written for humans who need the conceptual foundation. **Part 2** is an implementation specification for an AI coding agent, describing CSS/JS techniques to make a dense, data-heavy enterprise UI render consistently across high-DPR Mac displays and lower-resolution/lower-DPR Windows machines. The codebase uses **Vite + React + Tailwind CSS + shadcn/ui**. All changes must work automatically—no manual configuration by the end user.

---

# Part 1: Why the Same Interface Looks Different on Different Screens

## Screens Are Grids of Tiny Dots

Every screen is a grid of tiny colored dots—pixels. A MacBook Pro 14" has roughly **3024 dots across**. A typical Windows office laptop might have **1920** or just **1366**. More dots in the same physical space means each dot is smaller, and the image is sharper—like the difference between printing a photo on a high-end printer versus an office inkjet.

## The Browser Doesn't Care About Your Dots

The browser doesn't work in physical dots. It works in its own abstract unit: the **CSS pixel**. Think of CSS pixels as "design units"—the currency your code thinks in when it says `font-size: 14px` or `padding: 16px`.

The operating system decides how many physical dots make up one CSS pixel. This ratio has a name: the **device pixel ratio**, or **DPR**.

- On a MacBook at 2x DPR: **1 CSS pixel = 4 physical dots** (a 2-by-2 grid)
- On a Windows laptop at 1x DPR: **1 CSS pixel = 1 physical dot**

So when your CSS says `font-size: 14px`, the Mac draws that text using 28 physical dots of height. The Windows laptop draws it using 14. Same instruction, wildly different raw material to work with.

## Two Things Go Wrong at Once

**First: your canvas shrinks.** The Mac gives you roughly **1,512 CSS pixels** of horizontal space. A Windows laptop at 1366x768 gives you **1,366**. A 1080p laptop where Windows has set scaling to 150% (which is common—Windows does this automatically on many machines) gives you only **1,280**. Your dense, data-heavy interface is trying to fit into a smaller canvas. Everything gets more cramped, or overflows awkwardly.

**Second: every CSS pixel is physically bigger.** On a 15.6" Windows laptop at 1x DPR, one CSS pixel is about 50% physically larger than on a 14" MacBook at 2x. Your padding is bigger. Your fonts are bigger. Your buttons are bigger. Not because the code changed—because the physical size of the underlying unit changed. This is why it looks "blown up."

## Why It Looks *Dated*, Not Just Big

This is subtler, and it comes from three things happening at once:

**Sharpness drops.** On the Mac, every curve, diagonal line, and rounded corner has 4 physical dots per CSS pixel to draw with. The browser can blend and smooth edges beautifully. At 1x DPR, it has exactly 1 dot per pixel—curves get visible staircase-stepping, corners look rougher, and the whole interface loses that polished quality. Think of it like the difference between a vector logo printed at 300 DPI versus 72 DPI. Same logo, different fidelity.

**Fine details fall apart.** That elegant `1px` border in your design? On a Retina Mac, it's actually drawn with 2 physical dots and some antialiasing—it looks like a crisp hairline. On a 1x Windows screen, that same border is a single physical dot: on or off, no smoothing possible. It looks chunky. Same goes for subtle shadows, thin font weights, and small icons with fine strokes. The design details that make a modern UI feel "refined" are the first casualties of a lower-density display.

**Fonts look different—really different.** macOS and Windows have fundamentally different philosophies about rendering text. macOS prioritizes preserving the *shape* of the typeface: smooth curves, even weight. Windows prioritizes *legibility on the pixel grid*: it snaps letter strokes to exact pixel boundaries. The result is that the same font, at the same size, looks like two different fonts on the two systems. What looks sleek and rounded on your Mac can look angular, uneven, or spindly on a Windows machine.

## The Design-Team Blind Spot

When a design team works in Figma on MacBooks, Figma renders everything at the display's native 2x DPR. Every design review, every critique session, every "looks good to me"—it's all happening in a best-case rendering environment. The team is unconsciously making design choices (thin borders, light font weights, tight spacing, subtle shadows) that look fantastic at 2x but are quietly optimized for hardware most enterprise users don't have.

Nobody ever sees what the actual user on a company-issued ThinkPad sees. The design process has a built-in blind spot.

The interface isn't broken on Windows. The Mac is *flattering* your UI—adding sharpness, refinement, and apparent spatial efficiency that doesn't exist in the CSS itself. When that same CSS hits a 1x or 1.25x Windows display, you're seeing the real rendering fidelity of your design decisions.

---

# Part 2: Implementation Guide

## The Problem (Technical Summary)

The same interface looks sharp, compact, and modern on a MacBook (high DPR, ~1512 CSS-pixel viewport) but appears blown up, rough, and dated on typical enterprise Windows machines (1x–1.25x DPR, 1280–1366 CSS-pixel viewports). This is caused by:

1. **Fewer CSS pixels available** on lower-res or higher-OS-scaling Windows machines, making the UI spatially cramped or overflowing.
2. **Physically larger CSS pixels** on low-DPR screens, making everything appear bigger.
3. **Reduced rendering fidelity** at 1x DPR—fewer physical pixels per CSS pixel means rougher curves, blockier shadows, and no subpixel finesse.
4. **Different font rendering engines** across macOS (Core Text) and Windows (DirectWrite/ClearType), causing the same typeface to look different.

## Goals

- The UI should feel **visually consistent** across a 2x Retina MacBook and a 1080p Windows laptop at 100%–150% OS scaling.
- Dense, data-heavy layouts should **remain usable and not overflow** on viewports as narrow as 1280 CSS pixels.
- The solution must be **automatic**—no user-facing settings or manual adjustments.
- The solution must **not break** browser zoom, accessibility features, or shadcn component behavior.

## Target Device Matrix

| Device | Physical Res | OS Scaling | DPR | CSS Viewport Width |
|---|---|---|---|---|
| MacBook Pro 14" | 3024×1964 | 2x (default) | 2.0 | ~1512px |
| MacBook Air 13" | 2560×1664 | 2x (default) | 2.0 | ~1280px |
| Windows 1080p, 100% | 1920×1080 | 100% | 1.0 | 1920px |
| Windows 1080p, 125% | 1920×1080 | 125% | 1.25 | 1536px |
| Windows 1080p, 150% | 1920×1080 | 150% | 1.5 | 1280px |
| Windows 768p, 100% | 1366×768 | 100% | 1.0 | 1366px |

The **design reference viewport** is ~1512px wide (MacBook Pro 14"). The UI must degrade gracefully down to 1280px.

---

## Strategy: Three Pillars

### Pillar 1 — Fluid Scaling (spatial consistency)
Use a fluid root `font-size` so that the entire rem-based spacing and type system scales proportionally with viewport width.

### Pillar 2 — Rendering Normalization (visual consistency)
Apply CSS properties that reduce cross-platform rendering variance in fonts, borders, and shadows.

### Pillar 3 — Defensive Design Tokens (robustness at 1x DPR)
Ensure design tokens (borders, shadows, font weights, etc.) look acceptable at 1x DPR by avoiding fragile values that only look good at 2x.

---

## Implementation Steps

### Step 1: Fluid Root Font Size

This is the single highest-leverage change. Since Tailwind and shadcn use `rem` units pervasively, adjusting the root `font-size` on `<html>` scales the entire UI proportionally—type, spacing, padding, component sizes, everything.

**In your global CSS file** (typically `src/index.css` or `src/globals.css`), add or modify the `html` rule:

```css
html {
  /*
    Fluid root font-size: scales linearly between viewport widths.
    - At 1280px viewport → 14.5px root (compact for tight viewports)
    - At 1536px viewport → 15.5px root (balanced)
    - At 1920px viewport → 16px root (standard)

    The formula: clamp(min, preferred, max)
    preferred = 0.234375vw + 11.5px
    This produces a smooth linear ramp between the min and max.
  */
  font-size: clamp(14.5px, 11.5px + 0.234375vw, 16px);
}
```

**What this does**: On a 1280px-wide viewport (the tightest target), the base font and all rem-derived values shrink to ~90.6% of the 16px default. On a 1920px viewport, everything is at the full 16px. The UI fluidly scales between these—no breakpoints, no jumps.

**Verification**: Open browser DevTools, resize the viewport between 1280px and 1920px, and confirm that `getComputedStyle(document.documentElement).fontSize` changes smoothly between `14.5px` and `16px`.

> **Note on accessibility**: This approach uses `px` values, which means a user who has changed their browser's default font size will have that preference overridden at the extremes of the clamp. For enterprise B2B where user-controlled font preferences are rare, this trade-off is acceptable. If accessibility compliance requires respecting user font preferences, replace the `px` values with percentages: `clamp(90.625%, 71.875% + 0.234375vw, 100%)`.

---

### Step 2: Global Font Rendering Normalization

Add these properties to the `body` rule in your global CSS:

```css
body {
  /* Force grayscale antialiasing on macOS.
     This makes Mac rendering slightly thinner/crisper,
     moving it CLOSER to how Windows renders text.
     Without this, Mac renders text "heavier" than Windows. */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Optimize for legibility over speed */
  text-rendering: optimizeLegibility;
}
```

If using Tailwind, you can apply the `antialiased` utility class to the `<body>` element instead:

```html
<body class="antialiased">
```

**What this does**: `-webkit-font-smoothing: antialiased` switches macOS from subpixel antialiasing to grayscale antialiasing. This makes text on Mac look slightly thinner—which, counterintuitively, brings it closer to how text renders on Windows. The visual gap between platforms narrows.

---

### Step 3: Font Stack Optimization

Ensure the font stack performs well across both platforms. If you're using a custom font (like Inter), make sure it's loaded via `@font-face` with proper `font-display` and weight ranges.

**If using Inter** (recommended for dense enterprise UI):

```css
/* Inter renders well on both Mac and Windows.
   Load weights 400, 500, and 600 only—avoid 300 (light). */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
}
```

**Rules for font weight usage across the design system**:
- **Never use `font-weight: 300`** (light) for body text or UI labels. It renders poorly on Windows at 1x DPR—strokes become too thin and break apart.
- **Use `font-weight: 400`** (regular) as the minimum for any readable text.
- **Use `font-weight: 500`** (medium) for emphasis and interactive elements (buttons, links, table headers).
- **Use `font-weight: 600`** (semibold) for headings and high-emphasis elements.
- Reserve `font-weight: 700`+ for rare, large-scale headings only.

---

### Step 4: Border and Shadow Hardening

Fine borders and subtle shadows are the design elements most affected by low DPR. These rules ensure they remain visible and intentional at 1x.

**Borders**:

```css
:root {
  /* Minimum visible border. On 2x displays, this renders as a fine hairline.
     On 1x displays, it's a single solid pixel—still clean. */
  --border-width: 1px;
}
```

- Do NOT use `0.5px` borders anywhere. They render as 1px on 1x displays and vanish entirely on some browsers.
- For borders that serve as visual separators (not just decorative), use `1px solid` with sufficient contrast against the background. The border color should have at least a 15% lightness difference from the background in HSL.

**Shadows**:

```css
:root {
  /* Shadows that remain perceptible at 1x DPR.
     Avoid blur radii below 2px—they become invisible at 1x. */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-lg: 0 4px 8px -2px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06);
}
```

- Tailwind's default shadow values are generally fine, but if you've customized them to be very subtle (low opacity, small blur), increase opacity by ~20-30% relative to what looks good on a Mac.
- Test all shadows on a 1x display. If a shadow is invisible at 1x, either increase its opacity or accept that it's purely decorative and non-essential.

---

### Step 5: DPR-Aware CSS Refinements

Use the `resolution` media query to apply targeted adjustments for low-DPR displays:

```css
/* Adjustments for displays at 1x DPR (no Retina) */
@media (max-resolution: 1.1dppx) {
  :root {
    /* Slightly increase shadow visibility on low-DPR screens */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.08);
    --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.08);
    --shadow-lg: 0 4px 8px -2px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08);
  }

  /* Bump minimum font weight for small text to improve legibility */
  .text-xs,
  .text-sm,
  [class*="text-\[0\."]{
    font-weight: 450;
  }
}

/* Adjustments for displays between 1x and 1.5x DPR */
@media (min-resolution: 1.1dppx) and (max-resolution: 1.6dppx) {
  :root {
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.07);
    --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.09), 0 1px 2px -1px rgb(0 0 0 / 0.07);
  }
}
```

**What this does**: Low-DPR screens lose shadow detail due to fewer physical pixels for blending. Bumping shadow opacity slightly compensates. The font-weight bump for small text prevents thin strokes from disintegrating at 1x.

> **Note**: `1.1dppx` (not `1dppx`) is used as the threshold to account for fractional DPR values like 1.0 on Windows at 100% scaling. Using `max-resolution: 1.1dppx` captures true 1x displays without accidentally including 1.25x.

---

### Step 6: Icon and Asset Handling

- **Use SVG for all icons.** SVGs are vector-based and render crisply at any DPR. Do not use raster icon sprites or icon fonts with thin strokes.
- If using Lucide icons (shadcn default), they are SVG-based and will work well. Ensure `stroke-width` is at least `1.5` (Lucide's default is `2`, which is fine).
- For any raster images (logos, illustrations), provide 2x variants and use `srcset`:

```html
<img
  src="/logo.png"
  srcset="/logo.png 1x, /logo@2x.png 2x"
  alt="Logo"
/>
```

---

### Step 7: Viewport Meta Tag

Ensure the HTML `<head>` contains the correct viewport meta tag. This is usually already present in Vite projects, but verify:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Do NOT add `maximum-scale=1.0` or `user-scalable=no`—these break accessibility by preventing zoom.

---

### Step 8: Tailwind Configuration Alignment

If using Tailwind v3, extend the config to include fluid-friendly values. If using Tailwind v4 (CSS-first config), apply these in your CSS.

**Tailwind v3 (tailwind.config.js)**:

```javascript
module.exports = {
  theme: {
    extend: {
      screens: {
        // Ensure breakpoints cover the target device range
        'compact': '1280px',
        'standard': '1536px',
        'wide': '1920px',
      },
    },
  },
}
```

**Tailwind v4 (in CSS)**:

```css
@theme {
  --breakpoint-compact: 1280px;
  --breakpoint-standard: 1536px;
  --breakpoint-wide: 1920px;
}
```

Use these breakpoints in your layout components to handle viewport-specific density adjustments when the fluid root font-size alone isn't enough. For example, a data table might show fewer columns at `compact` and progressively disclose more at `standard` and `wide`.

---

### Step 9: Layout Density Escape Hatch (for extreme cases)

For specific components that need more aggressive adaptation (e.g., data tables, config panels, dashboards), use CSS custom properties to define a density scale:

```css
:root {
  --density-spacing: 1;
}

@media (max-width: 1400px) {
  :root {
    --density-spacing: 0.875;
  }
}

@media (max-width: 1280px) {
  :root {
    --density-spacing: 0.75;
  }
}
```

Then in specific dense components, use `calc()` with the density variable:

```css
.data-table td {
  padding: calc(0.5rem * var(--density-spacing)) calc(0.75rem * var(--density-spacing));
}

.config-panel .field-group {
  gap: calc(1rem * var(--density-spacing));
}
```

This gives you a second lever of control beyond the fluid root font-size—useful for components where you need to compress spacing more aggressively than the global scale allows.

---

## Summary of Changes

| File | Change |
|---|---|
| Global CSS (`src/index.css` or equivalent) | Add fluid `font-size` on `html`, font smoothing on `body`, DPR media queries, density custom properties |
| Global CSS | Font stack declaration (Inter 400/500/600) |
| HTML template (`index.html`) | Verify viewport meta tag, add `antialiased` class to `body` if using Tailwind utility |
| Tailwind config | Add `compact`/`standard`/`wide` breakpoints |
| Component CSS (where needed) | Use `var(--density-spacing)` in padding/gap for dense components |
| Icon/image assets | Confirm all icons are SVG; add `srcset` for raster images |

## Testing Protocol

After implementing, verify against these checks:

1. **Chrome DevTools device simulation**: Set viewport to 1280×720 and DPR to 1.0. The UI should be legible, not overflowing, and all shadows/borders visible.
2. **Same at 1366×768, DPR 1.0**: Similar check.
3. **Same at 1536×864, DPR 1.25**: Verify proportions are balanced.
4. **Same at 1512×982, DPR 2.0**: This is the Mac reference—UI should look sharp and well-spaced.
5. **Browser zoom**: At each viewport, zoom to 110% and 90%. The UI should remain functional and not break layout.
6. **Font rendering**: If possible, test on an actual Windows machine (or Windows VM). Confirm that body text is readable, headings are clear, and no text appears broken or spindly.
7. **Real device check**: The DevTools simulation approximates DPR behavior but does NOT simulate Windows font rendering. A real Windows machine (or VM with ClearType enabled) is necessary for full validation.

## What This Does NOT Solve

- **Pixel-perfect identical rendering** across Mac and Windows. That is not achievable due to fundamental OS-level rendering differences. The goal is *visual consistency*—the interface should feel like the same product on both platforms.
- **Very old browsers** (IE11, pre-Chromium Edge). This guide targets modern evergreen browsers.
- **Extremely low resolutions** below 1280px width. At that point, a separate responsive/mobile layout is needed.
