import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Header,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanStackTable,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/*
 * DataTable product notes
 *
 * Current target is fintech / enterprise workflow tables, not a generic
 * spreadsheet clone. Users usually enter with a task: reconcile spend, review
 * exceptions, export a filtered slice, or inspect a high-risk row. The table
 * therefore keeps query state visible around the grid: view tabs, search,
 * filter chips, freshness copy, row counts, selection counts, and bulk actions.
 *
 * Fintech tables need trust more than ornament:
 * - money and comparable quantities align right with tabular numerals
 * - row identity stays stable via `getRowId`, especially for selection
 * - bulk actions render only after selection so action scope is explicit
 * - export/actions live outside rows because exported data usually means
 *   "current filtered result", not only visible page rows
 * - empty/loading/error states occupy the table body so layout does not jump
 *
 * TanStack Table stays headless here. This component owns the interaction shell
 * and visual density, while callers own domain filters, saved-view behavior,
 * server queries, and risky workflow actions. That keeps the primitive malleable:
 * use client row models for small local datasets, or flip `manualFiltering`,
 * `manualSorting`, and `manualPagination` for API-backed tables without changing
 * markup at call sites.
 *
 * Features are intentionally prop-gated. Basic read-only tables can disable
 * toolbar/search/pagination/selection, while data-heavy screens can compose
 * filter chips, row actions, expanded rows, column visibility, and bulk bars.
 * Future add-ons should follow that rule: expose state and render slots before
 * baking product-specific behavior into this file.
 */

declare module "@tanstack/react-table" {
  // Generic names must match TanStack's augmentation shape.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right"
    cellClassName?: string
    headerClassName?: string
    isNumeric?: boolean
    label?: string
    truncate?: boolean
  }
}

type DataTableDensity = "compact" | "comfortable" | "spacious"

type DataTableFilterChip = {
  id: string
  label: string
  value?: React.ReactNode
  active?: boolean
  onClick?: () => void
  onClear?: () => void
}

type DataTableInitialState = {
  columnFilters?: ColumnFiltersState
  columnPinning?: ColumnPinningState
  columnVisibility?: VisibilityState
  expanded?: ExpandedState
  globalFilter?: string
  pagination?: PaginationState
  rowSelection?: RowSelectionState
  sorting?: SortingState
}

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  className?: string
  tableClassName?: string
  title?: React.ReactNode
  description?: React.ReactNode
  density?: DataTableDensity
  empty?: React.ReactNode
  emptyDescription?: React.ReactNode
  emptyTitle?: React.ReactNode
  error?: React.ReactNode
  filterBar?: React.ReactNode
  filterChips?: DataTableFilterChip[]
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  initialState?: DataTableInitialState
  loading?: boolean
  loadingLabel?: string
  manualFiltering?: boolean
  manualPagination?: boolean
  manualSorting?: boolean
  pageCount?: number
  pageSizeOptions?: number[]
  querySummary?: React.ReactNode
  renderBulkActions?: (table: TanStackTable<TData>) => React.ReactNode
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode
  renderRowActions?: (row: Row<TData>) => React.ReactNode
  renderToolbarActions?: (table: TanStackTable<TData>) => React.ReactNode
  rowCount?: number
  searchPlaceholder?: string
  showColumnVisibility?: boolean
  showPagination?: boolean
  showRowCount?: boolean
  showSearch?: boolean
  showSelectedCount?: boolean
  showToolbar?: boolean
  viewTabs?: React.ReactNode

  columnFilters?: ColumnFiltersState
  columnPinning?: ColumnPinningState
  columnVisibility?: VisibilityState
  expanded?: ExpandedState
  globalFilter?: string
  pagination?: PaginationState
  rowSelection?: RowSelectionState
  sorting?: SortingState

  enableColumnFilters?: boolean
  enableColumnVisibility?: boolean
  enableExpanding?: boolean
  enableGlobalFilter?: boolean
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enablePagination?: boolean
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableSorting?: boolean

  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  onExpandedChange?: OnChangeFn<ExpandedState>
  onGlobalFilterChange?: OnChangeFn<string>
  onPaginationChange?: OnChangeFn<PaginationState>
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  onSortingChange?: OnChangeFn<SortingState>
}

const densityStyles: Record<
  DataTableDensity,
  { cell: string; header: string; row: string }
> = {
  compact: {
    cell: "px-2 py-1.5 text-xs",
    header: "px-2 py-1.5 text-[11px]",
    row: "min-h-8",
  },
  comfortable: {
    cell: "px-3 py-2 text-sm md:text-xs/relaxed",
    header: "px-3 py-2 text-xs",
    row: "min-h-10",
  },
  spacious: {
    cell: "px-4 py-3 text-sm",
    header: "px-4 py-2.5 text-xs",
    row: "min-h-12",
  },
}

const defaultPagination = {
  pageIndex: 0,
  pageSize: 25,
}

function DataTable<TData>({
  columns,
  data,
  className,
  tableClassName,
  title,
  description,
  density = "comfortable",
  empty,
  emptyDescription = "Try changing filters or search.",
  emptyTitle = "No rows found",
  error,
  filterBar,
  filterChips,
  getRowId,
  initialState,
  loading = false,
  loadingLabel = "Loading rows",
  manualFiltering = false,
  manualPagination = false,
  manualSorting = false,
  pageCount,
  pageSizeOptions = [10, 25, 50, 100],
  querySummary,
  renderBulkActions,
  renderExpandedRow,
  renderRowActions,
  renderToolbarActions,
  rowCount,
  searchPlaceholder = "Search rows...",
  showColumnVisibility,
  showPagination,
  showRowCount = true,
  showSearch,
  showSelectedCount = true,
  showToolbar,
  viewTabs,
  columnFilters: columnFiltersProp,
  columnPinning: columnPinningProp,
  columnVisibility: columnVisibilityProp,
  expanded: expandedProp,
  globalFilter: globalFilterProp,
  pagination: paginationProp,
  rowSelection: rowSelectionProp,
  sorting: sortingProp,
  enableColumnFilters = true,
  enableColumnVisibility = true,
  enableExpanding,
  enableGlobalFilter = true,
  enableMultiRowSelection = true,
  enablePagination = true,
  enableRowSelection = false,
  enableSorting = true,
  onColumnFiltersChange,
  onColumnPinningChange,
  onColumnVisibilityChange,
  onExpandedChange,
  onGlobalFilterChange,
  onPaginationChange,
  onRowSelectionChange,
  onSortingChange,
}: DataTableProps<TData>) {
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>(initialState?.columnFilters ?? [])
  const [internalColumnPinning, setInternalColumnPinning] =
    React.useState<ColumnPinningState>(initialState?.columnPinning ?? {})
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {})
  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>(
    initialState?.expanded ?? {}
  )
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState(
    initialState?.globalFilter ?? ""
  )
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>(
      initialState?.pagination ?? defaultPagination
    )
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>(initialState?.rowSelection ?? {})
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  )

  const columnFilters = columnFiltersProp ?? internalColumnFilters
  const columnPinning = columnPinningProp ?? internalColumnPinning
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility
  const expanded = expandedProp ?? internalExpanded
  const globalFilter = globalFilterProp ?? internalGlobalFilter
  const pagination = paginationProp ?? internalPagination
  const rowSelection = rowSelectionProp ?? internalRowSelection
  const sorting = sortingProp ?? internalSorting

  const resolvedOnColumnFiltersChange =
    onColumnFiltersChange ?? setInternalColumnFilters
  const resolvedOnColumnPinningChange =
    onColumnPinningChange ?? setInternalColumnPinning
  const resolvedOnColumnVisibilityChange =
    onColumnVisibilityChange ?? setInternalColumnVisibility
  const resolvedOnExpandedChange = onExpandedChange ?? setInternalExpanded
  const resolvedOnGlobalFilterChange =
    onGlobalFilterChange ?? setInternalGlobalFilter
  const resolvedOnPaginationChange = onPaginationChange ?? setInternalPagination
  const resolvedOnRowSelectionChange =
    onRowSelectionChange ?? setInternalRowSelection
  const resolvedOnSortingChange = onSortingChange ?? setInternalSorting

  const tableColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    const nextColumns = [...columns]

    if (enableRowSelection) {
      nextColumns.unshift({
        id: "__select",
        enableHiding: false,
        enableSorting: false,
        size: 40,
        meta: {
          align: "center",
          label: "Select",
        },
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows on this page"
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked === true)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
          />
        ),
      })
    }

    if (renderRowActions) {
      nextColumns.push({
        id: "__actions",
        enableHiding: false,
        enableSorting: false,
        size: 48,
        meta: {
          align: "right",
          label: "Actions",
        },
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => renderRowActions(row),
      })
    }

    return nextColumns
  }, [columns, enableRowSelection, renderRowActions])

  const shouldUseClientFiltering = enableColumnFilters && !manualFiltering
  const shouldUseClientSorting = enableSorting && !manualSorting
  const shouldUseClientPagination = enablePagination && !manualPagination
  const shouldUseExpanding = Boolean(enableExpanding || renderExpandedRow)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: shouldUseExpanding ? getExpandedRowModel() : undefined,
    getFilteredRowModel: shouldUseClientFiltering
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: shouldUseClientPagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: shouldUseClientSorting ? getSortedRowModel() : undefined,
    getRowCanExpand: renderExpandedRow ? () => true : undefined,
    getRowId,
    manualFiltering,
    manualPagination,
    manualSorting,
    onColumnFiltersChange: resolvedOnColumnFiltersChange,
    onColumnPinningChange: resolvedOnColumnPinningChange,
    onColumnVisibilityChange: resolvedOnColumnVisibilityChange,
    onExpandedChange: resolvedOnExpandedChange,
    onGlobalFilterChange: resolvedOnGlobalFilterChange,
    onPaginationChange: resolvedOnPaginationChange,
    onRowSelectionChange: resolvedOnRowSelectionChange,
    onSortingChange: resolvedOnSortingChange,
    pageCount,
    rowCount,
    enableColumnFilters,
    enableGlobalFilter,
    enableMultiRowSelection,
    enableRowSelection,
    enableSorting,
    state: {
      columnFilters,
      columnPinning,
      columnVisibility,
      expanded,
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
  })

  const visibleRows = table.getRowModel().rows
  const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1)
  const activeFilterChips = filterChips?.filter(
    (chip) => chip.active ?? Boolean(chip.value)
  )
  const selectedRowCount = table.getSelectedRowModel().rows.length
  const totalRowCount = rowCount ?? table.getFilteredRowModel().rows.length
  const toolbarEnabled =
    showToolbar ??
    Boolean(
      title ||
        description ||
        viewTabs ||
        querySummary ||
        filterBar ||
        filterChips?.length ||
        renderToolbarActions ||
        enableGlobalFilter ||
        enableColumnVisibility
    )
  const searchEnabled = showSearch ?? enableGlobalFilter
  const columnVisibilityEnabled =
    showColumnVisibility ?? enableColumnVisibility
  const paginationEnabled = showPagination ?? enablePagination
  const styles = densityStyles[density]

  return (
    <section
      data-slot="data-table"
      className={cn(
        "w-full overflow-hidden rounded-md border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      {toolbarEnabled ? (
        <DataTableToolbar
          activeFilterChips={activeFilterChips}
          columnVisibilityEnabled={columnVisibilityEnabled}
          description={description}
          filterBar={filterBar}
          filterChips={filterChips}
          globalFilter={globalFilter}
          querySummary={querySummary}
          renderToolbarActions={renderToolbarActions}
          searchEnabled={searchEnabled}
          searchPlaceholder={searchPlaceholder}
          table={table}
          title={title}
          viewTabs={viewTabs}
        />
      ) : null}

      <div data-slot="data-table-viewport" className="overflow-x-auto">
        <table
          data-slot="data-table-grid"
          className={cn("w-full caption-bottom border-collapse", tableClassName)}
        >
          <thead data-slot="data-table-header" className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <DataTableHeaderCell
                    key={header.id}
                    densityClassName={styles.header}
                    header={header}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody data-slot="data-table-body">
            {loading || error || visibleRows.length === 0 ? (
              <DataTableStateRow
                colSpan={visibleColumnCount}
                empty={empty}
                emptyDescription={emptyDescription}
                emptyTitle={emptyTitle}
                error={error}
                loading={loading}
                loadingLabel={loadingLabel}
              />
            ) : (
              visibleRows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    data-selected={row.getIsSelected() ? "true" : undefined}
                    className={cn(
                      "group/row border-b transition-colors hover:bg-muted/40 data-[selected=true]:bg-primary/5",
                      styles.row
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta

                      return (
                        <td
                          key={cell.id}
                          data-slot="data-table-cell"
                          className={cn(
                            "align-middle",
                            styles.cell,
                            getAlignClassName(meta),
                            meta?.isNumeric &&
                              "font-mono tabular-nums tracking-tight",
                            meta?.truncate &&
                              "max-w-[18rem] truncate whitespace-nowrap",
                            cell.column.getIsPinned() &&
                              "bg-card group-hover/row:bg-muted",
                            meta?.cellClassName
                          )}
                          style={getPinnedStyle(cell.column)}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {row.getIsExpanded() && renderExpandedRow ? (
                    <tr className="border-b bg-muted/25">
                      <td
                        className="px-3 py-3"
                        colSpan={visibleColumnCount}
                      >
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRowCount > 0 || showRowCount || paginationEnabled ? (
        <div
          data-slot="data-table-footer"
          className="flex flex-col gap-3 border-t bg-card px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {showRowCount ? (
              <span className="font-mono tabular-nums">
                {totalRowCount.toLocaleString()} rows
              </span>
            ) : null}
            {showSelectedCount && selectedRowCount > 0 ? (
              <span className="font-mono tabular-nums text-foreground">
                {selectedRowCount.toLocaleString()} selected
              </span>
            ) : null}
            {renderBulkActions && selectedRowCount > 0 ? (
              <div className="ml-1 flex flex-wrap items-center gap-2">
                {renderBulkActions(table)}
              </div>
            ) : null}
          </div>

          {paginationEnabled ? (
            <DataTablePagination
              pageSizeOptions={pageSizeOptions}
              table={table}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function DataTableToolbar<TData>({
  activeFilterChips,
  columnVisibilityEnabled,
  description,
  filterBar,
  filterChips,
  globalFilter,
  querySummary,
  renderToolbarActions,
  searchEnabled,
  searchPlaceholder,
  table,
  title,
  viewTabs,
}: {
  activeFilterChips?: DataTableFilterChip[]
  columnVisibilityEnabled: boolean
  description?: React.ReactNode
  filterBar?: React.ReactNode
  filterChips?: DataTableFilterChip[]
  globalFilter: string
  querySummary?: React.ReactNode
  renderToolbarActions?: (table: TanStackTable<TData>) => React.ReactNode
  searchEnabled: boolean
  searchPlaceholder: string
  table: TanStackTable<TData>
  title?: React.ReactNode
  viewTabs?: React.ReactNode
}) {
  const hasActiveFilters =
    Boolean(activeFilterChips?.length) || Boolean(globalFilter)

  return (
    <div
      data-slot="data-table-toolbar"
      className="flex flex-col gap-3 border-b bg-card p-3"
    >
      {title || description || viewTabs ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-1">
            {title ? (
              <h3 className="text-base font-medium leading-none text-foreground">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-xs/relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {viewTabs ? <div className="shrink-0">{viewTabs}</div> : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {searchEnabled ? (
            <div className="relative min-w-[15rem] flex-1 sm:max-w-sm">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search table rows"
                className="h-8 pl-7"
                value={globalFilter ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}

          {filterChips?.map((chip) => (
            <DataTableFilterChip key={chip.id} chip={chip} />
          ))}

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                table.setGlobalFilter("")
                table.resetColumnFilters()
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {querySummary ? (
            <div className="text-xs text-muted-foreground">{querySummary}</div>
          ) : null}
          {renderToolbarActions?.(table)}
          {columnVisibilityEnabled ? (
            <DataTableColumnVisibility table={table} />
          ) : null}
        </div>
      </div>

      {filterBar ? <div>{filterBar}</div> : null}
    </div>
  )
}

function DataTableFilterChip({ chip }: { chip: DataTableFilterChip }) {
  const active = chip.active ?? Boolean(chip.value)
  const handleClick = active ? chip.onClear : chip.onClick

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      disabled={!handleClick}
      onClick={handleClick}
    >
      <span>{chip.label}</span>
      {chip.value ? (
        <span className="font-normal text-muted-foreground">{chip.value}</span>
      ) : (
        <span aria-hidden="true" className="text-muted-foreground">
          +
        </span>
      )}
      {active ? <XIcon aria-hidden="true" className="size-3" /> : null}
    </button>
  )
}

function DataTableColumnVisibility<TData>({
  table,
}: {
  table: TanStackTable<TData>
}) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  if (hideableColumns.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Columns3Icon />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked)}
          >
            {getColumnLabel(column)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTableHeaderCell<TData>({
  densityClassName,
  header,
}: {
  densityClassName: string
  header: Header<TData, unknown>
}) {
  const column = header.column
  const meta = column.columnDef.meta
  const sortDirection = column.getIsSorted()
  const canSort = column.getCanSort()
  const ariaSort =
    sortDirection === "asc"
      ? "ascending"
      : sortDirection === "desc"
        ? "descending"
        : "none"

  return (
    <th
      data-slot="data-table-head"
      aria-sort={canSort ? ariaSort : undefined}
      className={cn(
        "sticky top-0 z-10 h-9 whitespace-nowrap align-middle font-medium uppercase tracking-wide text-muted-foreground",
        densityClassName,
        getAlignClassName(meta),
        column.getIsPinned() && "bg-muted",
        meta?.headerClassName
      )}
      colSpan={header.colSpan}
      style={getPinnedStyle(column)}
    >
      {header.isPlaceholder ? null : canSort ? (
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40",
            meta?.align === "right" && "ml-auto",
            meta?.align === "center" && "mx-auto"
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          <span>
            {flexRender(column.columnDef.header, header.getContext())}
          </span>
          <SortIcon direction={sortDirection} />
          {column.getSortIndex() > 0 ? (
            <span className="font-mono text-[10px] tabular-nums">
              {column.getSortIndex() + 1}
            </span>
          ) : null}
        </button>
      ) : (
        flexRender(column.columnDef.header, header.getContext())
      )}
    </th>
  )
}

function DataTableStateRow({
  colSpan,
  empty,
  emptyDescription,
  emptyTitle,
  error,
  loading,
  loadingLabel,
}: {
  colSpan: number
  empty?: React.ReactNode
  emptyDescription?: React.ReactNode
  emptyTitle?: React.ReactNode
  error?: React.ReactNode
  loading: boolean
  loadingLabel: string
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-12 text-center">
        {loading ? (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner aria-hidden="true" />
            {loadingLabel}
          </div>
        ) : error ? (
          <div className="mx-auto grid max-w-sm gap-1 text-sm">
            <div className="font-medium text-destructive">
              Could not load table
            </div>
            <div className="text-muted-foreground">{error}</div>
          </div>
        ) : (
          empty ?? (
            <div className="mx-auto grid max-w-sm gap-1 text-sm">
              <div className="font-medium text-foreground">{emptyTitle}</div>
              <div className="text-muted-foreground">{emptyDescription}</div>
            </div>
          )
        )}
      </td>
    </tr>
  )
}

function DataTablePagination<TData>({
  pageSizeOptions,
  table,
}: {
  pageSizeOptions: number[]
  table: TanStackTable<TData>
}) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  const hasKnownPageCount = pageCount >= 0

  return (
    <div
      data-slot="data-table-pagination"
      className="flex flex-wrap items-center gap-2"
    >
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        Rows
        <select
          className="h-8 rounded-sm border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          value={table.getState().pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          {pageSizeOptions.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </label>
      <div className="min-w-24 text-center font-mono text-xs tabular-nums text-muted-foreground">
        Page {pageIndex + 1}
        {hasKnownPageCount ? ` / ${Math.max(pageCount, 1)}` : null}
      </div>
      <div className="flex items-center gap-1">
        {hasKnownPageCount ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="First page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          >
            <ChevronsLeftIcon />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRightIcon />
        </Button>
        {hasKnownPageCount ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Last page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}
          >
            <ChevronsRightIcon />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function SortIcon({
  direction,
}: {
  direction: false | "asc" | "desc"
}) {
  if (direction === "asc") {
    return <ArrowUpIcon aria-hidden="true" className="size-3.5" />
  }

  if (direction === "desc") {
    return <ArrowDownIcon aria-hidden="true" className="size-3.5" />
  }

  return (
    <ChevronsUpDownIcon
      aria-hidden="true"
      className="size-3.5 opacity-45"
    />
  )
}

function getAlignClassName(meta?: {
  align?: "left" | "center" | "right"
  isNumeric?: boolean
}) {
  if (meta?.align === "center") {
    return "text-center"
  }

  if (meta?.align === "right" || meta?.isNumeric) {
    return "text-right"
  }

  return "text-left"
}

function getColumnLabel<TData>(column: Column<TData, unknown>) {
  return column.columnDef.meta?.label ?? column.id
}

function getPinnedStyle<TData>(
  column: Column<TData, unknown>
): React.CSSProperties {
  const pinned = column.getIsPinned()

  if (!pinned) {
    return {}
  }

  const isLastLeft = pinned === "left" && column.getIsLastColumn("left")
  const isFirstRight = pinned === "right" && column.getIsFirstColumn("right")

  return {
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: "sticky",
    zIndex: 20,
    boxShadow: isLastLeft
      ? "inset -1px 0 var(--border)"
      : isFirstRight
        ? "inset 1px 0 var(--border)"
        : undefined,
  }
}

export {
  DataTable,
  type DataTableDensity,
  type DataTableFilterChip,
  type DataTableInitialState,
  type DataTableProps,
}
