import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs enabled:hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs enabled:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs enabled:hover:bg-secondary/80",
        ghost: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 enabled:hover:underline",
      },
      size: {
        default: "h-[32px] px-3 py-1.5 has-[>svg]:px-2.5",
        sm: "h-[24px] rounded-sm text-xs gap-1.5 px-2.5 has-[>svg]:px-2",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-[32px]",
        "icon-sm": "size-[24px]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabledTooltip,
  loading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    disabledTooltip?: React.ReactNode
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = Boolean(props.disabled || loading)
  const isIconLoading = Boolean(loading && size?.startsWith("icon"))
  const shouldShowDisabledTooltip =
    !asChild && !loading && Boolean(props.disabled && disabledTooltip)
  const buttonNode = (
    <Comp
      {...props}
      data-slot="button"
      data-loading={loading ? "true" : "false"}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-progress disabled:cursor-progress",
      )}
      aria-busy={loading}
      disabled={asChild ? undefined : isDisabled}
    >
      {loading ? <Spinner aria-hidden="true" /> : null}
      {isIconLoading ? null : children}
    </Comp>
  )

  if (shouldShowDisabledTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex cursor-not-allowed [&>*]:pointer-events-none">
              {buttonNode}
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledTooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return buttonNode
}

export { Button }
