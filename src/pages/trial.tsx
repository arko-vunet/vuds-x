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
  DataTable,
  type DataTableFilterChip,
} from "@/components/ui/data-table";
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
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
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
  DownloadIcon,
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

type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  status: "Needs review" | "Ready to sync" | "Flagged" | "Cleared";
  risk: "Low" | "Medium" | "High";
  owner: string;
  category: string;
  occurredAt: string;
};

const transactionData: Transaction[] = [
  {
    id: "txn_101",
    merchant: "AWS Marketplace",
    amount: 1840.42,
    currency: "USD",
    status: "Needs review",
    risk: "High",
    owner: "Platform",
    category: "Cloud infra",
    occurredAt: "2026-04-28",
  },
  {
    id: "txn_102",
    merchant: "Figma",
    amount: 312.0,
    currency: "USD",
    status: "Ready to sync",
    risk: "Low",
    owner: "Design",
    category: "Software",
    occurredAt: "2026-04-27",
  },
  {
    id: "txn_103",
    merchant: "Datadog",
    amount: 967.18,
    currency: "USD",
    status: "Needs review",
    risk: "Medium",
    owner: "SRE",
    category: "Monitoring",
    occurredAt: "2026-04-26",
  },
  {
    id: "txn_104",
    merchant: "Unknown merchant",
    amount: 229.99,
    currency: "USD",
    status: "Flagged",
    risk: "High",
    owner: "Finance",
    category: "Unmapped",
    occurredAt: "2026-04-25",
  },
  {
    id: "txn_105",
    merchant: "Linear",
    amount: 96.0,
    currency: "USD",
    status: "Cleared",
    risk: "Low",
    owner: "Product",
    category: "Software",
    occurredAt: "2026-04-24",
  },
  {
    id: "txn_106",
    merchant: "OpenAI",
    amount: 1260.75,
    currency: "USD",
    status: "Needs review",
    risk: "Medium",
    owner: "AI Lab",
    category: "Model usage",
    occurredAt: "2026-04-23",
  },
  {
    id: "txn_107",
    merchant: "GitHub",
    amount: 448.0,
    currency: "USD",
    status: "Ready to sync",
    risk: "Low",
    owner: "Engineering",
    category: "Developer tools",
    occurredAt: "2026-04-22",
  },
  {
    id: "txn_108",
    merchant: "Vercel",
    amount: 518.2,
    currency: "USD",
    status: "Flagged",
    risk: "High",
    owner: "Growth",
    category: "Hosting",
    occurredAt: "2026-04-21",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function includesAnyFilter<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
) {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  return filterValue.includes(row.getValue(columnId));
}

function getColumnFilterValues(filters: ColumnFiltersState, id: string) {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function setColumnFilterValues(
  filters: ColumnFiltersState,
  id: string,
  values: string[]
) {
  const withoutFilter = filters.filter((filter) => filter.id !== id);

  if (values.length === 0) {
    return withoutFilter;
  }

  return [...withoutFilter, { id, value: values }];
}

const transactionColumns: ColumnDef<Transaction, unknown>[] = [
  {
    accessorKey: "merchant",
    header: "Merchant",
    meta: {
      label: "Merchant",
      truncate: true,
    },
    cell: ({ row }) => (
      <div className="grid gap-0.5">
        <span className="font-medium text-foreground">
          {row.original.merchant}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      isNumeric: true,
      label: "Amount",
    },
    cell: ({ row }) => currencyFormatter.format(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: includesAnyFilter,
    meta: {
      label: "Status",
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "Flagged"
            ? "destructive"
            : row.original.status === "Needs review"
              ? "outline"
              : "secondary"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "risk",
    header: "Risk",
    filterFn: includesAnyFilter,
    meta: {
      label: "Risk",
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.risk === "High"
            ? "destructive"
            : row.original.risk === "Medium"
              ? "outline"
              : "ghost"
        }
      >
        {row.original.risk}
      </Badge>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: {
      label: "Owner",
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    meta: {
      label: "Category",
      truncate: true,
    },
  },
  {
    accessorKey: "occurredAt",
    header: "Date",
    sortingFn: "datetime",
    meta: {
      label: "Date",
    },
    cell: ({ row }) => dateFormatter.format(new Date(row.original.occurredAt)),
  },
];

/** Subsection titles under the Input demo (not field labels). */
const inputDemoSubheadingStyle = {
  fontSize: "0.875rem",
  fontWeight: 600,
  margin: 0,
} as const;

const inputDemoBlockStyle = {
  display: "grid" as const,
  gap: "0.375rem",
};

export default function TrialPage() {
  const [label, setLabel] = useState("personal");
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false);
  const [transactionColumnFilters, setTransactionColumnFilters] =
    useState<ColumnFiltersState>([
      { id: "status", value: ["Needs review"] },
    ]);
  const [transactionRowSelection, setTransactionRowSelection] =
    useState<RowSelectionState>({});

  const transactionStatusFilters = getColumnFilterValues(
    transactionColumnFilters,
    "status"
  );
  const transactionRiskFilters = getColumnFilterValues(
    transactionColumnFilters,
    "risk"
  );
  const transactionFilterChips: DataTableFilterChip[] = [
    {
      id: "status",
      label: "Status",
      value: transactionStatusFilters.join(", "),
      active: transactionStatusFilters.length > 0,
      onClick: () =>
        setTransactionColumnFilters((filters) =>
          setColumnFilterValues(filters, "status", ["Needs review"])
        ),
      onClear: () =>
        setTransactionColumnFilters((filters) =>
          setColumnFilterValues(filters, "status", [])
        ),
    },
    {
      id: "risk",
      label: "Risk",
      value: transactionRiskFilters.join(", "),
      active: transactionRiskFilters.length > 0,
      onClick: () =>
        setTransactionColumnFilters((filters) =>
          setColumnFilterValues(filters, "risk", ["High"])
        ),
      onClear: () =>
        setTransactionColumnFilters((filters) =>
          setColumnFilterValues(filters, "risk", [])
        ),
    },
  ];

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
          <h2>Data Table</h2>
          <DataTable
            title="Card transactions"
            description="Dense finance workflow table with saved-view tabs, filter chips, column control, row selection, and bulk actions."
            columns={transactionColumns}
            data={transactionData}
            density="compact"
            columnFilters={transactionColumnFilters}
            rowSelection={transactionRowSelection}
            onColumnFiltersChange={setTransactionColumnFilters}
            onRowSelectionChange={setTransactionRowSelection}
            getRowId={(row) => row.id}
            filterChips={transactionFilterChips}
            initialState={{
              pagination: {
                pageIndex: 0,
                pageSize: 5,
              },
              sorting: [
                {
                  id: "occurredAt",
                  desc: true,
                },
              ],
            }}
            searchPlaceholder="Search merchant, owner, category..."
            querySummary="Updated 90s ago"
            viewTabs={
              <ButtonGroup aria-label="Transaction views">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    transactionColumnFilters.length === 0
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => setTransactionColumnFilters([])}
                >
                  All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    transactionStatusFilters.includes("Needs review")
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() =>
                    setTransactionColumnFilters((filters) =>
                      setColumnFilterValues(filters, "status", ["Needs review"])
                    )
                  }
                >
                  Needs review
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    transactionRiskFilters.includes("High")
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() =>
                    setTransactionColumnFilters((filters) =>
                      setColumnFilterValues(filters, "risk", ["High"])
                    )
                  }
                >
                  High risk
                </Button>
              </ButtonGroup>
            }
            renderToolbarActions={() => (
              <Button type="button" variant="outline" size="sm">
                <DownloadIcon />
                Export CSV
              </Button>
            )}
            renderBulkActions={() => (
              <>
                <Button type="button" variant="outline" size="sm">
                  Code transactions
                </Button>
                <Button type="button" size="sm">
                  Mark ready
                </Button>
              </>
            )}
            renderRowActions={(row) => (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Review ${row.original.merchant}`}
              >
                Review
              </Button>
            )}
          />
        </div>

        <hr />

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <h2>Input</h2>
          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Basic</h3>
            <Field>
              <FieldLabel htmlFor="trial-input-basic-email">Email</FieldLabel>
              <Input
                id="trial-input-basic-email"
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
              />
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Field</h3>
            <Field>
              <FieldLabel htmlFor="trial-input-username">Username</FieldLabel>
              <Input
                id="trial-input-username"
                autoComplete="off"
                placeholder="shadcn"
              />
              <FieldDescription>
                Choose a unique username for your account.
              </FieldDescription>
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Required</h3>
            <Field required>
              <FieldLabel htmlFor="trial-input-required">Legal name</FieldLabel>
              <Input
                id="trial-input-required"
                autoComplete="name"
                placeholder="Ada Lovelace"
              />
              <FieldDescription>
                As shown on your government ID. Required fields are marked with
                an asterisk.
              </FieldDescription>
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Required</h3>
            <Field required>
              <FieldLabel
                htmlFor="trial-input-required"
                info="Use legal name exactly as shown on government ID."
              >
                Legal name
              </FieldLabel>
              <Input id="trial-input-required" />
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Not Required</h3>
            <Field>
              <FieldLabel
                htmlFor="trial-input-required"
                info="The info description tooltip can obviously show-up for a non-required field too!"
              >
                Some other field
              </FieldLabel>
              <Input id="trial-input-required" />
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Field Group</h3>
            <p className="text-xs text-muted-foreground">
              Spacing scale: field 12px, section 24px, nested group 12px.
            </p>
            <FieldGroup spacing="section">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="trial-input-name">Name</FieldLabel>
                  <Input id="trial-input-name" autoComplete="off" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="trial-input-email">Email</FieldLabel>
                  <Input id="trial-input-email" type="email" autoComplete="off" />
                  <FieldDescription>
                    We&apos;ll send updates to this address.
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="trial-input-company">Company</FieldLabel>
                  <Input id="trial-input-company" autoComplete="organization" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="trial-input-role">Role</FieldLabel>
                  <Input id="trial-input-role" autoComplete="organization-title" />
                </Field>
              </FieldGroup>
              <div className="flex gap-2">
                <Button type="reset" variant="outline">
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </FieldGroup>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Disabled</h3>
            <Field data-disabled={true}>
              <FieldLabel htmlFor="trial-input-email-disabled">
                Email
              </FieldLabel>
              <Input id="trial-input-email-disabled" disabled />
              <FieldDescription>
                This field is currently disabled.
              </FieldDescription>
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Invalid</h3>
            <Field data-invalid={true}>
              <FieldLabel htmlFor="trial-input-invalid">
                Invalid Input
              </FieldLabel>
              <Input id="trial-input-invalid" aria-invalid />
              <FieldDescription>
                This field contains validation errors.
              </FieldDescription>
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Inline</h3>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="trial-input-search">Search</FieldLabel>
              <Input id="trial-input-search" placeholder="Search…" />
              <Button type="button">Search</Button>
            </Field>
          </div>

          <div style={inputDemoBlockStyle}>
            <h3 style={inputDemoSubheadingStyle}>Fieldset</h3>
            <FieldSet>
              <FieldLegend>Address Information</FieldLegend>
              <FieldDescription>
                We need your address to deliver your order.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="trial-input-street">
                    Street Address
                  </FieldLabel>
                  <Input
                    id="trial-input-street"
                    autoComplete="street-address"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="trial-input-city">City</FieldLabel>
                    <Input
                      id="trial-input-city"
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="trial-input-postal">
                      Postal Code
                    </FieldLabel>
                    <Input id="trial-input-postal" autoComplete="postal-code" />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
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
            <Badge asChild variant="link">
              <a href="/skills">
                Skills
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
