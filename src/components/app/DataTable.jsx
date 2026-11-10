import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { SkeletonBlock, LoadingLabel } from "./SkeletonBlock";

/**
 * DataTable - Bordered list table (Plaid's Logs/Institutions anatomy).
 *
 * columns: [{ id, header, cell(row), align?: "left"|"right", className?, headerClassName?,
 *             sortValue?(row) }]  A column sorts only when `sortValue` is given, so a
 *             server-paginated table simply omits it rather than sorting one page.
 * empty:   node rendered in place of rows when there are none (use <EmptyState/>).
 */
export function DataTable({
  caption,
  columns,
  rows,
  rowKey,
  loading = false,
  skeletonRows = 5,
  empty,
  defaultSort,
  minWidth = 640,
  className,
}) {
  const [sort, setSort] = useState(defaultSort ?? null);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.sortValue(a);
      const vb = col.sortValue(b);
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va ?? "").localeCompare(String(vb ?? ""), undefined, { numeric: true }) * dir;
    });
  }, [rows, sort, columns]);

  function toggleSort(id) {
    setSort((prev) =>
      prev?.id === id ? { id, dir: prev.dir === "asc" ? "desc" : "asc" } : { id, dir: "asc" }
    );
  }

  const showSkeleton = loading && rows.length === 0;
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-hairline bg-canvas shadow-card", className)}>
      {/* relative: contains sr-only (absolute) labels so they can't widen the page */}
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-hairline">
              {columns.map((col) => {
                const sortable = Boolean(col.sortValue);
                const active = sort?.id === col.id;
                const ariaSort = sortable
                  ? active
                    ? sort.dir === "asc" ? "ascending" : "descending"
                    : "none"
                  : undefined;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-[13px] font-medium text-ink-muted first:pl-5 last:pr-5",
                      col.align === "right" && "text-right",
                      col.headerClassName ?? col.className
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.id)}
                        className={cn(
                          "-mx-1 inline-flex items-center gap-1 rounded px-1 transition-colors hover:text-ink focus-ring",
                          active && "text-ink"
                        )}
                      >
                        {col.header}
                        {active ? (
                          sort.dir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-violet" aria-hidden />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-violet" aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cn(loading && rows.length > 0 && "opacity-60 transition-opacity")}>
            {showSkeleton &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b border-hairline last:border-b-0">
                  {columns.map((col, j) => (
                    <td key={col.id} className="px-4 py-4 first:pl-5 last:pr-5">
                      <SkeletonBlock className={cn("h-3.5", j === 0 ? "w-40" : "w-20", col.align === "right" && "ml-auto")} />
                    </td>
                  ))}
                </tr>
              ))}
            {sortedRows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-hairline transition-colors last:border-b-0 hover:bg-sunken/70"
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "px-4 py-3.5 align-middle text-ink first:pl-5 last:pr-5",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showSkeleton && <LoadingLabel>Loading {caption?.toLowerCase() ?? "rows"}</LoadingLabel>}
      {showEmpty && empty}
    </div>
  );
}
