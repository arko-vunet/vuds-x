import { cva } from "class-variance-authority"

export type Tone =
  | "default"
  | "muted"
  | "subtle"
  | "destructive"
  | "success"
  | "info"
  | "warning"
  | "inverse"

export const toneClasses: Record<Tone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-foreground-subtle",
  destructive: "text-destructive",
  success: "text-success",
  info: "text-info",
  warning: "text-warning-severe",
  inverse: "text-primary-foreground",
}

export const headingVariants = cva("font-heading", {
  variants: {
    size: {
      "title-lg": "text-title-lg",
      "title-md": "text-title-md",
      "title-sm": "text-title-sm",
      "title-xs": "text-title-xs",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    tracking: {
      default: "",
      normal: "tracking-normal",
      tight: "tracking-tight",
    },
  },
  defaultVariants: {
    tracking: "default",
  },
})

export const textVariants = cva("", {
  variants: {
    size: {
      "body-lg": "text-body-lg",
      "body-md": "text-body-md",
      "body-sm": "text-body-sm",
      "body-xs": "text-body-xs",
      caption: "text-caption",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    transform: {
      default: "",
      uppercase: "uppercase",
      capitalize: "capitalize",
    },
    align: {
      default: "",
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      false: "",
      true: "truncate",
    },
    tabular: {
      false: "",
      true: "tabular-nums",
    },
    mono: {
      false: "",
      true: "font-mono",
    },
  },
  defaultVariants: {
    size: "body-md",
    transform: "default",
    align: "default",
    truncate: false,
    tabular: false,
    mono: false,
  },
})

export const codeVariants = cva(
  "font-mono inline-flex items-center rounded-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-code-bg text-foreground px-1.5 py-px",
        ghost: "bg-transparent text-foreground px-0 py-0",
        muted: "bg-muted text-muted-foreground px-1.5 py-px",
      },
      size: {
        md: "text-code-md",
        sm: "text-code-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)
