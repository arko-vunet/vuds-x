import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Plus, Trash2 } from "lucide-react"

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const

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
          <h2>Variants</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {toTitleCase(variant)}
              </Button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Sizes</h2>
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
          <h2>Disabled</h2>
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
          <h2>Loading</h2>
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
          <h2>With Icons + Labels</h2>
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
          <h2>Icon Only</h2>
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
      </section>
    </main>
  )
}
