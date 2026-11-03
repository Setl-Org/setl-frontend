import { Link } from "react-router-dom";
import { MarketingShell } from "@/features/home/components/MarketingShell";

const PRODUCTS = [
  {
    id: "connect",
    name: "Connect",
    lede: "The screen your user sees when they agree to share an account.",
    body: "Your server creates a short-lived session. Setl returns a connect URL. The customer signs in on Setl, picks the accounts, and approves the scopes. In this build those accounts come from a statement they provide. Sign-in on the bank's own channel opens as each institution joins. The client secret never goes in the browser.",
    endpoint: "POST /api/v1/oauth/connect/sessions",
  },
  {
    id: "accounts",
    name: "Accounts",
    lede: "The accounts the customer selected, in one list.",
    body: "Each account comes back with its institution, name, type, and status. Your app calls Setl, not each bank. Password fields are omitted from the external API.",
    endpoint: "GET /api/external/v1/accounts",
  },
  {
    id: "transactions",
    name: "Transactions",
    lede: "A single feed for every connected account.",
    body: "Transactions return with date, amount, type, status, description, and running balance. Filter by institution, account, type, or status. Raast and 1Link references stay on the transaction when the source data includes them.",
    endpoint: "GET /api/external/v1/transactions",
  },
];

/**
 * ProductsPage - What the API actually offers today, and what opens with the banks.
 */
export function ProductsPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
        <h1 className="max-w-[16ch] text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Three calls. One connection.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3f3f3f]">
          Connect asks the customer. Accounts and transactions are what your product reads afterward.
        </p>
      </section>

      {PRODUCTS.map((product) => (
        <section key={product.id} id={product.id} className="scroll-mt-24 border-t border-[#eceae4]">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h2>
            <div>
              <p className="text-lg font-medium text-[#141414]">{product.lede}</p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#3f3f3f]">{product.body}</p>
              <p className="mt-5 font-mono text-sm text-[#7C3AED]">{product.endpoint}</p>
              <Link to="/developers" className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline">
                Read the docs
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-[#eceae4] bg-[#f6f5f2]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Opening with the banks</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#3f3f3f]">
            The connect flow and these endpoints are in the product today. In this build, account and transaction data comes from statements a user provides, so a builder can see the shape of the API. Direct bank APIs, live balance pulls, webhooks, and incremental sync open as each institution joins.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-[#141414] px-5 text-sm font-medium text-white hover:bg-[#2a2a2a]"
          >
            Get API keys
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
