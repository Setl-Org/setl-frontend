/**
 * Footer - Site footer with logo and links.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <img
            src="/logo.png"
            alt="Setl"
            className="h-8 w-auto brightness-0 invert"
          />
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm sm:gap-10">
            <a
              href="#features"
              className="min-h-[44px] inline-flex items-center py-2 text-primary/70 underline-offset-4 transition hover:text-primary hover:underline"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="min-h-[44px] inline-flex items-center py-2 text-primary/70 underline-offset-4 transition hover:text-primary hover:underline"
            >
              Pricing
            </a>
            <a
              href="mailto:contact@setl.dev"
              className="min-h-[44px] inline-flex items-center py-2 text-primary/70 underline-offset-4 transition hover:text-primary hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-primary/50 sm:mt-10">
          © {new Date().getFullYear()} Setl. Bank connectivity for Pakistan.
        </p>
      </div>
    </footer>
  );
}
