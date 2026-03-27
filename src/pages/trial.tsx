import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BadgeCheck,
  Mail,
  Info,
  Plus,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;
const badgeVariants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
] as const;

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function TrialPage() {
  const [label, setLabel] = useState("personal");
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Trial | vuDS-x";

    return () => {
      document.title = previousTitle || "vuDS-x";
    };
  }, []);

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
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
            <Button
              size="icon"
              loading
              aria-label="Loading default icon button"
            >
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
            <Button
              size="icon"
              variant="outline"
              loading
              aria-label="Loading outline icon button"
            >
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
            <Button
              size="icon"
              variant="ghost"
              loading
              aria-label="Loading ghost icon button"
            >
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
            <Button
              size="icon"
              variant="secondary"
              aria-label="Add item secondary"
            >
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
          <h2>Button Group</h2>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <ButtonGroup aria-label="Archive actions">
              <Button variant="outline">Archive</Button>
              <Button variant="outline">Report</Button>
              <Button variant="outline">Snooze</Button>
            </ButtonGroup>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Vertical Button Group</h2>
          <ButtonGroup
            orientation="vertical"
            aria-label="Media controls"
            className="h-fit"
          >
            <Button variant="outline" size="icon">
              <PlusIcon />
            </Button>
            <Button variant="outline" size="icon">
              <MinusIcon />
            </Button>
          </ButtonGroup>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Complex Button Group</h2>
          <ButtonGroup aria-label="Complex button group">
            <ButtonGroup className="hidden sm:flex">
              <Button variant="outline" size="icon" aria-label="Go Back">
                <ArrowLeftIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Archive</Button>
              <Button variant="outline">Report</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Snooze</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="More Options"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <MailCheckIcon />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArchiveIcon />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <ClockIcon />
                      Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CalendarPlusIcon />
                      Add to Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ListFilterIcon />
                      Add to List
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TagIcon />
                        Label As...
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={label}
                          onValueChange={setLabel}
                        >
                          <DropdownMenuRadioItem value="personal">
                            Personal
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="work">
                            Work
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="other">
                            Other
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      <Trash2Icon />
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </ButtonGroup>
        </div>

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge Variants</h2>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {toTitleCase(variant)}
              </Badge>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Badge with Icon</h2>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Badge asChild variant="outline">
              <a
                href="https://ui.shadcn.com/docs/components/radix/badge"
                target="_blank"
                rel="noreferrer"
              >
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

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Checkbox</h2>
          <label
            htmlFor="trial-email-updates"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            <Checkbox
              id="trial-email-updates"
              checked={emailUpdatesEnabled}
              onCheckedChange={(checked) =>
                setEmailUpdatesEnabled(checked === true)
              }
            />
            <span style={{ fontSize: "0.95rem" }}>Enable email updates</span>
          </label>
          <p
            style={{ color: "var(--muted-foreground)", marginLeft: "1.625rem" }}
          >
            Current state: {emailUpdatesEnabled ? "checked" : "unchecked"}
          </p>
        </div>

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Radio Group</h2>
          <RadioGroup defaultValue="comfortable" className="w-fit">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" />
              <span style={{ fontSize: "0.95rem" }}>Default</span>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" />
              <span style={{ fontSize: "0.95rem" }}>Comfortable</span>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="compact" id="r3" />
              <span style={{ fontSize: "0.95rem" }}>Compact</span>
            </div>
          </RadioGroup>
        </div>

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Sonner (Toast) Variants</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button
              variant="outline"
              onClick={() => {
                toast("Saved successfully.");
              }}
            >
              Without Description
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast("Saved successfully.", {
                  description: "Your changes are now live.",
                });
              }}
            >
              With Description
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast("Saved successfully.", {
                  description: "Your changes are now live.",
                  action: {
                    label: "Undo",
                    onClick: () => {
                      toast.info("Changes restored.");
                    },
                  },
                });
              }}
            >
              With Button
            </Button>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button variant="outline" onClick={() => toast("Default toast")}>
              Default
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Success toast")}
            >
              Success
            </Button>
            <Button variant="outline" onClick={() => toast.info("Info toast")}>
              Info
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.warning("Warning toast")}
            >
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error("Error toast")}
            >
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.promise(wait(1500), {
                  loading: "Saving...",
                  success: "Saved",
                  error: "Could not save",
                });
              }}
            >
              Promise
            </Button>
          </div>
        </div>

        <hr />

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Alert</h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Payment successful</AlertTitle>
              <AlertDescription>
                Your payment of $29.99 has been processed. A receipt has been
                sent to your email address.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info />
              <AlertTitle>New feature available</AlertTitle>
              <AlertDescription>
                We&apos;ve added dark mode support. You can enable it in your
                account settings.
              </AlertDescription>
            </Alert>

            <Alert variant="critical">
              <AlertCircle />
              <AlertTitle>Payment failed</AlertTitle>
              <AlertDescription>
                Your payment could not be processed. Please check your payment
                method and try again.
              </AlertDescription>
            </Alert>

            <Alert variant="severeWarning">
              <AlertTriangle />
              <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
              <AlertDescription>
                Renew now to avoid service interruption or upgrade to a paid
                plan to continue using the service.
              </AlertDescription>
              <AlertAction>
                <Button variant="outline" size="sm">
                  Renew
                </Button>
              </AlertAction>
            </Alert>

            <Alert variant="mildWarning">
              <AlertTriangle />
              <AlertTitle>Your trial ends in 14 days.</AlertTitle>
              <AlertDescription>
                You can continue testing all features. Add billing details any
                time to avoid interruptions at the end of your trial.
              </AlertDescription>
            </Alert>

            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Backup completed successfully</AlertTitle>
              <AlertDescription>
                Your workspace settings and data were backed up. No further
                action is required.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </main>
  );
}
