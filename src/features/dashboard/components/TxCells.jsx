import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRs, formatDate } from "@/lib/format";
import { BankLogo } from "@/components/ui/BankLogo";

/** Shared cells so every transaction list reads the same. */

export function TxDescription({ row }) {
  const credit = Number(row.amount) >= 0;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          credit ? "bg-positive-soft text-positive" : "bg-sunken text-ink-muted"
        )}
      >
        {credit ? <ArrowDownLeft className="h-3.5 w-3.5" aria-hidden /> : <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
        <span className="sr-only">{credit ? "Credit" : "Debit"}</span>
      </span>
      <span className="max-w-[320px] truncate font-medium text-ink" title={row.description}>
        {row.description || "No description"}
      </span>
    </div>
  );
}

export function TxAmount({ value }) {
  const n = Number(value);
  return (
    <span className={cn("whitespace-nowrap font-semibold tabular-nums", n >= 0 ? "text-positive" : "text-ink")}>
      {formatRs(n, { signed: true })}
    </span>
  );
}

export function TxDate({ value }) {
  return <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatDate(value)}</span>;
}

export function TxCategory({ value }) {
  if (!value) return <span className="text-ink-subtle">Uncategorised</span>;
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-sunken px-2.5 py-0.5 text-[12px] font-medium text-ink-muted">
      {value}
    </span>
  );
}

export function TxAccount({ bankName }) {
  if (!bankName) return <span className="text-ink-subtle">Unknown</span>;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-ink">
      <BankLogo bankName={bankName} className="h-5 w-5 rounded-[5px]" />
      {bankName}
    </span>
  );
}

export function TxBalance({ value }) {
  if (value == null) return <span className="text-ink-subtle">Not given</span>;
  return <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatRs(value)}</span>;
}
