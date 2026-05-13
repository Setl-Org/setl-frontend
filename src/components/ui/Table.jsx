import { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Reusable table with optional column sorting and visibility.
 *
 * @param {Array<{ id, label, sortable?, align?, className?, sortValue?, render? }>} props.columns
 * @param {Object[]} props.data
 * @param {string[]} [props.visibleColumnIds]
 * @param {string} [props.defaultSortKey]
 * @param {'asc'|'desc'} [props.defaultSortDir='desc']
 * @param {(row: Object) => string} [props.keyExtractor]
 * @param {number} [props.pageSize]
 * @param {string} [props.emptyMessage]
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
  const sliceStart = pageSize ? (currentPage - 1) * pageSize : 0;
  const sliceEnd = pageSize ? sliceStart + pageSize : sortedData.length;
  const pageData = sortedData.slice(sliceStart, sliceEnd);

  const handleSort = (colId) => {
    const col = columns.find((c) => c.id === colId);
    if (!col?.sortable) return;
    if (sortKey === colId) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(colId);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60">
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "px-5 py-3 text-left",
                  col.align === "right" && "text-right",
                  col.className
                )}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-1 rounded"
                  >
                    {col.label}
                    <span className="text-muted-foreground/50">
                      {sortKey === col.id ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3 w-3 text-tertiary" aria-hidden />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-tertiary" aria-hidden />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3" aria-hidden />
                      )}
                    </span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </span>
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
                className="px-5 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            pageData.map((row, rowIdx) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  "border-b border-border/40 transition-colors hover:bg-muted/30",
                  rowIdx === pageData.length - 1 && "border-b-0"
                )}
              >
                {visibleColumns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "px-5 py-3.5 text-left",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row[col.id], row) : (row[col.id] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pageSize && sortedData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 bg-muted/10 px-5 py-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing {sliceStart + 1}–{sliceEnd} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition",
                currentPage <= 1
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-muted hover:text-secondary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[72px] px-2 text-center text-xs font-medium text-secondary">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition",
                currentPage >= totalPages
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
