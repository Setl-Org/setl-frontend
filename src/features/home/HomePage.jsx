import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "./components/MarketingShell";
import { ConnectSheet } from "./components/ConnectSheet";
import { CodeSample } from "./components/CodeSample";

const TILES = [
  {
    slug: "lending",
    title: "Lending",
    wash: "#F6EFE6",
    mute: "#5c5146",
    line: "Income and cash flow from the accounts a borrower connects.",
    rows: [
      ["02 Mar", "Salary · HBL", "+185,000"],
      ["28 Feb", "Rent · Meezan", "−95,000"],
    ],
  },
  {
    slug: "pfm",
    title: "Personal finance",
    wash: "#F3EEF9",
    mute: "#4c4660",
    live: true,
    line: "Real-time balances and categorized transactions for a money app.",
    rows: [
      ["HBL current", "PKR 240,500"],
      ["JazzCash", "PKR 12,400"],
    ],
  },
  {
    slug: "accounting",
    title: "Accounting",
    wash: "#E7F0F8",
    mute: "#3d4e5c",
    line: "The same transaction shape for every institution a business connects.",
    rows: [
      ["UBL", "Invoice 1041", "matched"],
      ["MCB", "Supplier", "open"],
    ],
  },
  {
    slug: "payments",
    title: "Reconciliation",
    wash: "#E7F4EC",
    mute: "#345244",
    line: "Match collections against the feed, including Raast and 1Link references.",
    rows: [
      ["Raast", "E2E 9F3A", "settled"],
      ["1Link", "RRN 4412", "pending"],
    ],
  },
];

const STATUS = new Set(["matched", "open", "settled", "pending"]);

function TileValue({ value }) {
  if (STATUS.has(value)) {
    return (
      <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium tracking-normal text-[#141414]">
        {value}
      </span>
    );
  }
  return <span className="tabular-nums">{value}</span>;
}

const STEPS = [
  {
    title: "Your user consents",
    body: "They approve exactly what your app can read. Access is scoped and can be revoked.",
  },
  {
    title: "They sign in on Setl",
    body: "They approve the scopes on Setl. In this build the account data comes from a statement they provide. Sign-in on the bank's own channel opens as each institution joins.",
  },
  {
    title: "Setl normalizes",
    body: "Accounts and transactions come back in one schema, including local rail references when the data carries them.",
  },
  {
    title: "You call one API",
    body: "Your product reads every connected account through the same endpoints.",
  },
];

const SAMPLE = `curl "$SETL_API/api/external/v1/transactions" \\
  -H "Authorization: Bearer $ACCESS_TOKEN"

{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "6740f1c2ab",
        "date": "2026-03-02",
        "account": "HBL",
        "description": "Salary",
        "amount": 185000,
        "type": "credit",
        "status": "completed",
        "balance": 240500
      }
    ]
  }
}`;

/**
 * HomePage - Public front page.
 */
export function HomePage() {
  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[100svh] max-w-6xl items-center px-4 pb-16 pt-28 sm:px-6">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <h1 className="max-w-[12ch] text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#141414] sm:text-6xl lg:text-[4.75rem]">
              The financial data layer for Pakistan.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#3f3f3f] sm:text-lg">
              Setl connects bank accounts to the fintechs built on them. A customer consents. Your app reads accounts and transactions through one API.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/auth"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#141414] px-6 text-sm font-medium text-white hover:bg-[#2a2a2a]"
              >
                Get API keys
              </Link>
              <Link
                to="/developers"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#141414] px-6 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
              >
                Read the docs
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://nickarachi.com" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img src="/nic-karachi.webp" alt="National Incubation Center Karachi" className="h-16 w-auto" />
              </a>
              <p className="max-w-xs text-sm leading-relaxed text-[#6b6b66]">
                Incubated at NIC Karachi. Direct bank APIs open with each institution.
              </p>
            </div>
          </div>
          <div className="flex justify-center rounded-[2rem] bg-[#F3EEF9] px-4 py-8 sm:px-8">
            <ConnectSheet />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          One connection. The products your users actually need.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TILES.map((tile) => (
            <Link
              key={tile.slug}
              to={`/use-cases#${tile.slug}`}
              className="flex flex-col rounded-3xl p-6 shadow-[0_1px_0_rgba(20,20,20,0.04)] transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(20,20,20,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414] sm:p-8"
              style={{ background: tile.wash }}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{tile.title}</h3>
                {tile.live && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-[#141414]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" aria-hidden="true" />
                    Real-time
                  </span>
                )}
              </div>
              <ul className="mt-6 border-t border-[#141414]/10 text-sm text-[#141414]">
                {tile.rows.map((row) => {
                  const parts = row.slice(0, -1);
                  const value = row[row.length - 1];
                  return (
                    <li key={row.join("-")} className="flex items-baseline justify-between gap-4 border-b border-[#141414]/10 py-3">
                      <span className="min-w-0">
                        {parts.length > 1 ? (
                          <>
                            <span style={{ color: tile.mute }}>{parts[0]}</span>
                            <span className="mx-2" style={{ color: tile.mute }} aria-hidden="true">·</span>
                            <span>{parts.slice(1).join(" · ")}</span>
                          </>
                        ) : (
                          parts[0]
                        )}
                      </span>
                      <TileValue value={value} />
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-sm leading-relaxed" style={{ color: tile.mute }}>{tile.line}</p>
            </Link>
          ))}
        </div>
        <Link to="/use-cases" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
          See all use cases
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="border-t border-[#eceae4] bg-[#f6f5f2]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">How a connection works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="text-sm text-[#6b6b66]">{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3f3f3f]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="api" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            You build the product. Setl returns the accounts.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#3f3f3f]">
            Create a connect session, send your user to Setl, then call the same endpoints for every institution they connect.
          </p>
          <Link
            to="/developers"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[#141414] px-5 text-sm font-medium text-white hover:bg-[#2a2a2a]"
          >
            Read the docs
          </Link>
        </div>
        <CodeSample label="GET /api/external/v1/transactions" code={SAMPLE} />
      </section>

      <section id="security" className="border-t border-[#eceae4]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:py-24">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Setl does not store bank logins</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3f3f3f]">
              Today the customer signs in on Setl. When an institution connects directly, sign-in stays on that bank&apos;s own channel, and Setl still does not store the password.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Consent is the product</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3f3f3f]">
              Access is scoped to the accounts and data the customer allows, and they can revoke it.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Hosted in Pakistan</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3f3f3f]">
              Designed for State Bank user-data rules. Encrypted at rest and in transit.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#eceae4]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">About</h2>
            <a href="https://nickarachi.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
              <img src="/nic-karachi.webp" alt="National Incubation Center Karachi" className="h-16 w-auto" />
            </a>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#3f3f3f]">
              Setl is incubated at NIC Karachi. The team is opening bank conversations so builders can read consented accounts through one API.
            </p>
          </div>
          <Link to="/about" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
            Read about Setl
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-[#eceae4] bg-[#f6f5f2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-24">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Pricing</h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[#3f3f3f]">
              An API subscription for teams building on connected accounts. Enterprise is a contracted integration.
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <p>
              <span className="block text-2xl font-semibold tracking-tight">PKR 80–100k</span>
              <span className="text-sm text-[#6b6b66]">per month</span>
            </p>
            <p>
              <span className="block text-2xl font-semibold tracking-tight">From PKR 3 million</span>
              <span className="text-sm text-[#6b6b66]">per year, enterprise</span>
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Link to="/pricing" className="text-sm font-medium underline-offset-4 hover:underline">
            See pricing
          </Link>
        </div>
      </section>

      <section id="contact" className="bg-[#141414] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Get the keys. Build the product.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
            >
              Get API keys
            </Link>
            <a
              href="mailto:hatif@joinsetl.com"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-medium text-white hover:bg-white/10"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>

    </MarketingShell>
  );
}
