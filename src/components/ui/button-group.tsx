import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type ButtonGroupOrientation = "horizontal" | "vertical"

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: ButtonGroupOrientation
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit items-stretch",
        orientation === "horizontal" &&
          " [&>[data-slot=button]]:rounded-none [&>[data-slot=button-group-text]]:rounded-none [&>[data-slot=button]:first-child]:rounded-l-sm [&>[data-slot=button-group-text]:first-child]:rounded-l-sm [&>[data-slot=button]:last-child]:rounded-r-sm [&>[data-slot=button-group-text]:last-child]:rounded-r-sm [&>[data-slot=button]+[data-slot=button]]:-ml-px [&>[data-slot=button]+[data-slot=button-group-text]]:-ml-px [&>[data-slot=button-group-text]+[data-slot=button]]:-ml-px [&>[data-slot=button-group-text]+[data-slot=button-group-text]]:-ml-px [&>[data-slot=button-group]+[data-slot=button-group]]:ml-1",
        orientation === "vertical" &&
          "flex-col [&>[data-slot=button]]:rounded-none [&>[data-slot=button-group-text]]:rounded-none [&>[data-slot=button]:first-child]:rounded-t-sm [&>[data-slot=button-group-text]:first-child]:rounded-t-sm [&>[data-slot=button]:last-child]:rounded-b-sm [&>[data-slot=button-group-text]:last-child]:rounded-b-sm [&>[data-slot=button]+[data-slot=button]]:-mt-px [&>[data-slot=button]+[data-slot=button-group-text]]:-mt-px [&>[data-slot=button-group-text]+[data-slot=button]]:-mt-px [&>[data-slot=button-group-text]+[data-slot=button-group-text]]:-mt-px [&>[data-slot=button-group]+[data-slot=button-group]]:mt-1",
        className,
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: ButtonGroupOrientation
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "vertical" ? "mx-0.5 my-1 w-px self-stretch" : "mx-1 h-px w-full",
        className,
      )}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "inline-flex h-[32px] items-center justify-center whitespace-nowrap px-3 text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
