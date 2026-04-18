import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LogOut, Key } from "lucide-react";
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

  // Dashboard stats + charts
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [statementsCount, setStatementsCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState("");
  const [transactionsByMonth, setTransactionsByMonth] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [balanceTrend, setBalanceTrend] = useState([]);

  // Accounts
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  // Transactions (server-side paginated)
  const [txLoading, setTxLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txTotalItems, setTxTotalItems] = useState(0);

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

  const fetchTransactions = useCallback((page) => {
    setTxLoading(true);
    api
      .get("/transactions", { params: { page, limit: TX_PAGE_SIZE } })
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

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleUploaded = () => {
    setStatementsCount((c) => c + 1);
    fetchTransactions(1);
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border/80 bg-primary/98 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Setl" className="h-8 w-auto sm:h-9" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setApiKeyOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-secondary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
              aria-label="API key"
            >
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API key</span>
            </button>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.email ?? user?.profile?.email ?? "Demo user"}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-secondary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <h1 className="section-title mb-6">Dashboard</h1>

        <section className="mb-8">
          <Skeleton name="accounts-section" loading={accountsLoading}>
            <AccountsSection
              accounts={accounts}
              isLoading={accountsLoading}
              onAddAccount={() => setAddAccountOpen(true)}
              onUploadStatements={() => setUploadOpen(true)}
            />
          </Skeleton>
        </section>

        <section>
          <Skeleton name="stat-cards" loading={dashboardLoading}>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {statCardsWithDynamic.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          </Skeleton>
        </section>

        <section className="mt-8">
          <Skeleton name="charts" loading={dashboardLoading}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ChartTransactionsByMonth data={transactionsByMonth} />
              <ChartSpendingByCategory data={spendingByCategory} />
              <ChartBalanceTrend data={balanceTrend} />
            </div>
          </Skeleton>
        </section>

        <section className="mt-8">
          <Skeleton name="transactions-table" loading={txLoading && transactions.length === 0}>
            <TransactionsTable
              transactions={transactions}
              isLoading={txLoading}
              page={txPage}
              totalPages={txTotalPages}
              totalItems={txTotalItems}
              pageSize={TX_PAGE_SIZE}
              onPageChange={fetchTransactions}
            />
          </Skeleton>
        </section>
      </main>

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
