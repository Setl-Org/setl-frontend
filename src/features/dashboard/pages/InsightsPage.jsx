import { ArrowDownLeft, ArrowUpRight, Scale, Receipt, Upload } from "lucide-react";
import { formatCount, formatRs } from "@/lib/format";
import { useApp } from "@/features/app-shell/useApp";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { KpiTile } from "@/components/app/KpiTile";
import { EmptyState } from "@/components/app/EmptyState";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";
import { MonthlyFlowChart, CreditDebitSplit, BalanceTrend } from "../insights/InsightCharts";

/** Insights - Plaid's Usage page for Setl: totals first, then the shape over time. */
export function InsightsPage() {
  const { summary, openUpload } = useApp();
  const d = summary.data;
  const s = d?.stats;
  const loading = summary.status === "loading";
  const net = Number(s?.netBalance ?? 0);

  // /dashboard/data returns credits and debits as its two "categories".
  const split = Object.fromEntries((d?.spendingByCategory ?? []).map((c) => [c.label, c.value]));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Insights"
        description="Where money moved across every account, from the statements you've uploaded."
        actions={
          <AppButton leadingIcon={Upload} onClick={openUpload}>
            Upload statement
          </AppButton>
        }
      />

      {summary.status === "error" ? (
        <div className="rounded-xl border border-hairline">
          <EmptyState
            tone="error"
            title="Couldn't load insights"
            description="The summary didn't come back from the server. Your data is unchanged."
            action={<AppButton size="sm" onClick={summary.refresh}>Try again</AppButton>}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              label="Money in"
              icon={ArrowDownLeft}
              loading={loading}
              value={formatRs(s?.credits ?? 0)}
              sub={`${formatCount(s?.creditCount ?? 0)} credits`}
            />
            <KpiTile
              label="Money out"
              icon={ArrowUpRight}
              loading={loading}
              value={formatRs(s?.debits ?? 0)}
              sub={`${formatCount(s?.debitCount ?? 0)} debits`}
            />
            <KpiTile
              label="Net flow"
              icon={Scale}
              loading={loading}
              value={formatRs(net, { signed: true })}
              tone={net > 0 ? "positive" : net < 0 ? "negative" : "ink"}
              sub="Money in minus money out"
            />
            <KpiTile
              label="Transactions"
              icon={Receipt}
              loading={loading}
              value={formatCount(s?.totalTransactions ?? 0)}
              sub={`From ${formatCount(s?.statementsUploaded ?? 0)} ${s?.statementsUploaded === 1 ? "statement" : "statements"}`}
            />
          </div>

          {loading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <SkeletonBlock className="h-[340px] rounded-xl lg:col-span-2" />
              <SkeletonBlock className="h-[340px] rounded-xl" />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MonthlyFlowChart data={d?.transactionsByMonth} />
              </div>
              <div className="space-y-4">
                <CreditDebitSplit credits={split.Credits ?? s?.credits ?? 0} debits={split.Debits ?? s?.debits ?? 0} />
                <BalanceTrend data={d?.balanceTrend} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
