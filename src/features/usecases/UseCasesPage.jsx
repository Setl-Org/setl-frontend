import { Link } from "react-router-dom";
import {
  Landmark,
  Wallet,
  Calculator,
  TrendingUp,
  ReceiptText,
  ArrowLeftRight,
} from "lucide-react";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { UseCaseRequestForm } from "./components/UseCaseRequestForm";
import { USE_CASES } from "./constants";

const ICONS = {
  Landmark,
  Wallet,
  Calculator,
  TrendingUp,
  ReceiptText,
  ArrowLeftRight,
};

/**
 * UseCasesPage - Workflows a builder can ship on a Setl connection.
 */
export function UseCasesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
        <h1 className="max-w-[16ch] text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          One bank API. The workflow is yours.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3f3f3f]">
          Lending, budgeting, accounting, and reconciliation all read consented Pakistani accounts through the same Setl API.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <ul className="divide-y divide-[#eceae4] border-y border-[#eceae4]">
          {USE_CASES.map(({ slug, iconKey, title, summary, points }) => {
            const Icon = ICONS[iconKey];
            return (
              <li key={slug} id={slug} className="grid scroll-mt-24 gap-4 py-8 sm:grid-cols-[16rem_1fr] sm:gap-10 sm:py-10">
                <div className="flex items-start gap-3">
                  {Icon && <Icon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />}
                  <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-[#3f3f3f]">{summary}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3f3f3f]">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <UseCaseRequestForm />

      <section className="bg-[#141414] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Build it on one connection.</h2>
          <Link
            to="/auth"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
          >
            Get API keys
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
