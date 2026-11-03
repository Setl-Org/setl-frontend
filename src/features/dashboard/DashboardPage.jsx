import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
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
  DashboardNav,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const fetchDashboardData = useCallback(() => {
    return api
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

  const fetchAccounts = useCallback(() => {
    return api
      .get("/accounts", { params: { page: 1, limit: 100 } })
      .then((res) => setAccounts(res.data.data?.accounts ?? []))
      .catch(() => {})
      .finally(() => setAccountsLoading(false));
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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
    // Processing runs synchronously on the PDF service, so by the time the
    // upload resolves the new transactions are already persisted. Refresh
    // every data source so stats, charts, accounts and the table reflect them.
    fetchDashboardData();
    fetchAccounts();
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
  const userName =
    user?.profile?.firstName || user?.name || userEmail.split("@")[0] || "there";

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      {/* ── Left navigation rail ── */}
      <DashboardNav
        user={user}
        onLogout={() => logout()}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (nav lives in a drawer on small screens) */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-md p-1.5 text-secondary hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-tertiary"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Setl" className="h-7 w-auto" />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1100px] flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {/* Welcome heading */}
          <div>
            <h1
              className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Hi, {userName}! Welcome to Setl
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of your accounts and transactions
            </p>
          </div>

          {/* Accounts */}
          <section id="accounts" className="scroll-mt-20">
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
          <section id="transactions" className="scroll-mt-20">
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
        </main>
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
    </div>
  );
}
