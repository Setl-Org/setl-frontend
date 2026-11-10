import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, FileText, Building2, FileUp, Receipt, Scale, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { formatCount, formatDate, formatRs, displayName } from "@/lib/format";
import { useApp } from "@/features/app-shell/useApp";
import { SectionTitle } from "@/components/app/Card";
import { KpiTile } from "@/components/app/KpiTile";
import { DataTable } from "@/components/app/DataTable";
import { EmptyState } from "@/components/app/EmptyState";
import { AppButton } from "@/components/app/AppButton";
import { EXTERNAL_API_BASE } from "@/features/developer/constants";
import { SetupHero } from "../home/SetupHero";
import { ExploreCard, ConnectSheetArt, StatementArt, CodeArt } from "../home/ExploreCards";
import { GettingStarted } from "../home/GettingStarted";
import { TxDescription, TxAmount, TxDate, TxAccount } from "../components/TxCells";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Home - Plaid's Overview for Setl: setup progress, explore, getting started, then today's numbers. */
export function DashboardHomePage() {
  const navigate = useNavigate();
  const { user, accounts, summary, dataVersion, openAddAccount, openUpload, openCommand } = useApp();
  const isDeveloper = Boolean(user?.isDeveloper);

  const [recent, setRecent] = useState({ status: "loading", items: [] });
  const [dev, setDev] = useState({ status: "loading", apiKey: null, apps: [] });

  useEffect(() => {
    document.title = "Home · Setl";
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/transactions", { params: { page: 1, limit: 5 } })
      .then((res) => !cancelled && setRecent({ status: "ready", items: res.data.data?.transactions ?? [] }))
      .catch(() => !cancelled && setRecent({ status: "error", items: [] }));
    return () => {
      cancelled = true;
    };
  }, [dataVersion]);

  useEffect(() => {
    if (!isDeveloper) return undefined;
    let cancelled = false;
    Promise.all([api.get("/apikeys"), api.get("/oauth/clients/mine")])
      .then(([k, a]) => {
        if (cancelled) return;
        setDev({ status: "ready", apiKey: k.data.data ?? null, apps: a.data.data ?? [] });
      })
      .catch(() => !cancelled && setDev((d) => ({ ...d, status: "error" })));
    return () => {
      cancelled = true;
    };
  }, [isDeveloper]);

  const stats = summary.data?.stats;
  const accountList = accounts.items;
  const loadingCore = accounts.status === "loading" || summary.status === "loading";
  const devLoading = isDeveloper && dev.status === "loading";

  const steps = useMemo(
    () => [
      { id: "account", label: "Add an account", done: accountList.length > 0, action: openAddAccount },
      { id: "statement", label: "Upload a statement", done: (stats?.statementsUploaded ?? 0) > 0, action: openUpload },
      { id: "developer", label: "Turn on developer mode", done: isDeveloper, action: () => navigate("/developer") },
      {
        id: "credentials",
        label: "Create API credentials",
        done: Boolean(dev.apiKey?.apiKey) || dev.apps.length > 0,
        action: () => navigate(isDeveloper && (dev.apiKey?.apiKey || dev.apps.length) ? "/developer/api" : "/developer"),
      },
    ],
    [accountList.length, stats?.statementsUploaded, isDeveloper, dev.apiKey, dev.apps.length, openAddAccount, openUpload, navigate]
  );

  const bankCount = new Set(accountList.map((a) => a.bankName).filter(Boolean)).size;
  const lastImport = accountList
    .map((a) => a.lastStatementImport?.importedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const net = Number(stats?.netBalance ?? 0);

  const recentColumns = [
    { id: "date", header: "Date", cell: (r) => <TxDate value={r.date} /> },
    { id: "description", header: "Description", cell: (r) => <TxDescription row={r} /> },
    { id: "account", header: "Account", cell: (r) => <TxAccount bankName={r.account} />, className: "hidden md:table-cell" },
    { id: "amount", header: "Amount", align: "right", cell: (r) => <TxAmount value={r.amount} /> },
  ];

  return (
    <div>
      <p className="mb-4 text-[15px] font-medium text-ink-muted">
        {greeting()}, {displayName(user)}
      </p>
      <h1 className="sr-only">Home</h1>

      <SetupHero steps={steps} loading={loadingCore || devLoading} />

      <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="explore-title">
          <SectionTitle id="explore-title">Explore</SectionTitle>
          <div className="space-y-5">
            <ExploreCard
              title="Accounts"
              description="Add bank and wallet accounts from 12 Pakistani institutions, then see them in one place."
              actionLabel="Add account"
              actionIcon={Plus}
              onAction={openAddAccount}
              art={<ConnectSheetArt />}
            />
            <ExploreCard
              title="Statements"
              description="Upload a PDF statement. Setl reads every line and categorises each transaction."
              actionLabel="Upload statement"
              actionIcon={Upload}
              onAction={openUpload}
              art={<StatementArt transactions={recent.items} />}
            />
            <ExploreCard
              title="Developer API"
              description="Pull accounts and transactions into your product with OAuth, or into a script with a personal key."
              actionLabel="API reference"
              actionIcon={FileText}
              actionTo="/developer/api"
              art={<CodeArt baseUrl={EXTERNAL_API_BASE} />}
            />
          </div>
        </section>

        <GettingStarted
          isDeveloper={isDeveloper}
          devStatus={dev.status}
          apiKey={dev.apiKey}
          apps={dev.apps}
          onAddAccount={openAddAccount}
          onUpload={openUpload}
          onOpenCommand={openCommand}
        />
      </div>

      <section aria-labelledby="glance-title" className="mt-14">
        <SectionTitle id="glance-title">At a glance</SectionTitle>
        {summary.status === "error" ? (
          <div className="rounded-xl border border-hairline">
            <EmptyState
              tone="error"
              compact
              title="Couldn't load your numbers"
              description="The summary didn't come back from the server."
              action={<AppButton size="sm" onClick={summary.refresh}>Try again</AppButton>}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              label="Connected accounts"
              icon={Building2}
              loading={accounts.status === "loading"}
              value={formatCount(accountList.length)}
              sub={`Across ${bankCount} ${bankCount === 1 ? "bank" : "banks"}`}
            />
            <KpiTile
              label="Statements uploaded"
              icon={FileUp}
              loading={summary.status === "loading"}
              value={formatCount(stats?.statementsUploaded ?? 0)}
              sub={lastImport ? `Last on ${formatDate(lastImport)}` : "None yet"}
            />
            <KpiTile
              label="Transactions parsed"
              icon={Receipt}
              loading={summary.status === "loading"}
              value={formatCount(stats?.totalTransactions ?? 0)}
              sub={`${formatCount(stats?.creditCount ?? 0)} credits, ${formatCount(stats?.debitCount ?? 0)} debits`}
            />
            <KpiTile
              label="Net flow"
              icon={Scale}
              loading={summary.status === "loading"}
              value={formatRs(net, { signed: true })}
              tone={net > 0 ? "positive" : net < 0 ? "negative" : "ink"}
              sub="Credits minus debits"
            />
          </div>
        )}
      </section>

      <section aria-labelledby="recent-title" className="mt-14">
        <SectionTitle
          id="recent-title"
          action={
            <AppButton to="/dashboard/transactions" variant="ghost" size="sm" trailingIcon={ArrowRight}>
              View all
            </AppButton>
          }
        >
          Recent transactions
        </SectionTitle>
        <DataTable
          caption="Recent transactions"
          columns={recentColumns}
          rows={recent.items}
          rowKey={(r) => r.id ?? r._id}
          loading={recent.status === "loading"}
          minWidth={520}
          empty={
            recent.status === "error" ? (
              <EmptyState tone="error" compact title="Couldn't load transactions" description="Refresh the page to try again." />
            ) : (
              <EmptyState
                icon={Receipt}
                compact
                title="No transactions yet"
                description="Upload a statement and its transactions show up here."
                action={<AppButton size="sm" variant="primary" leadingIcon={Upload} onClick={openUpload}>Upload statement</AppButton>}
              />
            )
          }
        />
      </section>
    </div>
  );
}
