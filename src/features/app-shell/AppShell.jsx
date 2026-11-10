import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { AddAccountModal } from "@/features/dashboard/components/AddAccountModal";
import { UploadStatementsModal } from "@/features/dashboard/components/UploadStatementsModal";
import { AppSidebar } from "./AppSidebar";
import { CommandMenu } from "./CommandMenu";
import { PageErrorBoundary } from "./PageErrorBoundary";
import { SIDEBAR_COLLAPSED_KEY } from "./navConfig";

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

/**
 * AppShell - Layout route for every signed-in page. Owns the sidebar, the command
 * menu, the add-account and upload dialogs, and the two data sources most pages
 * share (accounts and the dashboard summary). Pages read them with useApp().
 */
export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [accountsStatus, setAccountsStatus] = useState("loading");
  const [summary, setSummary] = useState(null);
  const [summaryStatus, setSummaryStatus] = useState("loading");
  // Bumped after an upload so pages with their own fetches (transactions) reload too.
  const [dataVersion, setDataVersion] = useState(0);

  const refreshAccounts = useCallback(() => {
    setAccountsStatus((s) => (s === "ready" ? "ready" : "loading"));
    return api
      .get("/accounts", { params: { page: 1, limit: 100 } })
      .then((res) => {
        setAccounts(res.data.data?.accounts ?? []);
        setAccountsStatus("ready");
      })
      .catch(() => setAccountsStatus("error"));
  }, []);

  const refreshSummary = useCallback(() => {
    setSummaryStatus((s) => (s === "ready" ? "ready" : "loading"));
    return api
      .get("/dashboard/data")
      .then((res) => {
        setSummary(res.data.data ?? null);
        setSummaryStatus("ready");
      })
      .catch(() => setSummaryStatus("error"));
  }, []);

  useEffect(() => {
    refreshAccounts();
    refreshSummary();
  }, [refreshAccounts, refreshSummary]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // storage unavailable (private mode): the preference just won't persist
    }
  }, [collapsed]);

  // New page: start at the top and move focus to the content so screen readers
  // announce it. Skipped on first load so the browser's own focus wins.
  useEffect(() => {
    setMobileOpen(false);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Cmd/Ctrl+K anywhere, or "/" when not typing, opens the command menu.
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      } else if (e.key === "/" && !isTypingTarget(document.activeElement) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openAddAccount = useCallback(() => setAddOpen(true), []);
  const openUpload = useCallback(() => setUploadOpen(true), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const signOut = useCallback(() => logout(), [logout]);

  function handleAccountAdded(account) {
    setAccounts((prev) => [...prev, account]);
    refreshSummary();
  }

  function handleUploaded() {
    // Processing runs on the PDF service before the upload resolves, so refresh
    // everything that shows parsed data.
    refreshSummary();
    refreshAccounts();
    setDataVersion((v) => v + 1);
  }

  const context = useMemo(
    () => ({
      user,
      accounts: { items: accounts, status: accountsStatus, refresh: refreshAccounts },
      summary: { data: summary, status: summaryStatus, refresh: refreshSummary },
      dataVersion,
      openAddAccount,
      openUpload,
      openCommand,
      signOut,
    }),
    [user, accounts, accountsStatus, refreshAccounts, summary, summaryStatus, refreshSummary, dataVersion, openAddAccount, openUpload, openCommand, signOut]
  );

  return (
    <div className="app-shell flex min-h-screen">
      <a
        href="#main"
        className="sr-only z-[70] rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <AppSidebar
        user={user}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        onOpenCommand={openCommand}
        onSignOut={signOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-hairline bg-canvas/90 px-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-sunken focus-ring"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 rounded-lg px-1 focus-ring" aria-label="Setl home">
            <img src="/logo-mark.svg" alt="" className="h-7 w-7" />
            <span className="text-[15px] font-semibold text-ink">Setl</span>
          </Link>
          <button
            type="button"
            onClick={openCommand}
            aria-label="Search"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:bg-sunken hover:text-ink focus-ring"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 outline-none"
        >
          <div
            key={pathname}
            className="mx-auto w-full max-w-[1160px] px-4 pb-16 pt-6 motion-safe:animate-[page-enter_220ms_ease-out] sm:px-8 sm:pt-10 lg:px-12 lg:pt-14"
          >
            <PageErrorBoundary key={pathname}>
              <Outlet context={context} />
            </PageErrorBoundary>
          </div>
        </main>
      </div>

      <CommandMenu
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onAddAccount={openAddAccount}
        onUpload={openUpload}
        onSignOut={signOut}
      />
      <AddAccountModal open={addOpen} onOpenChange={setAddOpen} onAdded={handleAccountAdded} />
      <UploadStatementsModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        accounts={accounts}
        onUploaded={handleUploaded}
      />
    </div>
  );
}
