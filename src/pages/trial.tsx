import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, BadgeCheck, Mail, Plus, Trash2 } from "lucide-react"

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const
const badgeVariants = ["default", "secondary", "destructive", "outline", "ghost"] as const

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function TrialPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Trial | vuDS-x"

    return () => {
      document.title = previousTitle || "vuDS-x"
    }
  }, [])

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <section
        style={{
          display: "grid",
          gap: "2rem",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Button Variants</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {toTitleCase(variant)}
              </Button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Button Sizes</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add item">
              <Plus />
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Disabled Button</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {variants.map((variant) => (
              <Button
                key={`disabled-${variant}`}
                variant={variant}
                disabled
                disabledTooltip="Unavailable in this state"
              >
                {toTitleCase(variant)}
              </Button>
            ))}
            <Button
              size="icon"
              disabled
              aria-label="Disabled add item"
              disabledTooltip="You need permission to add items"
            >
              <Plus />
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Button with Spinner</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button loading>Default</Button>
            <Button variant="destructive" loading>
              Destructive
            </Button>
            <Button variant="outline" loading>
              Outline
            </Button>
            <Button variant="secondary" loading>
              Secondary
            </Button>
            <Button variant="ghost" loading>
              Ghost
            </Button>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button size="icon" loading aria-label="Loading default icon button">
              <Plus />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              loading
              aria-label="Loading destructive icon button"
            >
              <Plus />
            </Button>
            <Button size="icon" variant="outline" loading aria-label="Loading outline icon button">
              <Mail />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              loading
              aria-label="Loading secondary icon button"
            >
              <Plus />
            </Button>
            <Button size="icon" variant="ghost" loading aria-label="Loading ghost icon button">
              <Mail />
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Button with Icon + Label</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button>
              <Mail />
              Login with Email
            </Button>
            <Button variant="secondary">
              <Plus />
              New Project
            </Button>
            <Button variant="outline">
              <Mail />
              Contact
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Icon-only Button</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button size="icon" aria-label="Add item">
              <Plus />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Add item secondary">
              <Plus />
            </Button>
            <Button size="icon" variant="destructive" aria-label="Delete item">
              <Trash2 />
            </Button>
            <Button size="icon" variant="outline" aria-label="Mail">
              <Mail />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Mail ghost">
              <Mail />
            </Button>
          </div>
        </div>

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge Variants</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {toTitleCase(variant)}
              </Badge>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge with Icon</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge>
              <BadgeCheck data-icon="inline-start" />
              Verified
            </Badge>
            <Badge variant="secondary">
              <Mail data-icon="inline-start" />
              Email
            </Badge>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge with Spinner</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge variant="secondary">
              <Spinner data-icon="inline-start" className="size-3" />
              Generating
            </Badge>
            <Badge variant="destructive">
              <Spinner data-icon="inline-start" className="size-3" />
              Deleting
            </Badge>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge as Link</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge asChild variant="outline">
              <a href="https://ui.shadcn.com/docs/components/radix/badge" target="_blank" rel="noreferrer">
                Docs
                <ArrowUpRight />
              </a>
            </Badge>
            <Badge asChild variant="link">
              <a href="/changelog">
                Changelog
                <ArrowUpRight />
              </a>
            </Badge>
          </div>
        </div>

      </section>
    </main>
  )
}
