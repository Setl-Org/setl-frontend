import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
// Import directly from the constants module (not the feature barrel) to avoid a
// circular dependency: the barrel also exports UseCasesPage, which imports this nav.
import { USE_CASES } from "@/features/usecases/constants";

/**
 * LandingNav - Fixed header with page-level links, a Use cases mega-menu, and
 * mobile menu. Section links use absolute hashes (/#features) so they resolve
 * from any page via the ScrollToHash helper, mirroring Plaid's nav model where
 * every item is a destination rather than a same-page anchor.
 *
 * @param {Object} props
 * @param {boolean} props.mobileMenuOpen
 * @param {(value: boolean) => void} props.onMobileMenuChange
 */
export function LandingNav({ mobileMenuOpen, onMobileMenuChange }) {
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);

  const closeMenu = () => {
    onMobileMenuChange(false);
    setMobileUseCasesOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-primary/98 backdrop-blur-xl shadow-sm safe-area-pad"
    >
      <div className="mx-auto flex h-14 min-h-[48px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Left cluster: logo + primary nav grouped together */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link
            to="/"
            className="relative z-10 flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2"
            onClick={closeMenu}
          >
            <img src="/logo.png" alt="Setl" className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          <Link
            to="/#features"
            className="nav-link inline-flex min-h-[44px] items-center"
          >
            Product
          </Link>

          {/* Use cases mega-menu */}
          <div
            className="relative"
            onMouseEnter={() => setUseCasesOpen(true)}
            onMouseLeave={() => setUseCasesOpen(false)}
          >
            <button
              type="button"
              className="nav-link inline-flex min-h-[44px] items-center gap-1"
              aria-expanded={useCasesOpen}
              aria-haspopup="true"
              onClick={() => setUseCasesOpen((v) => !v)}
              onFocus={() => setUseCasesOpen(true)}
            >
              Use cases
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  useCasesOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {useCasesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full z-50 w-[36rem] -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-primary p-2 shadow-xl">
                    <div className="grid grid-cols-2 gap-1">
                      {USE_CASES.map(({ slug, title, summary }) => (
                        <Link
                          key={slug}
                          to={`/use-cases#${slug}`}
                          className="group rounded-xl px-3 py-2.5 transition hover:bg-muted/60"
                        >
                          <span className="block text-sm font-semibold text-secondary group-hover:text-tertiary">
                            {title}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">
                            {summary}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/use-cases"
                      className="mt-1 flex items-center justify-center gap-1 rounded-xl border-t border-border/60 px-3 py-2.5 text-sm font-semibold text-tertiary transition hover:bg-tertiary/5"
                    >
                      View all use cases
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/#pricing"
            className="nav-link inline-flex min-h-[44px] items-center"
          >
            Pricing
          </Link>
          </nav>
        </div>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <Link
            to="/auth"
            className="hidden h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-secondary transition hover:border-secondary/60 hover:bg-muted sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="hidden h-9 items-center rounded-lg bg-tertiary px-4 text-sm font-semibold text-tertiary-foreground shadow-sm transition hover:bg-tertiary/90 sm:inline-flex"
          >
            Get API keys
          </Link>
          <button
            type="button"
            onClick={() => onMobileMenuChange(!mobileMenuOpen)}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-secondary md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-border/80 bg-primary shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            <Link
              to="/#features"
              className="nav-link flex min-h-[48px] items-center rounded-lg px-4 hover:bg-muted/50"
              onClick={closeMenu}
            >
              Product
            </Link>

            {/* Use cases — expandable group */}
            <button
              type="button"
              onClick={() => setMobileUseCasesOpen((v) => !v)}
              className="nav-link flex min-h-[48px] items-center justify-between rounded-lg px-4 hover:bg-muted/50"
              aria-expanded={mobileUseCasesOpen}
            >
              Use cases
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  mobileUseCasesOpen && "rotate-180"
                )}
              />
            </button>
            {mobileUseCasesOpen && (
              <div className="ml-2 flex flex-col gap-0.5 border-l border-border/60 pl-2">
                {USE_CASES.map(({ slug, title }) => (
                  <Link
                    key={slug}
                    to={`/use-cases#${slug}`}
                    className="flex min-h-[44px] items-center rounded-lg px-4 text-sm text-secondary hover:bg-muted/50"
                    onClick={closeMenu}
                  >
                    {title}
                  </Link>
                ))}
                <Link
                  to="/use-cases"
                  className="flex min-h-[44px] items-center rounded-lg px-4 text-sm font-semibold text-tertiary hover:bg-tertiary/5"
                  onClick={closeMenu}
                >
                  View all use cases
                </Link>
              </div>
            )}

            <Link
              to="/#pricing"
              className="nav-link flex min-h-[48px] items-center rounded-lg px-4 hover:bg-muted/50"
              onClick={closeMenu}
            >
              Pricing
            </Link>

            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-2">
              <Link
                to="/auth"
                className={cn(
                  BUTTON_SECONDARY_CLASS,
                  "min-h-[48px] w-full justify-center"
                )}
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className={cn(
                  BUTTON_TERTIARY_CLASS,
                  "min-h-[48px] w-full justify-center"
                )}
                onClick={closeMenu}
              >
                Get API keys
              </Link>
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
