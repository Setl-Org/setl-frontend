import { ChevronLeft, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRs } from "@/lib/format";
import { BankLogo } from "@/components/ui/BankLogo";
import { AppButton } from "@/components/app/AppButton";

/**
 * ExploreCard - Plaid's Explore tile: copy and one action on the left, a product
 * illustration cropped against the right edge. The illustration hides below sm.
 */
export function ExploreCard({ title, description, actionLabel, onAction, actionTo, actionIcon, art, className }) {
  return (
    <article
      className={cn(
        "group relative isolate grid min-h-[236px] overflow-hidden rounded-[20px] border border-lilac-strong/70 bg-[linear-gradient(115deg,#faf7fe_0%,#f3eef9_55%,#ece4fa_100%)] transition-shadow duration-300 hover:shadow-raised sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        className
      )}
    >
      <div className="relative z-10 flex flex-col justify-center px-6 py-7 sm:px-9">
        <h3 className="text-[21px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
        <p className="mt-2 max-w-[340px] text-[15px] leading-relaxed text-ink-muted">{description}</p>
        <div className="mt-5">
          <AppButton variant="secondary" onClick={onAction} to={actionTo} leadingIcon={actionIcon}>
            {actionLabel}
          </AppButton>
        </div>
      </div>
      <div className="relative hidden sm:block" aria-hidden>
        {art}
      </div>
    </article>
  );
}

const ART_BANKS = ["HBL", "Meezan Bank", "UBL", "NayaPay", "Bank Alfalah"];

/** A connect sheet, like the one end users see. */
export function ConnectSheetArt() {
  return (
    <div className="absolute bottom-0 right-6 top-8 w-[290px] rounded-t-[18px] border border-hairline bg-canvas p-4 shadow-raised transition-transform duration-500 group-hover:-translate-y-1">
      <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
        <ChevronLeft className="h-4 w-4 text-ink-muted" />
        <span className="flex-1 text-center">Select your bank</span>
        <span className="w-4" />
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-[11.5px] text-ink-subtle">
        <Search className="h-3.5 w-3.5" />
        Search 12 institutions
      </div>
      <ul className="mt-3 space-y-1">
        {ART_BANKS.map((b, i) => (
          <li
            key={b}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] font-medium text-ink",
              i === 1 && "bg-lilac"
            )}
          >
            <BankLogo bankName={b} className="h-6 w-6 rounded-md" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The user's latest parsed transactions; neutral bars when there are none yet. */
export function StatementArt({ transactions }) {
  const rows = transactions.slice(0, 4);
  return (
    <div className="absolute bottom-0 right-6 top-8 w-[300px] rounded-t-[18px] border border-hairline bg-canvas p-4 shadow-raised transition-transform duration-500 group-hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-ink">Parsed transactions</span>
        <span className="rounded-full bg-positive-soft px-2 py-0.5 text-[10.5px] font-semibold text-positive">PDF</span>
      </div>
      <ul className="mt-3 divide-y divide-hairline">
        {rows.length > 0
          ? rows.map((t) => {
              const n = Number(t.amount);
              return (
                <li key={t.id ?? t._id} className="flex items-center gap-2.5 py-2">
                  <BankLogo bankName={t.account} className="h-6 w-6 rounded-md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium text-ink">{t.description}</span>
                    <span className="block text-[10.5px] text-ink-subtle">{t.category || "Uncategorised"}</span>
                  </span>
                  <span className={cn("text-[12px] font-semibold tabular-nums", n >= 0 ? "text-positive" : "text-ink")}>
                    {formatRs(n, { signed: true, compact: true })}
                  </span>
                </li>
              );
            })
          : Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2.5 py-2.5">
                <span className="h-6 w-6 rounded-md bg-sunken" />
                <span className="h-2.5 flex-1 rounded bg-sunken" />
                <span className="h-2.5 w-12 rounded bg-sunken" />
              </li>
            ))}
      </ul>
    </div>
  );
}

/** A real request against the external API. */
export function CodeArt({ baseUrl }) {
  return (
    <div className="absolute bottom-0 right-0 top-8 w-[330px] overflow-hidden rounded-tl-[18px] bg-ink shadow-raised transition-transform duration-500 group-hover:-translate-y-1">
      <div className="border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px] text-white/60">
        GET /transactions
      </div>
      <pre className="px-4 py-3 font-mono text-[11px] leading-[1.75] text-[#ece8f6]">
        <span className="text-[#c4b5fd]">curl</span> {baseUrl.replace(/^https?:\/\//, "")}
        {"\n"}  /transactions \{"\n"}
        {"  "}-H <span className="text-[#f9a8d4]">&quot;Authorization: Bearer \{"\n"}
        {"    "}setl_dev_••••&quot;</span>{"\n\n"}
        <span className="text-white/45">{"// 200 OK"}</span>{"\n"}
        {"{"} <span className="text-[#93c5fd]">&quot;transactions&quot;</span>: [{"\n"}
        {"  "}{"{"} <span className="text-[#93c5fd]">&quot;amount&quot;</span>: <span className="text-[#86efac]">-5000</span>,{"\n"}
        {"    "}<span className="text-[#93c5fd]">&quot;type&quot;</span>: <span className="text-[#f9a8d4]">&quot;debit&quot;</span> {"}"}
      </pre>
    </div>
  );
}
