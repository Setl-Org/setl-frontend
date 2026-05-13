import { Building2, FileUp, Receipt } from "lucide-react";

const ICONS = { FileUp, Receipt, Building2 };

/**
 * StatCard - Dashboard summary card with label, value, and optional icon.
 */
export function StatCard({ label, value, sub, iconKey }) {
  const Icon = ICONS[iconKey];

  return (
    <div className="card-hover rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition-all hover:border-tertiary/20 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            {value || "—"}
          </p>
          {sub && (
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
