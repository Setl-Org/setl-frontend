import { Link } from "react-router-dom";
import { ArrowRight, Plug, Building2, Receipt } from "lucide-react";
import { cn } from "@/lib/cn";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { PageHero } from "@/features/home/components/PageHero";
import { DualActions } from "@/features/home/components/DualActions";
import { ConnectSheet } from "@/features/home/components/ConnectSheet";
import { ScreenTile } from "@/features/home/components/ExampleScreens";
import { ClosingCta } from "@/features/home/components/ClosingCta";
import { SetlMark } from "@/features/home/components/SetlMark";
import { TILE_FIELDS } from "@/features/home/brand";

const PRODUCTS = [
  {
    id: "connect",
    icon: Plug,
    name: "Connect",
    lede: "The screen your user sees when they agree to share an account.",
    body: "Your server creates a short-lived session. Setl returns a connect URL. The customer signs in on Setl, picks the accounts, and approves the scopes. In this build those accounts come from a statement they provide. Sign-in on the bank's own channel opens as each institution joins. The client secret never goes in the browser.",
    endpoint: "POST /api/v1/oauth/connect/sessions",
  },
  {
    id: "accounts",
    icon: Building2,
    name: "Accounts",
    lede: "The accounts the customer selected, in one list.",
    body: "Each account comes back with its institution, name, type, and status. Your app calls Setl, not each bank. Password fields are omitted from the external API.",
    endpoint: "GET /api/external/v1/accounts",
    field: TILE_FIELDS.violet,
  },
  {
    id: "transactions",
    icon: Receipt,
    name: "Transactions",
    lede: "A single feed for every connected account.",
    body: "Transactions return with date, amount, type, status, description, and running balance. Filter by institution, account, type, or status. Raast and 1Link references stay on the transaction when the source data includes them.",
    endpoint: "GET /api/external/v1/transactions",
    field: TILE_FIELDS.plum,
  },
];

/** The three calls as a numbered strip beside the hero headline. */
function CallStrip() {
  return (
    <ol className="rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.74),rgba(255,255,255,0.5))] p-3 shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.5),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] backdrop-saturate-150">
      {PRODUCTS.map(({ id, icon: Icon, name, endpoint }) => (
        <li key={id}>
          <a href={`#${id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-3.5 transition-colors hover:bg-[#F3EEF9]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{name}</span>
              <span className="block truncate font-mono text-[12px] text-[#6b6b66]">{endpoint}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-[#6b6b66] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * ProductsPage - What the API offers today, each call shown at work, and what
 * opens with the banks.
 */
export function ProductsPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Three calls. One connection."
        description="Connect asks the customer. Accounts and transactions are what your product reads afterward."
        actions={<DualActions />}
        aside={<CallStrip />}
      />

      <section className="bg-[#F3EEF9]">
        <div className="mx-auto max-w-6xl space-y-24 px-4 py-24 sm:px-6 lg:space-y-32 lg:py-32">
          {PRODUCTS.map((product, i) => (
            <article key={product.id} id={product.id} className="group grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                {product.id === "connect" ? (
                  <div className="relative isolate flex items-center justify-center overflow-hidden rounded-[28px] px-5 py-10 sm:px-12 lg:h-[680px]" style={{ background: TILE_FIELDS.night }}>
                    <SetlMark strokeWidth={1.1} className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[560px] w-[560px] text-white/[0.12]" />
                    <div className="w-full max-w-[400px]">
                      <ConnectSheet glass={false} />
                    </div>
                  </div>
                ) : (
                  <ScreenTile kind={product.id} field={product.field} className="sm:h-[420px]" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{product.name}</h2>
                <p className="mt-4 text-xl font-medium leading-snug text-[#141414]">{product.lede}</p>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-[#3f3f3f]">{product.body}</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <code className="rounded-full bg-white px-4 py-2 font-mono text-[13px] text-[#542774] ring-1 ring-[#eee8f6]">{product.endpoint}</code>
                  <Link to="/developers" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
                    Read the docs
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="on-dark relative isolate overflow-hidden bg-[#1d0b30] text-white">
        <SetlMark strokeWidth={1} className="pointer-events-none absolute -right-[18%] top-1/2 -z-10 h-[760px] w-[760px] -translate-y-1/2 text-white/[0.05]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:py-28">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Opening with the banks</h2>
          <div>
            <p className="text-lg leading-relaxed text-white/80">
              The connect flow and these endpoints are in the product today. In this build, account and transaction data comes from
              statements a user provides, so a builder can see the shape of the API.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Direct bank APIs, live balance pulls, webhooks, and incremental sync open as each institution joins.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta />
    </MarketingShell>
  );
}
