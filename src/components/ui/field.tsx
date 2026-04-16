import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FieldContext, useFieldContext } from "@/components/ui/field-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-2 font-medium data-[variant=label]:text-xs/relaxed data-[variant=legend]:text-sm",
        className
      )}
      {...props}
    />
  )
}

const fieldGroupVariants = cva(
  "group/field-group @container/field-group flex w-full flex-col",
  {
    variants: {
      // Layout spacing scale:
      // - within logical field block: spacing="field" => 12px between sibling fields
      // - between major form sections: spacing="section" => 24px between groups
      // - nested groups inside either mode keep 12px internal grouping
      spacing: {
        field:
          "gap-3 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-3",
        section:
          "gap-6 data-[slot=checkbox-group]:gap-4 [&>[data-slot=field-group]]:gap-3",
      },
    },
    defaultVariants: {
      spacing: "field",
    },
  }
)

function FieldGroup({
  className,
  spacing = "field",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof fieldGroupVariants>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        fieldGroupVariants({ spacing }),
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  // Field stack spacing: 4px between label/input/description/error content.
  "group/field flex w-full max-w-[var(--field-input-max-width)] gap-1 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  required = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof fieldVariants> & {
    /** Sets native `required` on inputs that opt in (e.g. `Input`), shows indicator on `FieldLabel`. */
    required?: boolean
  }) {
  return (
    <FieldContext.Provider value={{ required }}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-required={required ? "true" : undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext.Provider>
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  children,
  hideRequiredIndicator,
  info,
  infoAriaLabel = "Field help",
  ...props
}: React.ComponentProps<typeof Label> & {
  /** Hide the required asterisk when `Field` has `required` (e.g. required is implied elsewhere). */
  hideRequiredIndicator?: boolean
  /** Optional help content rendered in an info tooltip next to label text. */
  info?: React.ReactNode
  /** Accessible label for the info trigger when `info` is provided. */
  infoAriaLabel?: string
}) {
  const field = useFieldContext()
  const showRequired =
    field?.required && !hideRequiredIndicator

  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit leading-snug group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:opacity-50 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-2 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    >
      <span className="inline-flex w-fit items-center gap-1">
        <span className="inline-flex items-center gap-0.5">
          {children}
          {showRequired ? (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>

        {info ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={infoAriaLabel}
                  className="inline-flex size-3.5 items-center justify-center rounded-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                >
                  <Info className="size-3" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{info}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </span>
    </Label>
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-xs/relaxed leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "mt-0.5 text-left text-xs/relaxed leading-normal font-normal text-muted-foreground group-data-[invalid=true]/field:text-destructive group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-xs/relaxed group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-xs/relaxed font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
