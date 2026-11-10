import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Layers, ArrowLeftRight, MapPin, KeyRound, LockKeyhole } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { MarketingShell } from "./components/MarketingShell";
import { ConnectSheet } from "./components/ConnectSheet";
import { CodeSample } from "./components/CodeSample";
import { SetlMark } from "./components/SetlMark";
import { UseCaseTiles } from "./components/UseCaseTiles";
import { BuiltForPakistan } from "./components/BuiltForPakistan";
import { ClosingCta } from "./components/ClosingCta";
import { FIELD, pillClass } from "./brand";
import { DualActions } from "./components/DualActions";

const TRUTHS = [
  [ShieldCheck, "Consent the customer can revoke"],
  [Layers, "One schema across institutions"],
  [ArrowLeftRight, "Raast and 1Link references kept"],
  [MapPin, "Hosted in Pakistan"],
];

const STEPS = [
  {
    title: "Your user consents",
    body: "They approve exactly what your app can read. Access is scoped and can be revoked.",
  },
  {
    title: "They sign in on Setl",
    body: "They approve the scopes on Setl. Today the account data comes from a statement they provide. Sign-in on the bank's own channel opens as each institution joins.",
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

const TRUST = [
  {
    icon: KeyRound,
    title: "Setl does not store bank logins",
    body: "Today the customer signs in on Setl. When an institution connects directly, sign-in stays on that bank's own channel, and Setl still does not store the password.",
  },
  {
    icon: ShieldCheck,
    title: "Consent is the product",
    body: "Access is scoped to the accounts and data the customer allows, and they can revoke it.",
  },
  {
    icon: LockKeyhole,
    title: "Hosted in Pakistan",
    body: "Designed for State Bank user-data rules. Encrypted at rest and in transit.",
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

const pill = pillClass;

/**
 * HomePage - Public front page. A white hero holds a working glass connect
 * flow over the half mark; product screens, coverage and the developer path follow.
 */
export function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const keysHref = isAuthenticated ? "/developer" : "/auth";

  return (
    <MarketingShell>
      {/* Hero: white primary, the half mark in lilac line-art radiating from behind a working connect flow */}
      <section className="relative isolate overflow-hidden bg-white text-[#141414]">
        <SetlMark
          assemble
          strokeWidth={1}
          className="pointer-events-none absolute right-0 top-[46%] -z-10 hidden aspect-square w-[min(1320px,118vw)] -translate-y-1/2 translate-x-[46%] text-[#f0eafb] md:block"
        />
        <SetlMark
          assemble
          strokeWidth={1}
          className="pointer-events-none absolute right-0 top-28 -z-10 aspect-square w-[150vw] translate-x-[58%] text-[#f0eafb] md:hidden"
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16 lg:pb-20 lg:pt-40">
          <div>
            <h1 className="max-w-[11ch] text-[3rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[4.25rem] lg:text-[5.25rem]">
              The financial data layer for Pakistan.
            </h1>
            <p className="mt-7 max-w-[31rem] text-lg leading-relaxed text-[#3f3f3f] sm:text-xl">
              Setl connects bank accounts to the fintechs built on them. A customer consents. Your app reads accounts and
              transactions through one API.
            </p>
            <DualActions className="mt-9" />
            <a
              href="https://nickarachi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white py-1.5 pl-1.5 pr-5 ring-1 ring-[#eceae4] transition-shadow hover:shadow-[0_10px_24px_-16px_rgba(29,11,48,0.4)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white ring-1 ring-[#eee8f6]">
                <img src="/nic-karachi.webp" alt="" className="h-12 w-auto" />
              </span>
              <span className="text-sm text-[#3f3f3f]">Incubated at NIC Karachi</span>
            </a>
          </div>
          {/* The glass sheet floats over the mark; the fixed height keeps the demo's steps from moving the headline */}
          <div className="flex items-center justify-center lg:h-[700px]">
            <div className="w-full max-w-[420px]">
              <ConnectSheet />
            </div>
          </div>
        </div>

        <div className="border-t border-[#eceae4] bg-white/80 backdrop-blur-sm">
          <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {TRUTHS.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-sm text-[#3f3f3f]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3EEF9] text-[#542774]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use cases as product screens */}
      <section id="features" className="bg-[#F3EEF9]">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
              One connection. The products your users actually need.
            </h2>
            <Link to="/use-cases" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              See all use cases
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-14">
            <UseCaseTiles />
          </div>
        </div>
      </section>

      <BuiltForPakistan />

      {/* How a connection works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">How a connection works</h2>
          <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <span aria-hidden="true" className="absolute left-5 right-5 top-5 hidden h-px bg-[linear-gradient(90deg,#542774,#c44fa3)] opacity-40 lg:block" />
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1d0b30] font-mono text-sm font-semibold text-white ring-8 ring-white">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#3f3f3f]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Developer path: dark card with the real request and response */}
      <section id="api" className="bg-white px-4 pb-24 sm:px-6 lg:pb-32">
        <div className="on-dark relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#1d0b30] text-white">
          <SetlMark
            strokeWidth={1}
            className="pointer-events-none absolute -right-[12%] top-1/2 -z-10 h-[820px] w-[820px] -translate-y-1/2 text-white/[0.06]"
          />
          <div className="grid grid-cols-1 items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
                You build the product. Setl returns the accounts.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
                Create a connect session, send your user to Setl, then call the same endpoints for every institution they connect.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to={keysHref} className={`${pill} bg-white text-[#141414] hover:bg-[#F3EEF9]`}>
                  Get API keys
                </Link>
                <Link to="/developers" className={`${pill} text-white ring-1 ring-white/30 hover:bg-white/10`}>
                  Read the docs
                </Link>
              </div>
            </div>
            <CodeSample label="GET /api/external/v1/transactions" code={SAMPLE} />
          </div>
        </div>
      </section>

      {/* Trust: an editorial heading beside three ruled commitments */}
      <section id="security" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-32">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">Built on consent</h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-[#3f3f3f]">
              What protects the people connecting their accounts, and what Setl never holds.
            </p>
          </div>
          <ul className="divide-y divide-[#eceae4] border-y border-[#eceae4]">
            {TRUST.map(({ icon: Icon, title, body }) => (
              <li key={title} className="grid gap-5 py-9 sm:grid-cols-[56px_1fr] sm:gap-7">
                <Icon className="mt-1 h-8 w-8 text-[#542774]" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-[#3f3f3f]">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing: one card in three parts, then a slim About strip */}
      <section id="pricing" className="scroll-mt-24 bg-[#F3EEF9]">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
          <div className="grid overflow-hidden rounded-[32px] bg-white ring-1 ring-[#eee8f6] lg:grid-cols-[1.15fr_1fr_1fr]">
            <div className="p-8 sm:p-10">
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Pricing</h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-[#3f3f3f]">
                An API subscription for teams building on connected accounts. Enterprise is a contracted integration.
              </p>
              <Link to="/pricing" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#141414] transition-colors hover:bg-[#141414] hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                See pricing
              </Link>
            </div>
            <div className="flex flex-col justify-end border-t border-[#eee8f6] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="text-sm font-medium text-[#6b6b66]">API, per month</p>
              <p className="mt-2 whitespace-nowrap text-4xl font-semibold tracking-[-0.035em] sm:text-[44px]">PKR 80–100k</p>
              <p className="mt-3 text-sm leading-relaxed text-[#3f3f3f]">Connect, accounts, transactions, and profile</p>
            </div>
            <div className="on-dark relative isolate flex flex-col justify-end overflow-hidden p-8 text-white sm:p-10" style={{ background: FIELD }}>
              <SetlMark strokeWidth={1.1} className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[340px] w-[340px] text-white/[0.14]" />
              <p className="text-sm font-medium text-white/75">Enterprise, per year</p>
              <p className="mt-2 whitespace-nowrap text-4xl font-semibold tracking-[-0.035em] sm:text-[44px]">From PKR 3M</p>
              <p className="mt-3 text-sm leading-relaxed text-white/85">A contracted integration as bank access opens</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-[32px] bg-white p-6 ring-1 ring-[#eee8f6] sm:flex-row sm:items-center sm:p-8">
            <a
              href="mailto:info@joinsetl.com"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-medium text-white hover:bg-white/10"
            >
              <img src="/nic-karachi.webp" alt="National Incubation Center Karachi" className="h-20 w-auto" />
            </a>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">About Setl</h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#3f3f3f]">
                Setl is incubated at NIC Karachi. The team is opening bank conversations so builders can read consented accounts through
                one API.
              </p>
            </div>
            <Link to="/about" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#141414] transition-colors hover:bg-[#141414] hover:text-white">
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              Read about Setl
            </Link>
          </div>
        </div>
      </section>

      <ClosingCta id="contact" />
    </MarketingShell>
  );
}
