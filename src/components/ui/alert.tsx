import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full rounded-sm border px-4 py-3 text-sm gap-x-3 gap-y-1 has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg~*]:col-start-2",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        mildWarning:
          "bg-warning-mild-subtle border-warning-mild-subtle-border text-warning-mild-subtle-foreground [&>svg]:text-warning-mild-subtle-foreground",
        severeWarning:
          "bg-warning-severe-subtle border-warning-severe-subtle-border text-warning-severe-subtle-foreground [&>svg]:text-warning-severe-subtle-foreground",
        critical:
          "bg-critical-soft border-critical-border text-critical [&>svg]:text-critical",
        success:
          "bg-success-subtle border-success-subtle-border text-success-subtle-foreground [&>svg]:text-success-subtle-foreground",
        destructive:
          "bg-critical-soft border-critical-border text-critical [&>svg]:text-critical",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-current/90 text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-4 right-4", className)}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
