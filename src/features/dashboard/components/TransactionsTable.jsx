import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { cn } from "@/lib/cn";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = String(d).split("-");
  return `${day} ${MONTHS[Number(m) - 1] ?? m} ${y}`;
};

const formatAmount = (amt) => {
  const n = Number(amt);
  const sign = n >= 0 ? "" : "−";
  return `${sign}Rs ${Math.abs(n).toLocaleString()}`;
};

export function TransactionsTable({
  transactions,
  visibleColumnIds,
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
}) {
  const columns = useMemo(
    () => [
      {
        id: "date",
        label: "Date",
        sortable: true,
        sortValue: (row) => row.date,
        render: (_, row) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDate(row.date)}
          </span>
        ),
      },
      {
        id: "account",
        label: "Account",
        sortable: true,
        render: (val) => (
          <span className="whitespace-nowrap text-muted-foreground">{val ?? "—"}</span>
        ),
      },
      {
        id: "description",
        label: "Description",
        sortable: true,
        render: (val) => <span className="font-medium text-secondary">{val}</span>,
      },
      {
        id: "category",
        label: "Category",
        sortable: true,
        render: (val) => <span className="text-muted-foreground">{val}</span>,
      },
      {
        id: "amount",
        label: "Amount",
        sortable: true,
        sortValue: (row) => Number(row.amount),
        render: (_, row) => (
          <span
            className={`whitespace-nowrap font-medium ${
              Number(row.amount) >= 0 ? "text-success" : "text-secondary"
            }`}
          >
            {formatAmount(row.amount)}
          </span>
        ),
      },
      {
        id: "balance",
        label: "Balance",
        sortable: true,
        sortValue: (row) => Number(row.balance),
        className: "hidden sm:table-cell",
        render: (_, row) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.balance != null ? `Rs ${Number(row.balance).toLocaleString()}` : "—"}
          </span>
        ),
      },
    ],
    []
  );

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="rounded-xl border border-border/80 bg-primary shadow-sm overflow-hidden">
      <div className="border-b border-border/80 bg-muted/30 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-secondary">Parsed transactions</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Sort by column header</p>
      </div>

      <div className={cn(isLoading && "opacity-60 pointer-events-none")}>
        <Table
          columns={columns}
          data={transactions}
          visibleColumnIds={visibleColumnIds}
          defaultSortKey="date"
          defaultSortDir="desc"
          keyExtractor={(row) => row.id}
          emptyMessage={isLoading ? "Loading…" : "No transactions"}
        />
      </div>

      {totalItems > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:px-5">
          <p className="text-xs text-muted-foreground">
            Showing {start}–{end} of {totalItems.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1 || isLoading}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition",
                page <= 1 || isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-muted hover:text-secondary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-24 px-2 text-center text-sm font-medium text-secondary">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages || isLoading}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition",
                page >= totalPages || isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-muted hover:text-secondary"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
