import { Landmark, Wallet, Calculator, TrendingUp, ReceiptText, ArrowLeftRight, Check, ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { PageHero } from "@/features/home/components/PageHero";
import { DualActions } from "@/features/home/components/DualActions";
import { ScreenTile } from "@/features/home/components/ExampleScreens";
import { ClosingCta } from "@/features/home/components/ClosingCta";
import { TILE_FIELDS } from "@/features/home/brand";
import { UseCaseRequestForm } from "./components/UseCaseRequestForm";
import { USE_CASES } from "./constants";

const ICONS = { Landmark, Wallet, Calculator, TrendingUp, ReceiptText, ArrowLeftRight };

const FIELDS = {
  lending: TILE_FIELDS.plum,
  pfm: TILE_FIELDS.violet,
  accounting: TILE_FIELDS.night,
  wealth: TILE_FIELDS.dusk,
  expense: TILE_FIELDS.orchid,
  payments: TILE_FIELDS.rose,
};

/** Glass index of every use case, beside the hero headline. */
function UseCaseIndex() {
  return (
    <nav
      aria-label="Use cases on this page"
      className="rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.74),rgba(255,255,255,0.5))] p-3 shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.5),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] backdrop-saturate-150"
    >
      <ul>
        {USE_CASES.map(({ slug, iconKey, title }) => {
          const Icon = ICONS[iconKey];
          return (
            <li key={slug}>
              <a href={`#${slug}`} className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-[#F3EEF9]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: FIELDS[slug] }}>
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                </span>
                <span className="flex-1 text-[15px] font-medium">{title}</span>
                <ArrowDown className="h-4 w-4 text-[#6b6b66] transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * UseCasesPage - Workflows a builder can ship on a Setl connection, each shown
 * as the product at work on a colour field.
 */
export function UseCasesPage() {
  return (
    <MarketingShell>
      <PageHero
        title="One bank API. The workflow is yours."
        description="Lending, budgeting, accounting and reconciliation all read consented Pakistani accounts through the same Setl API."
        actions={<DualActions />}
        aside={<UseCaseIndex />}
      />

      <section className="bg-[#F3EEF9]">
        <div className="mx-auto max-w-6xl space-y-24 px-4 py-24 sm:px-6 lg:space-y-32 lg:py-32">
          {USE_CASES.map(({ slug, title, summary, points }, i) => {
            return (
              <article key={slug} id={slug} className="group grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <ScreenTile kind={slug} field={FIELDS[slug]} className={cn("sm:h-[400px]", i % 2 === 1 && "lg:order-2")} />
                <div>
                  <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">{title}</h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#3f3f3f]">{summary}</p>
                  <ul className="mt-6 space-y-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#3f3f3f]">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#141414] text-white">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <UseCaseRequestForm />

      <ClosingCta title="Build it on one connection." />
    </MarketingShell>
  );
}
