import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { useAuthStore } from "@/stores/authStore";

/** 404 inside the site chrome, so the visitor keeps the nav and footer and a way back. */
export function NotFoundPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 pb-20 pt-32 sm:px-6">
        <p className="font-mono text-[13px] text-[#6b6b78]">404</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#141414] sm:text-[56px]">
          This page isn&apos;t here.
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#5c5c66]">
          The link may be old or mistyped. Everything else on Setl is where you left it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#141414] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[#141414]/85 focus-ring"
          >
            Back to the homepage
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/developers"}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d6d6de] px-5 text-[15px] font-medium text-[#141414] transition-colors hover:bg-[#f7f7f9] focus-ring"
          >
            {isAuthenticated ? "Open your dashboard" : "Read the docs"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
