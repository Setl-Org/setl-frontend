import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/authStore";
import { USE_CASES } from "@/features/usecases/constants";

const PRODUCTS = [
  {
    href: "/products#connect",
    title: "Connect",
    summary: "A consent screen. The customer signs in on Setl and approves what your app can read.",
  },
  {
    href: "/products#accounts",
    title: "Accounts",
    summary: "The accounts they select, in one list.",
  },
  {
    href: "/products#transactions",
    title: "Transactions",
    summary: "A normalized feed your product can read.",
  },
];

const DEVELOPER_LINKS = [
  { href: "/developers", title: "Documentation", summary: "How a Setl connection works." },
  { href: "/developers#quickstart", title: "Quickstart", summary: "From an app to a first API call." },
  { href: "/developers#reference", title: "API reference", summary: "Connect, tokens, accounts, transactions." },
];

/**
 * LandingNav - Marketing header. Products, use cases, and developers open as menus.
 */
export function LandingNav({ mobileMenuOpen, onMobileMenuChange }) {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileGroup, setMobileGroup] = useState(null);

  const keysHref = isAuthenticated ? "/developer" : "/auth";
  const keysLabel = isAuthenticated ? "Dashboard" : "Get API keys";

  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointer = (event) => {
      if (!event.target.closest("[data-nav-menu]")) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  const closeAll = () => {
    onMobileMenuChange(false);
    setOpenMenu(null);
    setMobileGroup(null);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      {/* Three-column pill: logo left, links in the exact centre, actions right */}
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 rounded-full border border-[#ebe7f2] bg-white/85 px-2 shadow-[0_12px_32px_-20px_rgba(29,11,48,0.45)] backdrop-blur-xl lg:grid-cols-[1fr_auto_1fr]">
        <div className="contents">
          <Link to="/" className="flex items-center justify-self-start pl-3 sm:pl-4" onClick={closeAll}>
            <img src="/logo.svg" alt="Setl" className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <MenuButton
              label="Products"
              open={openMenu === "products"}
              active={pathname.startsWith("/products")}
              onToggle={() => setOpenMenu((m) => (m === "products" ? null : "products"))}
            >
              <MenuPanel>
                {PRODUCTS.map((item) => (
                  <MenuLink key={item.href} {...item} onClick={() => setOpenMenu(null)} />
                ))}
                <Link
                  to="/products"
                  onClick={() => setOpenMenu(null)}
                  className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
                >
                  All products
                </Link>
              </MenuPanel>
            </MenuButton>

            <MenuButton
              label="Use cases"
              open={openMenu === "cases"}
              active={pathname.startsWith("/use-cases")}
              onToggle={() => setOpenMenu((m) => (m === "cases" ? null : "cases"))}
              wide
            >
              <MenuPanel wide>
                <div className="grid grid-cols-2 gap-1">
                  {USE_CASES.map(({ slug, title, summary }) => (
                    <MenuLink
                      key={slug}
                      href={`/use-cases#${slug}`}
                      title={title}
                      summary={summary}
                      onClick={() => setOpenMenu(null)}
                    />
                  ))}
                </div>
                <Link
                  to="/use-cases"
                  onClick={() => setOpenMenu(null)}
                  className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
                >
                  All use cases
                </Link>
              </MenuPanel>
            </MenuButton>

            <MenuButton
              label="Developers"
              open={openMenu === "devs"}
              active={pathname.startsWith("/developers")}
              onToggle={() => setOpenMenu((m) => (m === "devs" ? null : "devs"))}
            >
              <MenuPanel>
                {DEVELOPER_LINKS.map((item) => (
                  <MenuLink key={item.href} {...item} onClick={() => setOpenMenu(null)} />
                ))}
              </MenuPanel>
            </MenuButton>

            <Link
              to="/pricing"
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-[#3f3f3f] hover:text-[#141414]",
                pathname.startsWith("/pricing") && "font-medium text-[#141414]"
              )}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-[#3f3f3f] hover:text-[#141414]",
                pathname.startsWith("/about") && "font-medium text-[#141414]"
              )}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="hidden h-10 items-center rounded-full px-4 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2] sm:inline-flex"
            >
              Log in
            </Link>
          )}
          <Link
            to={keysHref}
            className="hidden h-10 items-center rounded-full bg-[#141414] px-4 text-sm font-medium text-white hover:bg-[#2a2a2a] sm:inline-flex"
          >
            {keysLabel}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#141414] hover:bg-[#f6f5f2] lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => onMobileMenuChange(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-h-[calc(100vh-6rem)] max-w-6xl overflow-y-auto rounded-3xl border border-[#ebe7f2] bg-white shadow-[0_24px_48px_-24px_rgba(29,11,48,0.45)] lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
            <MobileGroup
              label="Products"
              open={mobileGroup === "products"}
              onToggle={() => setMobileGroup((g) => (g === "products" ? null : "products"))}
            >
              {PRODUCTS.map((item) => (
                <Link key={item.href} to={item.href} onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm text-[#141414]">
                  {item.title}
                </Link>
              ))}
              <Link to="/products" onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm font-medium">
                All products
              </Link>
            </MobileGroup>
            <MobileGroup
              label="Use cases"
              open={mobileGroup === "cases"}
              onToggle={() => setMobileGroup((g) => (g === "cases" ? null : "cases"))}
            >
              {USE_CASES.map(({ slug, title }) => (
                <Link key={slug} to={`/use-cases#${slug}`} onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm">
                  {title}
                </Link>
              ))}
            </MobileGroup>
            <MobileGroup
              label="Developers"
              open={mobileGroup === "devs"}
              onToggle={() => setMobileGroup((g) => (g === "devs" ? null : "devs"))}
            >
              {DEVELOPER_LINKS.map((item) => (
                <Link key={item.href} to={item.href} onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm">
                  {item.title}
                </Link>
              ))}
            </MobileGroup>
            <Link to="/pricing" onClick={closeAll} className="rounded-lg px-3 py-3 text-sm">
              Pricing
            </Link>
            <Link to="/about" onClick={closeAll} className="rounded-lg px-3 py-3 text-sm">
              About
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-[#eceae4] pt-3">
              {!isAuthenticated && (
                <Link to="/auth" onClick={closeAll} className="flex h-11 items-center justify-center rounded-full border border-[#141414] text-sm font-medium">
                  Log in
                </Link>
              )}
              <Link to={keysHref} onClick={closeAll} className="flex h-11 items-center justify-center rounded-full bg-[#141414] text-sm font-medium text-white">
                {keysLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuButton({ label, open, active, onToggle, wide, children }) {
  return (
    <div className="relative" data-nav-menu>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#3f3f3f] hover:text-[#141414]",
          (open || active) && "font-medium text-[#141414]"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className={cn("absolute left-0 top-full z-50 pt-2", wide ? "w-[34rem]" : "w-80")}>
          {children}
        </div>
      )}
    </div>
  );
}

function MenuPanel({ wide, children }) {
  return (
    <div className={cn("rounded-2xl border border-[#ebe7f2] bg-white p-2 shadow-[0_24px_48px_-24px_rgba(29,11,48,0.45)]", wide && "w-[34rem]")}>
      {children}
    </div>
  );
}

function MenuLink({ href, title, summary, onClick }) {
  return (
    <Link to={href} onClick={onClick} className="block rounded-xl px-3 py-2.5 hover:bg-[#f6f5f2]">
      <span className="block text-sm font-medium text-[#141414]">{title}</span>
      <span className="mt-0.5 block text-xs leading-snug text-[#6b6b66]">{summary}</span>
    </Link>
  );
}

function MobileGroup({ label, open, onToggle, children }) {
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm"
        aria-expanded={open}
        onClick={onToggle}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-1 pl-3">{children}</div>}
    </div>
  );
}
