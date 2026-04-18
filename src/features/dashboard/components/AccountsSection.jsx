import { useState } from "react";
import { Building2, Plus, Upload, Eye, EyeOff, Copy, Check } from "lucide-react";

/**
 * AccountsSection - List of account cards and actions (Add account, Upload statements).
 */
export function AccountsSection({
  accounts,
  isLoading = false,
  onAddAccount,
  onUploadStatements,
}) {
  const [visibleIds, setVisibleIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  function toggleVisible(id) {
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function copyAccountId(id, accountId) {
    navigator.clipboard.writeText(accountId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="rounded-xl border border-border/80 bg-primary p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-secondary">Accounts</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add an account or upload statements
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAddAccount}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-border bg-primary px-3 py-2 text-sm font-medium text-secondary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add account
          </button>
          <button
            type="button"
            onClick={onUploadStatements}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-tertiary px-3 py-2 text-sm font-medium text-tertiary-foreground hover:bg-tertiary/90 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
          >
            <Upload className="h-4 w-4" />
            Upload statements
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && accounts.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-muted" />
                    <div className="h-2.5 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))
          : accounts.map((acc) => {
          const num = String(acc.accountNumber).replace(/\D/g, "");
          const mask = num.length >= 4 ? "****" + num.slice(-4) : "****" + num;
          const label = acc.accountType
            ? acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)
            : "";
          const isVisible = !!visibleIds[acc._id];
          const isCopied = copiedId === acc._id;
          return (
            <div
              key={acc._id}
              className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-secondary truncate">
                    {acc.accountName ?? label}
                  </p>
                  <p className="text-xs text-muted-foreground">{acc.bankName ? `${acc.bankName} · ` : ""}{label} · {mask}</p>
                </div>
                {acc.accountId && (
                  <button
                    type="button"
                    onClick={() => toggleVisible(acc._id)}
                    title={isVisible ? "Hide account ID" : "Show account ID"}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:text-secondary focus:outline-none focus:ring-2 focus:ring-tertiary"
                  >
                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {isVisible && acc.accountId && (
                <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/50 px-3 py-1.5">
                  <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground font-mono">
                    {acc.accountId}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyAccountId(acc._id, acc.accountId)}
                    title="Copy account ID"
                    className="shrink-0 rounded p-1 text-muted-foreground hover:text-secondary focus:outline-none focus:ring-2 focus:ring-tertiary"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
