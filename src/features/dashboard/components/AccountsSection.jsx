import { Building2, Plus, Upload } from "lucide-react";

/**
 * AccountsSection - List of account cards and actions (Add account, Upload statements).
 */
export function AccountsSection({
  accounts,
  onAddAccount,
  onUploadStatements,
}) {
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
        {accounts.map((acc) => {
          const num = String(acc.accountNumber).replace(/\D/g, "");
          const mask = num.length >= 4 ? "****" + num.slice(-4) : "****" + num;
          const label = acc.accountType
            ? acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)
            : "";
          return (
            <div
              key={acc._id}
              className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/30 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-secondary truncate">
                  {acc.accountName ?? label}
                </p>
                <p className="text-xs text-muted-foreground">{label} · {mask}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
