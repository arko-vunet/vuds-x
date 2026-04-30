import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  codeVariants,
  headingVariants,
  textVariants,
  toneClasses,
  type Tone,
} from "@/components/ui/typography-variants"

/**
 * Typography primitives tuned for info-dense product surfaces.
 *
 * Scale (11 steps):
 *   title-lg | title-md | title-sm | title-xs
 *   body-lg | body-md | body-sm | body-xs
 *   caption
 *   code-md | code-sm
 *
 * Each `text-{size}` Tailwind utility sets font-size, line-height,
 * letter-spacing, and font-weight in one class. Source: `src/index.css`.
 *
 * No display tier — product surfaces don't need 36–56px headings.
 * Big-number metrics belong in a future Metric/Stat component.
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>

const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: "title-lg",
  2: "title-md",
  3: "title-sm",
  4: "title-xs",
  5: "title-xs",
  6: "title-xs",
}

type HeadingProps = Omit<React.ComponentProps<"h1">, "color"> &
  Omit<VariantProps<typeof headingVariants>, "size"> & {
    level?: HeadingLevel
    size?: HeadingSize
    tone?: Tone
    asChild?: boolean
  }

function Heading({
  className,
  level = 2,
  size,
  weight,
  tracking,
  tone = "default",
  asChild = false,
  ...props
}: HeadingProps) {
  const resolvedSize = size ?? defaultSizeByLevel[level]
  const Tag = asChild
    ? Slot
    : (`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6")

  return (
    <Tag
      data-slot="heading"
      data-level={level}
      data-size={resolvedSize}
      className={cn(
        headingVariants({ size: resolvedSize, weight, tracking }),
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

type TextElement = "p" | "span" | "div" | "li" | "strong" | "em" | "small"

type TextProps = Omit<React.HTMLAttributes<HTMLElement>, "color"> &
  VariantProps<typeof textVariants> & {
    as?: TextElement
    tone?: Tone
    asChild?: boolean
  }

function Text({
  className,
  as = "p",
  size,
  weight,
  transform,
  align,
  truncate,
  tabular,
  mono,
  tone = "default",
  asChild = false,
  ...props
}: TextProps) {
  const Tag = asChild ? Slot : (as as React.ElementType)

  return (
    <Tag
      data-slot="text"
      data-size={size ?? "body-md"}
      className={cn(
        textVariants({
          size,
          weight,
          transform,
          align,
          truncate,
          tabular,
          mono,
        }),
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

type CodeProps = React.ComponentProps<"code"> &
  VariantProps<typeof codeVariants> & {
    block?: boolean
  }

function Code({
  className,
  variant,
  size,
  block = false,
  ...props
}: CodeProps) {
  if (block) {
    return (
      <pre
        data-slot="code-block"
        className={cn(
          "bg-code-bg text-foreground overflow-x-auto rounded-md p-3 text-code-md font-mono",
          variant === "muted" && "bg-muted text-muted-foreground",
          variant === "ghost" && "bg-transparent",
          size === "sm" && "text-code-sm p-2",
          className,
        )}
      >
        <code data-slot="code" {...props} />
      </pre>
    )
  }

  return (
    <code
      data-slot="code"
      className={cn(codeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

type KbdProps = React.ComponentProps<"kbd">

function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "border-border bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border px-1 font-mono text-[10px] leading-none font-medium select-none",
        "[&_svg]:size-3",
        className,
      )}
      {...props}
    />
  )
}

export { Heading, Text, Code, Kbd, type HeadingLevel, type HeadingSize }
