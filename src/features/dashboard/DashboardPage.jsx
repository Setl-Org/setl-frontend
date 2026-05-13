import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LogOut, Key, LayoutDashboard } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import {
  StatCard,
  ChartTransactionsByMonth,
  ChartSpendingByCategory,
  ChartBalanceTrend,
  TransactionsTable,
  AccountsSection,
  AddAccountModal,
  UploadStatementsModal,
  ApiKeyModal,
  DashboardSidebar,
} from "./components";
import { STAT_CARDS } from "./constants";

const CATEGORY_COLORS = [
  "bg-tertiary",
  "bg-tertiary/80",
  "bg-tertiary/60",
  "bg-tertiary/50",
  "bg-muted-foreground/40",
];

const TX_PAGE_SIZE = 5;

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [statementsCount, setStatementsCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState("");
  const [transactionsByMonth, setTransactionsByMonth] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [balanceTrend, setBalanceTrend] = useState([]);

  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  const [txLoading, setTxLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txTotalItems, setTxTotalItems] = useState(0);
  const [txBankFilter, setTxBankFilter] = useState(null);

  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard/data")
      .then((res) => {
        const d = res.data.data;
        setStatementsCount(d.stats?.statementsUploaded ?? 0);
        setTotalTransactions(
          d.stats?.totalTransactions != null
            ? d.stats.totalTransactions.toLocaleString()
            : String(d.stats?.creditCount + d.stats?.debitCount || "")
        );
        setTransactionsByMonth(d.transactionsByMonth ?? []);
        setSpendingByCategory(
          (d.spendingByCategory ?? []).map((c, i) => ({
            ...c,
            color: CATEGORY_COLORS[i] ?? "bg-muted-foreground/40",
          }))
        );
        setBalanceTrend(d.balanceTrend ?? []);
      })
      .catch(() => {})
      .finally(() => setDashboardLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/accounts", { params: { page: 1, limit: 100 } })
      .then((res) => setAccounts(res.data.data?.accounts ?? []))
      .catch(() => {})
      .finally(() => setAccountsLoading(false));
  }, []);

  const fetchTransactions = useCallback((page, bankFilter = null) => {
    setTxLoading(true);
    const params = { page, limit: TX_PAGE_SIZE };
    if (bankFilter) params.bankName = bankFilter;
    api
      .get("/transactions", { params })
      .then((res) => {
        setTransactions(res.data.data?.transactions ?? []);
        setTxPage(res.data.pagination?.currentPage ?? page);
        setTxTotalPages(res.data.pagination?.totalPages ?? 1);
        setTxTotalItems(res.data.pagination?.totalItems ?? 0);
      })
      .catch(() => {})
      .finally(() => setTxLoading(false));
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleBankChange = (bank) => {
    setTxBankFilter(bank);
    fetchTransactions(1, bank);
  };

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleUploaded = () => {
    setStatementsCount((c) => c + 1);
    fetchTransactions(1, txBankFilter);
  };

  const statCardsWithDynamic = [
    { ...STAT_CARDS[0], value: String(statementsCount) },
    { ...STAT_CARDS[1], value: totalTransactions },
    {
      ...STAT_CARDS[2],
      value: String(accounts.length),
      sub: `Across ${new Set(accounts.map((a) => a.bankName)).size} bank(s)`,
    },
  ];

  const userEmail = user?.email ?? user?.profile?.email ?? "Demo user";
  const userInitial = userEmail[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 rounded-lg">
              <img src="/logo.png" alt="Setl" className="h-8 w-auto" />
            </Link>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <div className="hidden items-center gap-1.5 sm:flex">
              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setApiKeyOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm font-medium text-secondary shadow-sm transition-all hover:bg-muted/60 hover:shadow focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
              aria-label="API key"
            >
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">API key</span>
            </button>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary/10 text-xs font-bold text-tertiary">
                {userInitial}
              </div>
              <span className="max-w-[160px] truncate text-sm text-muted-foreground">
                {userEmail}
              </span>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm font-medium text-secondary shadow-sm transition-all hover:bg-muted/60 hover:shadow focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-7 xl:grid-cols-[1fr_320px]">

          {/* ── Main content column ── */}
          <div className="min-w-0 flex flex-col gap-6">
            {/* Page heading */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Overview of your accounts and transactions
              </p>
            </div>

            {/* Accounts */}
            <section>
              <Skeleton name="accounts-section" loading={accountsLoading}>
                <AccountsSection
                  accounts={accounts}
                  isLoading={accountsLoading}
                  onAddAccount={() => setAddAccountOpen(true)}
                  onUploadStatements={() => setUploadOpen(true)}
                />
              </Skeleton>
            </section>

            {/* Stat cards */}
            <section>
              <Skeleton name="stat-cards" loading={dashboardLoading}>
                <div className="grid gap-4 sm:grid-cols-3">
                  {statCardsWithDynamic.map((card) => (
                    <StatCard key={card.label} {...card} />
                  ))}
                </div>
              </Skeleton>
            </section>

            {/* Charts */}
            <section>
              <Skeleton name="charts" loading={dashboardLoading}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ChartTransactionsByMonth data={transactionsByMonth} />
                  <ChartSpendingByCategory data={spendingByCategory} />
                  <ChartBalanceTrend data={balanceTrend} />
                </div>
              </Skeleton>
            </section>

            {/* Transactions table */}
            <section>
              <Skeleton name="transactions-table" loading={txLoading && transactions.length === 0}>
                <TransactionsTable
                  transactions={transactions}
                  accounts={accounts}
                  activeBank={txBankFilter}
                  onBankChange={handleBankChange}
                  isLoading={txLoading}
                  page={txPage}
                  totalPages={txTotalPages}
                  totalItems={txTotalItems}
                  pageSize={TX_PAGE_SIZE}
                  onPageChange={(page) => fetchTransactions(page, txBankFilter)}
                />
              </Skeleton>
            </section>
          </div>

          {/* ── Right sidebar ── */}
          <div className="lg:sticky lg:top-[57px] lg:self-start lg:max-h-[calc(100vh-73px)] lg:overflow-y-auto lg:pb-8">
            <DashboardSidebar
              onAddAccount={() => setAddAccountOpen(true)}
              onUploadStatements={() => setUploadOpen(true)}
              onApiKey={() => setApiKeyOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAccountModal
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        onAdded={handleAddAccount}
      />
      <UploadStatementsModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        accounts={accounts}
        onUploaded={handleUploaded}
      />
      <ApiKeyModal open={apiKeyOpen} onOpenChange={setApiKeyOpen} />
    </div>
  );
}
