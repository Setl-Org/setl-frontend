import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  Home,
  Bell,
  Zap,
  Building2,
  Receipt,
  Scale,
  LayoutGrid,
  Code2,
  Activity,
  HelpCircle,
  Settings,
  ChevronsUpDown,
  ChevronRight,
  Search,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * DashboardNav — Plaid-style left navigation rail.
 *
 * Collapsible on desktop (icon-only rail) and rendered as a slide-in drawer on
 * mobile. Items that map to a real route use NavLink; the rest are placeholders
 * that surface a "coming soon" toast so nothing in the rail is a dead end.
 */

// `to` → real route (NavLink). `hash` → scrolls to a section on /dashboard.
// Neither → not built yet (toast).
const MAIN = [
  { label: "Home", Icon: Home, to: "/dashboard", end: true },
  { label: "Notifications", Icon: Bell },
  { label: "Get production access", Icon: Zap, highlight: true },
];

const PRODUCTS = [
  { label: "Accounts", Icon: Building2, hash: "#accounts", expandable: true },
  { label: "Transactions", Icon: Receipt, hash: "#transactions", expandable: true },
  { label: "Reconciliation", Icon: Scale, expandable: true },
  { label: "All products", Icon: LayoutGrid },
];

const PLATFORM = [
  { label: "Developers", Icon: Code2, to: "/developer", expandable: true },
  { label: "Activity", Icon: Activity, expandable: true },
  { label: "Get Help", Icon: HelpCircle },
  { label: "Settings", Icon: Settings, expandable: true },
];

function comingSoon(label) {
  toast.info(`${label} is coming soon`);
}

function NavItem({ item, collapsed, onNavigate }) {
  const { label, Icon, to, hash, end, expandable, highlight } = item;

  const base = cn(
    "group relative flex items-center rounded-lg text-sm transition-colors",
    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
  );

  const content = (
    <>
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          highlight ? "text-tertiary" : "text-muted-foreground group-[.is-active]:text-tertiary"
        )}
      />
      {!collapsed && (
        <>
          <span className="truncate">{label}</span>
          {expandable && (
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/40" />
          )}
        </>
      )}
    </>
  );

  // Real route
  if (to) {
    return (
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          cn(
            base,
            "font-medium",
            isActive
              ? "is-active bg-tertiary/10 text-tertiary"
              : "text-secondary hover:bg-muted/60"
          )
        }
      >
        {content}
      </NavLink>
    );
  }

  // Anchor within the dashboard
  if (hash) {
    return (
      <a
        href={hash}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={cn(base, "font-medium text-secondary hover:bg-muted/60")}
      >
        {content}
      </a>
    );
  }

  // Placeholder
  return (
    <button
      type="button"
      onClick={() => {
        comingSoon(label);
        onNavigate?.();
      }}
      title={collapsed ? label : undefined}
      className={cn(
        base,
        "w-full font-medium",
        highlight ? "text-tertiary hover:bg-tertiary/10" : "text-secondary hover:bg-muted/60"
      )}
    >
      {content}
    </button>
  );
}

function SectionLabel({ children, collapsed }) {
  if (collapsed) return <div className="my-2 h-px bg-border/70" />;
  return (
    <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
      {children}
    </p>
  );
}

export function DashboardNav({ user, onLogout, mobileOpen = false, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const email = user?.email ?? user?.profile?.email ?? "Demo user";
  const name =
    user?.profile?.firstName ||
    user?.name ||
    email.split("@")[0] ||
    "Demo user";
  const initial = name[0]?.toUpperCase() ?? "U";

  // On mobile the drawer is always full width regardless of the collapsed flag.
  const isCollapsed = collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "z-40 flex shrink-0 flex-col border-r border-border/70 bg-white",
          // Desktop: sticky full-height rail
          "lg:sticky lg:top-0 lg:h-screen",
          isCollapsed ? "lg:w-[68px]" : "lg:w-[248px]",
          // Mobile: slide-in drawer
          "fixed inset-y-0 left-0 w-[248px] transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Workspace switcher */}
        <div className="flex items-center gap-2 border-b border-border/60 p-3">
          <Link
            to="/"
            onClick={onCloseMobile}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-muted/60",
              isCollapsed && "justify-center"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-tertiary to-tertiary/70 text-sm font-bold text-white">
              {initial}
            </span>
            {!isCollapsed && (
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm font-semibold text-secondary">
                  {name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  Setl workspace
                </span>
              </span>
            )}
            {!isCollapsed && (
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-secondary lg:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-secondary lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search dashboard"
                className="w-full rounded-lg border border-border bg-muted/40 py-2 pl-9 pr-9 text-sm text-secondary placeholder:text-muted-foreground/70 focus:border-tertiary/50 focus:outline-none focus:ring-2 focus:ring-tertiary/20"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70">
                /
              </kbd>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <div className="flex flex-col gap-0.5">
            {MAIN.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                collapsed={isCollapsed}
                onNavigate={onCloseMobile}
              />
            ))}
          </div>

          <SectionLabel collapsed={isCollapsed}>Products</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {PRODUCTS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                collapsed={isCollapsed}
                onNavigate={onCloseMobile}
              />
            ))}
          </div>

          <SectionLabel collapsed={isCollapsed}>Platform</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {PLATFORM.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                collapsed={isCollapsed}
                onNavigate={onCloseMobile}
              />
            ))}
          </div>
        </nav>

        {/* User account */}
        <div className="relative border-t border-border/60 p-3">
          {userMenuOpen && (
            <>
              {/* Click-outside catcher */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                className={cn(
                  "absolute z-20 overflow-hidden rounded-lg border border-border bg-white shadow-lg",
                  isCollapsed
                    ? "bottom-3 left-full ml-2 w-44"
                    : "bottom-[64px] left-3 right-3"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-secondary hover:bg-muted/60"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  Sign out
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            title={isCollapsed ? name : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-muted/60",
              isCollapsed && "justify-center"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
              {initial}
            </span>
            {!isCollapsed && (
              <>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium text-secondary">
                    {name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {email}
                  </span>
                </span>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
