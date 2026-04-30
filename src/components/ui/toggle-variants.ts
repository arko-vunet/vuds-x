import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const toggleVariants = cva(
  cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none",
    "hover:bg-accent hover:text-accent-foreground",
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-[32px] min-w-[32px] px-2",
        sm: "h-[24px] min-w-[24px] px-1.5 text-xs",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
