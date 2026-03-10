import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Key } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
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
import {
  STAT_CARDS,
  INITIAL_ACCOUNTS,
  TRANSACTIONS_BY_MONTH,
  SPENDING_BY_CATEGORY,
  BALANCE_TREND,
  PARSED_TRANSACTIONS,
} from "./constants";

/**
 * DashboardPage - Post-login dashboard: accounts, stat cards, charts, parsed transactions table.
 */
export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [statementsCount, setStatementsCount] = useState(12);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleUploaded = () => {
    setStatementsCount((c) => c + 1);
  };

  const statCardsWithDynamic = [
    { ...STAT_CARDS[0], value: String(statementsCount) },
    STAT_CARDS[1],
    { ...STAT_CARDS[2], value: String(accounts.length), sub: `Across ${new Set(accounts.map((a) => a.bank)).size} bank(s)` },
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
              {user?.email ?? "Demo user"}
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
          <AccountsSection
            accounts={accounts}
            onAddAccount={() => setAddAccountOpen(true)}
            onUploadStatements={() => setUploadOpen(true)}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {statCardsWithDynamic.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ChartTransactionsByMonth data={TRANSACTIONS_BY_MONTH} />
          <ChartSpendingByCategory data={SPENDING_BY_CATEGORY} />
          <ChartBalanceTrend data={BALANCE_TREND} />
        </section>

        <section className="mt-8">
          <TransactionsTable transactions={PARSED_TRANSACTIONS} />
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
