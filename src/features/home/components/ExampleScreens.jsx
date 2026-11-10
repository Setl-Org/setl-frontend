import { cn } from "@/lib/cn";
import { SetlMark } from "./SetlMark";
import { InstitutionLogo } from "./InstitutionLogo";

/**
 * Example product screens for the public site. Every screen is labelled
 * "Example": the rows show the shape of the data, not a real customer.
 */

function Screen({ title, children }) {
  return (
    <div className="w-[min(340px,86%)] rounded-[20px] bg-white p-4 text-[#141414] shadow-[0_30px_60px_-28px_rgba(29,11,48,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{title}</span>
        <span className="rounded-full bg-[#F3EEF9] px-2 py-0.5 text-[10px] font-medium text-[#542774]">Example</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Line({ children }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#eceae4] py-2 text-[12.5px] first:border-t-0">{children}</div>
  );
}

function Status({ children, done }) {
  return (
    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium", done ? "bg-[#e6f5ed] text-[#0e7a4a]" : "bg-[#f6f5f2] text-[#5c5c66]")}>
      {children}
    </span>
  );
}

function Label({ main, sub, mono }) {
  return (
    <span className="min-w-0">
      <span className="block truncate font-medium">{main}</span>
      {sub && <span className={cn("block text-[11px] text-[#6b6b66]", mono && "font-mono")}>{sub}</span>}
    </span>
  );
}

function Bars({ values, tone = "#542774" }) {
  return (
    <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
      {values.map((h, i) => (
        <span key={i} className="flex-1 rounded-t-[4px]" style={{ height: `${h}%`, background: tone, opacity: 0.35 + i * (0.65 / values.length) }} />
      ))}
    </div>
  );
}

const SCREENS = {
  lending: () => (
    <Screen title="Cash flow · 6 months">
      <Bars values={[38, 52, 44, 70, 58, 82]} />
      <div className="mt-3">
        <Line>
          <Label main="Salary · HBL" sub="02 Mar" />
          <span className="font-semibold tabular-nums text-[#0e7a4a]">+185,000</span>
        </Line>
        <Line>
          <Label main="Rent · Meezan" sub="28 Feb" />
          <span className="font-semibold tabular-nums">−95,000</span>
        </Line>
      </div>
    </Screen>
  ),
  pfm: () => (
    <Screen title="Balances">
      {[
        ["HBL", "HBL current", "PKR 240,500"],
        ["JazzCash", "JazzCash wallet", "PKR 12,400"],
        ["Meezan Bank", "Meezan savings", "PKR 88,150"],
      ].map(([bank, label, amt]) => (
        <Line key={label}>
          <span className="flex min-w-0 items-center gap-2.5">
            <InstitutionLogo bankName={bank} className="h-6 w-6 rounded-md" />
            <span className="truncate font-medium">{label}</span>
          </span>
          <span className="font-semibold tabular-nums">{amt}</span>
        </Line>
      ))}
    </Screen>
  ),
  accounting: () => (
    <Screen title="Invoices">
      {[
        ["UBL · Invoice 1041", "PKR 64,000", true],
        ["MCB · Supplier", "PKR 18,250", false],
        ["HBL · Invoice 1038", "PKR 41,700", true],
      ].map(([label, amt, done]) => (
        <Line key={label}>
          <Label main={label} sub={amt} />
          <Status done={done}>{done ? "matched" : "open"}</Status>
        </Line>
      ))}
    </Screen>
  ),
  wealth: () => (
    <Screen title="Net position · 6 months">
      <Bars values={[46, 50, 55, 53, 64, 72]} tone="#6d28d9" />
      <div className="mt-3">
        <Line>
          <Label main="Across 3 accounts" sub="HBL, Meezan, JazzCash" />
          <span className="font-semibold tabular-nums">PKR 341,050</span>
        </Line>
      </div>
    </Screen>
  ),
  expense: () => (
    <Screen title="Company spend">
      {[
        ["Fuel · Askari Bank", "Travel", "PKR 9,400", true],
        ["Software · UBL", "Tools", "PKR 26,000", true],
        ["Dinner · MCB", "Meals", "PKR 31,800", false],
      ].map(([label, cat, amt, ok]) => (
        <Line key={label}>
          <Label main={label} sub={`${cat} · ${amt}`} />
          <Status done={ok}>{ok ? "in policy" : "review"}</Status>
        </Line>
      ))}
    </Screen>
  ),
  payments: () => (
    <Screen title="Collections">
      {[
        ["Raast", "E2E 9F3A", true],
        ["1Link", "RRN 4412", false],
        ["Raast", "E2E 7C21", true],
      ].map(([rail, ref, done]) => (
        <Line key={ref}>
          <Label main={rail} sub={ref} mono />
          <Status done={done}>{done ? "settled" : "pending"}</Status>
        </Line>
      ))}
    </Screen>
  ),
  accounts: () => (
    <Screen title="GET /accounts">
      {[
        ["Meezan Bank", "Salary account", "current · 2324"],
        ["Meezan Bank", "Savings", "savings · 7710"],
        ["JazzCash", "Mobile wallet", "wallet · 8830"],
      ].map(([bank, name, meta]) => (
        <Line key={meta}>
          <span className="flex min-w-0 items-center gap-2.5">
            <InstitutionLogo bankName={bank} className="h-6 w-6 rounded-md" />
            <Label main={name} sub={`${bank} · ${meta}`} />
          </span>
          <Status done>active</Status>
        </Line>
      ))}
    </Screen>
  ),
  transactions: () => (
    <Screen title="GET /transactions">
      {[
        ["Salary", "HBL · credit", "+185,000", true],
        ["K-Electric bill", "Meezan · debit", "−4,200", false],
        ["Raast in · E2E 9F3A", "UBL · credit", "+25,000", true],
      ].map(([desc, meta, amt, credit]) => (
        <Line key={desc}>
          <Label main={desc} sub={meta} />
          <span className={cn("font-semibold tabular-nums", credit && "text-[#0e7a4a]")}>{amt}</span>
        </Line>
      ))}
    </Screen>
  ),
};

/** ScreenTile - A colour field from the mark's family with one example screen floating on it. */
export function ScreenTile({ kind, field, className }) {
  const Render = SCREENS[kind];
  return (
    <div className={cn("relative flex h-[300px] items-center justify-center overflow-hidden rounded-[28px] sm:h-[340px]", className)} style={{ background: field }}>
      <SetlMark
        strokeWidth={1.2}
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-white/[0.13] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[8deg]"
      />
      {Render && <Render />}
    </div>
  );
}
