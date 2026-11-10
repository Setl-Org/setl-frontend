import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Upload, Receipt, SearchX, RotateCcw } from "lucide-react";
import api from "@/lib/api";
import { formatCount } from "@/lib/format";
import { useApp } from "@/features/app-shell/useApp";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { DataTable } from "@/components/app/DataTable";
import { EmptyState } from "@/components/app/EmptyState";
import { Pagination } from "@/components/app/Pagination";
import { BankChips } from "@/components/app/BankChips";
import { SegmentedControl } from "@/components/app/SegmentedControl";
import { TxDescription, TxAmount, TxDate, TxCategory, TxAccount, TxBalance } from "../components/TxCells";

const PAGE_SIZE = 20;

/**
 * Transactions - server-paginated list. Bank, type and page live in the URL so a
 * filtered view can be shared or bookmarked. Columns don't sort: sorting one page
 * of a server list would misrepresent the rest.
 */
export function TransactionsPage() {
  const { accounts, dataVersion, openUpload } = useApp();
  const [params, setParams] = useSearchParams();
  const bank = params.get("bank") ?? "";
  const type = params.get("type") ?? "all";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [state, setState] = useState({ status: "loading", items: [], totalItems: 0, totalPages: 1 });
  const [attempt, setAttempt] = useState(0);

  const banks = useMemo(
    () => [...new Set(accounts.items.map((a) => a.bankName).filter(Boolean))],
    [accounts.items]
  );

  function update(next) {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v === "" || v == null || (k === "type" && v === "all") || (k === "page" && v === 1)) p.delete(k);
      else p.set(k, String(v));
    }
    setParams(p, { replace: false });
  }

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    const q = { page, limit: PAGE_SIZE };
    if (bank) q.bankName = bank;
    if (type !== "all") q.type = type;
    api
      .get("/transactions", { params: q })
      .then((res) => {
        if (cancelled) return;
        setState({
          status: "ready",
          items: res.data.data?.transactions ?? [],
          totalItems: res.data.pagination?.totalItems ?? 0,
          totalPages: res.data.pagination?.totalPages ?? 1,
        });
      })
      .catch(() => !cancelled && setState({ status: "error", items: [], totalItems: 0, totalPages: 1 }));
    return () => {
      cancelled = true;
    };
  }, [bank, type, page, dataVersion, attempt]);

  const filtered = Boolean(bank) || type !== "all";

  const columns = [
    { id: "date", header: "Date", cell: (r) => <TxDate value={r.date} /> },
    { id: "description", header: "Description", cell: (r) => <TxDescription row={r} /> },
    { id: "category", header: "Category", cell: (r) => <TxCategory value={r.category} /> },
    { id: "account", header: "Account", cell: (r) => <TxAccount bankName={r.account} /> },
    { id: "amount", header: "Amount", align: "right", cell: (r) => <TxAmount value={r.amount} /> },
    { id: "balance", header: "Balance", align: "right", cell: (r) => <TxBalance value={r.balance} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        description="Every transaction Setl has parsed from your statements, across all your accounts."
        actions={
          <AppButton variant="primary" leadingIcon={Upload} onClick={openUpload}>
            Upload statement
          </AppButton>
        }
      />

      <div className="space-y-4">
        {banks.length > 0 && (
          <BankChips banks={banks} value={bank} onChange={(v) => update({ bank: v, page: 1 })} />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              label="Transaction type"
              value={type}
              onChange={(v) => update({ type: v, page: 1 })}
              options={[
                { value: "all", label: "All" },
                { value: "credit", label: "Credits" },
                { value: "debit", label: "Debits" },
              ]}
            />
            {filtered && (
              <AppButton variant="ghost" size="sm" leadingIcon={RotateCcw} onClick={() => setParams(new URLSearchParams())}>
                Reset filters
              </AppButton>
            )}
          </div>
          <p className="text-[13px] text-ink-muted" aria-live="polite">
            {state.status === "ready" && `${formatCount(state.totalItems)} ${state.totalItems === 1 ? "transaction" : "transactions"}`}
          </p>
        </div>

        <DataTable
          caption="Transactions"
          columns={columns}
          rows={state.items}
          rowKey={(r) => r.id ?? r._id}
          loading={state.status === "loading"}
          skeletonRows={8}
          minWidth={900}
          empty={
            state.status === "error" ? (
              <EmptyState
                tone="error"
                title="Couldn't load transactions"
                description="The server didn't respond. Nothing has changed with your data."
                action={<AppButton size="sm" onClick={() => setAttempt((n) => n + 1)}>Try again</AppButton>}
              />
            ) : filtered ? (
              <EmptyState
                icon={SearchX}
                title="No transactions match these filters"
                description={bank ? `Nothing for ${bank} with this filter. Try another bank or type.` : "Try another type."}
                action={<AppButton size="sm" onClick={() => setParams(new URLSearchParams())}>Reset filters</AppButton>}
              />
            ) : (
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                description="Upload a PDF statement and Setl will list and categorise every transaction in it."
                action={<AppButton size="sm" variant="primary" leadingIcon={Upload} onClick={openUpload}>Upload statement</AppButton>}
              />
            )
          }
        />

        <Pagination
          page={page}
          totalPages={state.totalPages}
          totalItems={state.totalItems}
          pageSize={PAGE_SIZE}
          disabled={state.status === "loading"}
          onPageChange={(p) => update({ page: p })}
        />
      </div>
    </div>
  );
}
