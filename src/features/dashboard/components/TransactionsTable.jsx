import { useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Layers } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { cn } from "@/lib/cn";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = String(d).split("-");
  return `${day} ${MONTHS[Number(m) - 1] ?? m} ${y}`;
};

const CATEGORY_STYLES = {
  "Food & Dining": "bg-orange-50 text-orange-600 ring-orange-100",
  "Utilities":     "bg-blue-50 text-blue-600 ring-blue-100",
  "Transfer":      "bg-violet-50 text-violet-600 ring-violet-100",
  "Shopping":      "bg-pink-50 text-pink-600 ring-pink-100",
  "Income":        "bg-emerald-50 text-emerald-600 ring-emerald-100",
  "Cash":          "bg-slate-100 text-slate-600 ring-slate-200",
};
const getCategoryStyle = (cat) =>
  CATEGORY_STYLES[cat] ?? "bg-gray-50 text-gray-500 ring-gray-100";

export function TransactionsTable({
  transactions,
  accounts = [],
  activeBank = null,
  onBankChange,
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
}) {
  const banks = useMemo(
    () => [...new Set(accounts.map((a) => a.bankName).filter(Boolean))],
    [accounts]
  );

  const columns = useMemo(
    () => [
      {
        id: "date",
        label: "Date",
        sortable: true,
        sortValue: (row) => row.date,
        render: (_, row) => (
          <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
            {formatDate(row.date)}
          </span>
        ),
      },
      {
        id: "description",
        label: "Description",
        sortable: true,
        render: (val, row) => {
          const positive = Number(row.amount) >= 0;
          return (
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  positive
                    ? "bg-emerald-50 text-emerald-500"
                    : "bg-red-50 text-red-400"
                )}
              >
                {positive
                  ? <ArrowDownLeft className="h-3 w-3" />
                  : <ArrowUpRight className="h-3 w-3" />
                }
              </span>
              <span className="truncate max-w-[180px] font-medium text-secondary sm:max-w-xs">
                {val}
              </span>
            </div>
          );
        },
      },
      {
        id: "category",
        label: "Category",
        sortable: true,
        render: (val) =>
          val ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                getCategoryStyle(val)
              )}
            >
              {val}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "account",
        label: "Account",
        sortable: true,
        className: "hidden sm:table-cell",
        render: (val) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">{val ?? "—"}</span>
        ),
      },
      {
        id: "amount",
        label: "Amount",
        sortable: true,
        align: "right",
        sortValue: (row) => Number(row.amount),
        render: (_, row) => {
          const n = Number(row.amount);
          const positive = n >= 0;
          return (
            <span
              className={cn(
                "whitespace-nowrap font-semibold tabular-nums",
                positive ? "text-emerald-600" : "text-secondary"
              )}
            >
              {positive ? "+" : "−"}Rs {Math.abs(n).toLocaleString()}
            </span>
          );
        },
      },
      {
        id: "balance",
        label: "Balance",
        sortable: true,
        align: "right",
        sortValue: (row) => Number(row.balance),
        className: "hidden md:table-cell",
        render: (_, row) => (
          <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
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
    <div className="rounded-2xl border border-border/70 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-secondary">Transactions</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalItems > 0
                ? `${totalItems.toLocaleString()} total · click a column to sort`
                : "All parsed transactions"}
            </p>
          </div>
          {isLoading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-tertiary" />
          )}
        </div>

        {/* Bank filter tabs */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          <button
            type="button"
            onClick={() => onBankChange?.(null)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              activeBank === null
                ? "bg-secondary text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-secondary"
            )}
          >
            <Layers className="h-3 w-3" />
            All banks
          </button>
          {banks.map((bank) => (
            <button
              key={bank}
              type="button"
              onClick={() => onBankChange?.(bank)}
              className={cn(
                "inline-flex shrink-0 items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                activeBank === bank
                  ? "bg-tertiary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-secondary"
              )}
            >
              {bank}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={cn("border-t border-border/50", isLoading && "opacity-60 pointer-events-none")}>
        <Table
          columns={columns}
          data={transactions}
          defaultSortKey="date"
          defaultSortDir="desc"
          keyExtractor={(row) => row._id ?? row.id}
          emptyMessage={
            isLoading
              ? "Loading…"
              : activeBank
              ? `No transactions found for ${activeBank}`
              : "No transactions"
          }
        />
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 bg-muted/10 px-5 py-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-secondary">{start}–{end}</span>
            {" "}of{" "}
            <span className="font-medium text-secondary">{totalItems.toLocaleString()}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1 || isLoading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition",
                page <= 1 || isLoading
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-muted hover:text-secondary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[72px] px-2 text-center text-xs font-medium text-secondary">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages || isLoading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition",
                page >= totalPages || isLoading
                  ? "cursor-not-allowed opacity-40"
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
