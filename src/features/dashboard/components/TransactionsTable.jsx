import { useMemo } from "react";
import { Table } from "@/components/ui/Table";

const PAGE_SIZE = 5;
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

/**
 * TransactionsTable - Parsed transactions using reusable Table with sorting and optional column visibility.
 *
 * @param {Object} props
 * @param {Object[]} props.transactions - Rows with date, account, description, category, amount, balance
 * @param {string[]} [props.visibleColumnIds] - Optional list of column ids to show (e.g. ['date','account','description','amount'])
 */
export function TransactionsTable({ transactions, visibleColumnIds }) {
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
            Rs {Number(row.balance).toLocaleString()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="rounded-xl border border-border/80 bg-primary shadow-sm overflow-hidden">
      <div className="border-b border-border/80 bg-muted/30 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-secondary">Parsed transactions</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Sort by column header</p>
      </div>
      <Table
        columns={columns}
        data={transactions}
        visibleColumnIds={visibleColumnIds}
        defaultSortKey="date"
        defaultSortDir="desc"
        keyExtractor={(row) => row.id}
        pageSize={PAGE_SIZE}
        emptyMessage="No transactions"
      />
    </div>
  );
}
