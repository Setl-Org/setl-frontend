import { useEffect, useRef, useState } from "react";
import { Link, NavLink, matchPath, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Search,
  LogOut,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { displayName, fullName } from "@/lib/format";
import { NAV_MAIN, NAV_FOOTER } from "./navConfig";

const ROW =
  "group/row relative flex w-full items-center rounded-lg text-[14px] font-medium transition-colors duration-150 focus-ring";

function isItemActive(item, pathname) {
  if (!item.to) return false;
  return Boolean(matchPath({ path: item.to, end: item.end ?? false }, pathname));
}

function groupHasActive(group, pathname) {
  return group.children?.some((c) => isItemActive(c, pathname));
}

/** Tooltip shown beside icons when the rail is collapsed. */
function RailTip({ show, children }) {
  if (!show) return null;
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-medium text-white opacity-0 shadow-popover transition-opacity duration-150 group-hover/row:opacity-100 group-focus-visible/row:opacity-100"
    >
      {children}
    </span>
  );
}

function ItemLink({ item, collapsed, onNavigate, indent = false }) {
  const Icon = item.icon;
  const showIcon = !indent || collapsed;
  const pad = collapsed ? "h-10 justify-center px-0" : indent ? "h-9 pl-[46px] pr-3" : "h-10 gap-3 px-3";

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
        onClick={onNavigate}
        aria-label={collapsed ? item.label : undefined}
        className={cn(ROW, pad, "text-ink-muted hover:bg-sunken hover:text-ink")}
      >
        {showIcon && <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />}
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.external && (
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden />
        )}
        {item.external && <span className="sr-only"> (opens in a new tab)</span>}
        <RailTip show={collapsed}>{item.label}</RailTip>
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          ROW,
          pad,
          isActive
            ? "bg-lilac text-violet-ink"
            : indent
              ? "text-ink-muted hover:bg-sunken hover:text-ink"
              : "text-ink hover:bg-sunken"
        )
      }
    >
      {({ isActive }) => (
        <>
          {showIcon && (
            <Icon
              className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-violet" : "text-ink-muted group-hover/row:text-ink")}
              aria-hidden
            />
          )}
          {!collapsed && <span className="truncate">{item.label}</span>}
          <RailTip show={collapsed}>{item.label}</RailTip>
        </>
      )}
    </NavLink>
  );
}

function NavGroup({ group, open, onToggle, collapsed, onNavigate, pathname }) {
  const Icon = group.icon;
  const active = groupHasActive(group, pathname);
  const listId = `nav-group-${group.id}`;

  if (collapsed) {
    // Rail mode: the group icon jumps to its first destination.
    const first = group.children.find((c) => c.to);
    return (
      <Link
        to={first.to}
        onClick={onNavigate}
        aria-label={group.label}
        className={cn(
          ROW,
          "h-10 justify-center",
          active ? "bg-lilac text-violet" : "text-ink-muted hover:bg-sunken hover:text-ink"
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
        <RailTip show>{group.label}</RailTip>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(ROW, "h-10 gap-3 px-3 text-ink hover:bg-sunken")}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-violet" : "text-ink-muted")} aria-hidden />
        <span className="truncate">{group.label}</span>
        <ChevronDown
          className={cn("ml-auto h-4 w-4 text-ink-subtle transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div
        id={listId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        inert={open ? undefined : ""}
      >
        <ul className="flex min-h-0 flex-col gap-0.5 overflow-hidden pt-0.5">
          {group.children.map((child) => (
            <li key={child.id}>
              <ItemLink item={child} collapsed={false} onNavigate={onNavigate} indent />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkspaceMenu({ user, collapsed, onSignOut, onNavigate }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const name = displayName(user);
  const email = user?.email ?? "";

  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();
    function onDocClick(e) {
      if (!menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function onMenuKeyDown(e) {
    const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];
    const i = items.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[14px] text-ink transition-colors hover:bg-sunken focus:bg-sunken focus:outline-none";

  return (
    <div className="relative min-w-0 flex-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={collapsed ? "Workspace menu" : undefined}
        className={cn(
          "group/row relative flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-sunken focus-ring",
          collapsed && "justify-center"
        )}
      >
        <img src="/logo-mark.svg" alt="" className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[15px] font-semibold text-ink">Setl</span>
              <span className="block truncate text-[12px] text-ink-muted">{name}&apos;s workspace</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
          </>
        )}
        <RailTip show={collapsed}>Workspace</RailTip>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Workspace"
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute z-50 mt-1.5 w-64 rounded-xl border border-hairline bg-canvas p-1.5 shadow-popover motion-safe:animate-[dialog-rise_140ms_ease-out]",
            collapsed ? "left-full top-0 ml-2 mt-0" : "left-0 top-full"
          )}
        >
          <div className="flex items-center gap-2.5 px-2.5 pb-2.5 pt-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet text-[13px] font-semibold text-white">
              {name[0]?.toUpperCase() ?? "S"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold text-ink">{fullName(user)}</span>
              <span className="block truncate text-[12px] text-ink-muted">{email}</span>
            </span>
          </div>
          <div className="my-1 h-px bg-hairline" />
          <Link
            role="menuitem"
            to="/dashboard/settings"
            onClick={() => {
              close(false);
              onNavigate?.();
            }}
            className={itemClass}
          >
            <Settings className="h-4 w-4 text-ink-muted" aria-hidden />
            Settings
          </Link>
          <a role="menuitem" href="/#contact" className={itemClass} onClick={() => close(false)}>
            <HelpCircle className="h-4 w-4 text-ink-muted" aria-hidden />
            Get help
          </a>
          <div className="my-1 h-px bg-hairline" />
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              close(false);
              onSignOut();
            }}
            className={itemClass}
          >
            <LogOut className="h-4 w-4 text-ink-muted" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * AppSidebar - Plaid-shaped navigation rail. Desktop: sticky, collapsible to icons.
 * Mobile: slide-in drawer with a backdrop; Esc or a link closes it.
 */
export function AppSidebar({ user, collapsed, onToggleCollapsed, mobileOpen, onCloseMobile, onOpenCommand, onSignOut }) {
  const { pathname } = useLocation();
  const drawerRef = useRef(null);
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(NAV_MAIN.filter((g) => g.children).map((g) => [g.id, groupHasActive(g, pathname)]))
  );

  // Keep the group that holds the current page open as the route changes.
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const g of NAV_MAIN) {
        if (g.children && groupHasActive(g, pathname) && !prev[g.id]) {
          next[g.id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    drawerRef.current?.querySelector("a, button")?.focus();
    function onKey(e) {
      if (e.key === "Escape") onCloseMobile();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  // In the mobile drawer the rail is always expanded.
  const railCollapsed = collapsed && !mobileOpen;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgb(20_20_20/0.4)] backdrop-blur-[2px] motion-safe:animate-[dialog-fade_160ms_ease-out] lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        ref={drawerRef}
        aria-label="Sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-canvas transition-[transform,width] duration-200 ease-out",
          "border-r border-hairline lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-popover" : "-translate-x-full",
          railCollapsed ? "lg:w-[76px]" : "lg:w-[264px]"
        )}
      >
        {/* Workspace + search */}
        <div className={cn("flex items-center gap-1 px-3 pb-2 pt-3", railCollapsed && "flex-col")}>
          <WorkspaceMenu user={user} collapsed={railCollapsed} onSignOut={onSignOut} onNavigate={onCloseMobile} />
          <button
            type="button"
            onClick={onOpenCommand}
            aria-label="Search and jump to (Command K)"
            title="Search  ⌘K"
            className="group/row relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink focus-ring"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-sunken hover:text-ink focus-ring lg:hidden"
          >
            <X className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>

        {/* Primary nav */}
        <nav
          aria-label="Primary"
          className={cn("flex-1 px-3 py-2", railCollapsed ? "overflow-visible" : "overflow-y-auto")}
        >
          <ul className="flex flex-col gap-0.5">
            {NAV_MAIN.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <NavGroup
                    group={item}
                    open={Boolean(openGroups[item.id])}
                    onToggle={() => setOpenGroups((p) => ({ ...p, [item.id]: !p[item.id] }))}
                    collapsed={railCollapsed}
                    onNavigate={onCloseMobile}
                    pathname={pathname}
                  />
                ) : (
                  <ItemLink item={item} collapsed={railCollapsed} onNavigate={onCloseMobile} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-3">
          <div className="mx-1 mb-2 h-px bg-hairline" />
          <ul className="flex flex-col gap-0.5">
            {NAV_FOOTER.map((item) => (
              <li key={item.id}>
                <ItemLink item={item} collapsed={railCollapsed} onNavigate={onCloseMobile} />
              </li>
            ))}
            <li className="hidden lg:block">
              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!railCollapsed}
                className={cn(
                  ROW,
                  railCollapsed ? "h-10 justify-center" : "h-10 gap-3 px-3",
                  "text-ink-muted hover:bg-sunken hover:text-ink"
                )}
              >
                {railCollapsed ? (
                  <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
                ) : (
                  <ChevronLeft className="h-[18px] w-[18px]" aria-hidden />
                )}
                {!railCollapsed && <span>Collapse</span>}
                <RailTip show={railCollapsed}>Expand</RailTip>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
