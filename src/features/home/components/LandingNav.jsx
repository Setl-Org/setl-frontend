import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { CURRENCIES } from "../constants";

/**
 * LandingNav - Fixed header with desktop links, currency selector, and mobile hamburger menu.
 *
 * @param {Object} props
 * @param {boolean} props.mobileMenuOpen
 * @param {(value: boolean) => void} props.onMobileMenuChange
 * @param {string} props.currency - Current currency id (PKR | AED | SAR)
 * @param {(id: string) => void} props.onCurrencyChange
 */
export function LandingNav({ mobileMenuOpen, onMobileMenuChange, currency = "PKR", onCurrencyChange = () => {} }) {
  const closeMenu = () => onMobileMenuChange(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const current = CURRENCIES.find((c) => c.id === currency) ?? CURRENCIES[0];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-primary/98 backdrop-blur-xl shadow-sm safe-area-pad"
    >
      <div className="mx-auto flex h-14 min-h-[48px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="relative z-10 flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2"
          onClick={closeMenu}
        >
          <img src="/logo.png" alt="Setl" className="h-8 w-auto sm:h-9" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="nav-link inline-flex min-h-[44px] items-center"
          >
            Product
          </a>
          <a
            href="#pricing"
            className="nav-link inline-flex min-h-[44px] items-center"
          >
            Pricing
          </a>
        </nav>
        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen((o) => !o)}
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border/80 bg-primary px-3 py-2 text-sm font-medium text-secondary hover:bg-muted/50 sm:gap-2 sm:px-3.5"
              aria-label="Select country and currency"
              aria-expanded={currencyOpen}
              aria-haspopup="listbox"
            >
              <span className="text-lg leading-none" aria-hidden>{current.flag}</span>
              <span>{current.abbr}</span>
              <ChevronDown className={cn("h-4 w-4 transition", currencyOpen && "rotate-180")} />
            </button>
            {currencyOpen && (
              <ul
                role="listbox"
                className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-primary py-1 shadow-lg"
              >
                {CURRENCIES.map((c) => (
                  <li key={c.id} role="option" aria-selected={currency === c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onCurrencyChange(c.id);
                        setCurrencyOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm",
                        currency === c.id
                          ? "bg-tertiary/10 font-medium text-tertiary"
                          : "text-secondary hover:bg-muted/50"
                      )}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span>{c.abbr}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            to="/auth"
            className={cn(
              BUTTON_SECONDARY_CLASS,
              "hidden min-h-[44px] sm:inline-flex"
            )}
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className={cn(
              BUTTON_TERTIARY_CLASS,
              "hidden min-h-[44px] px-4 sm:inline-flex sm:px-6"
            )}
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
        <div className="absolute inset-x-0 top-14 border-t border-border/80 bg-primary shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            <a
              href="#features"
              className="nav-link flex min-h-[48px] items-center rounded-lg px-4 hover:bg-muted/50"
              onClick={closeMenu}
            >
              Product
            </a>
            <a
              href="#pricing"
              className="nav-link flex min-h-[48px] items-center rounded-lg px-4 hover:bg-muted/50"
              onClick={closeMenu}
            >
              Pricing
            </a>
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
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
