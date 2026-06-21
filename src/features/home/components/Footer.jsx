import { Link } from "react-router-dom";
import { FOOTER_COLUMNS } from "../constants";

/**
 * Footer - Site footer with logo, grouped link columns, and copyright.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-12 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Brand */}
          <div className="max-w-xs">
            <img
              src="/logo.png"
              alt="Setl"
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed text-primary/50">
              Statements into clean, AI-categorized data and an API — built for
              Pakistani fintechs.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-primary">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link
                        to={link.href}
                        className="text-sm text-primary/60 transition hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-primary/60 transition hover:text-primary"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-primary/50">
            © {new Date().getFullYear()} Setl. Bank connectivity for Pakistan.
          </p>
          <p className="text-sm text-primary/50">Data hosted in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
