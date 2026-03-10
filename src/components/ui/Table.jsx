import { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Reusable table with optional column sorting and visibility.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string, sortable?: boolean, align?: 'left'|'right', className?: string, sortValue?: (row: Object) => any, render?: (value: any, row: Object) => React.ReactNode }>} props.columns
 * @param {Object[]} props.data
 * @param {string[]} [props.visibleColumnIds] - If provided, only these columns are shown (order preserved)
 * @param {string} [props.defaultSortKey]
 * @param {'asc'|'desc'} [props.defaultSortDir='desc']
 * @param {(row: Object) => string} [props.keyExtractor] - Row key for React (default: row.id)
 * @param {number} [props.pageSize] - If set, enables pagination
 * @param {string} [props.emptyMessage] - Message when data is empty
 */
export function Table({
  columns,
  data,
  visibleColumnIds,
  defaultSortKey,
  defaultSortDir = "desc",
  keyExtractor = (row) => row.id,
  pageSize,
  emptyMessage = "No data",
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? columns[0]?.id ?? "");
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleColumns = useMemo(() => {
    if (visibleColumnIds?.length) {
      return columns.filter((c) => visibleColumnIds.includes(c.id));
    }
    return columns;
  }, [columns, visibleColumnIds]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.id === sortKey);
    const getVal = col?.sortValue ?? ((row) => row[sortKey]);
    return [...data].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va ?? "").localeCompare(String(vb ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const start = pageSize ? (currentPage - 1) * pageSize : 0;
  const end = pageSize ? start + pageSize : sortedData.length;
  const pageData = sortedData.slice(start, end);

  const handleSort = (colId) => {
    const col = columns.find((c) => c.id === colId);
    if (!col?.sortable) return;
    setSortKey(colId);
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const thClass = (col) =>
    cn(
      "px-4 py-3 text-left font-medium text-muted-foreground",
      col.align === "right" && "text-right",
      col.className
    );

  const tdClass = (col) =>
    cn(
      "px-4 py-3 text-left",
      col.align === "right" && "text-right",
      col.className
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className={thClass(col)}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.id)}
                    className="inline-flex items-center gap-1 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 rounded"
                  >
                    {col.label}
                    {sortKey === col.id ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-4 w-4" aria-hidden />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      )
                    ) : null}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            pageData.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border/60 transition hover:bg-muted/20"
              >
                {visibleColumns.map((col) => (
                  <td key={col.id} className={tdClass(col)}>
                    {col.render ? col.render(row[col.id], row) : (row[col.id] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pageSize && sortedData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:px-5">
          <p className="text-xs text-muted-foreground">
            Showing {start + 1}–{end} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition",
                currentPage <= 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-muted hover:text-secondary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-24 px-2 text-center text-sm font-medium text-secondary">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition",
                currentPage >= totalPages
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
