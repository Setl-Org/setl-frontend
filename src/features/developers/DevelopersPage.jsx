import { Link } from "react-router-dom";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { CodeSample } from "@/features/home/components/CodeSample";
import { PageHero } from "@/features/home/components/PageHero";
import { pillClass } from "@/features/home/brand";
import { useAuthStore } from "@/stores/authStore";

const NAV = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#connect", label: "Connect" },
  { href: "#tokens", label: "Tokens" },
  { href: "#reference", label: "API reference" },
  { href: "#scopes", label: "Scopes" },
];

const CONNECT = `POST /api/v1/oauth/connect/sessions
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://yourapp.com/callback",
  "scope": "accounts:read transactions:read",
  "state": "optional-csrf-token"
}`;

const CONNECT_RES = `{
  "success": true,
  "data": {
    "session_id": "…",
    "connect_url": "https://<setl-host>/oauth/authorize?session=…",
    "expires_at": "2026-03-02T12:30:00.000Z"
  }
}`;

const TOKEN = `POST /api/v1/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "CODE_FROM_THE_REDIRECT",
  "redirect_uri": "https://yourapp.com/callback",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}`;

const TOKEN_RES = `{
  "access_token": "…",
  "refresh_token": "…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "accounts:read transactions:read"
}`;

const ACCOUNTS = `GET /api/external/v1/accounts
Authorization: Bearer ACCESS_TOKEN`;

const TRANSACTIONS = `GET /api/external/v1/transactions?limit=20
Authorization: Bearer ACCESS_TOKEN

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
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 20
  }
}`;

/**
 * DevelopersPage - Public documentation for the connect flow and external API.
 */
export function DevelopersPage() {
  const isAuthenticated = useAuthStore((st) => st.isAuthenticated);
  const keysHref = isAuthenticated ? "/developer" : "/auth";
  return (
    <MarketingShell>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:pt-32">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-medium">Developers</p>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1" aria-label="On this page">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-3 py-1.5 text-sm text-[#3f3f3f] hover:bg-[#f6f5f2] hover:text-[#141414] lg:rounded-lg lg:px-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <p className="rounded-2xl bg-[#F3EEF9] px-4 py-3 text-sm leading-relaxed text-[#3f3f3f]">
            The connect flow, OAuth, and the endpoints below are in the product today. In this build, account and transaction data comes from statements a user provides. Direct bank APIs open as each institution joins.
          </p>

          <section id="quickstart" className="scroll-mt-24 pt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Quickstart</h2>
            <ol className="mt-6 space-y-6">
              <li>
                <h3 className="font-medium">1. Create an app</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3f3f3f]">
                  Sign in and open the developer dashboard. Name the app, add at least one redirect URI, and choose scopes. Setl returns a client id and a client secret. Keep the secret on your server.
                </p>
              </li>
              <li>
                <h3 className="font-medium">2. Start a connect session</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3f3f3f]">
                  Your server posts the client credentials, redirect URI, and scopes. The session lasts 30 minutes. Send the user to <span className="font-mono text-[13px]">connect_url</span>.
                </p>
              </li>
              <li>
                <h3 className="font-medium">3. The user approves</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3f3f3f]">
                  They sign in to Setl, review the request, and choose accounts. Setl redirects to your URI with a <span className="font-mono text-[13px]">code</span> and the <span className="font-mono text-[13px]">state</span> you sent.
                </p>
              </li>
              <li>
                <h3 className="font-medium">4. Exchange the code</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3f3f3f]">
                  Your server posts the code to the token endpoint. The access token lasts up to one hour. Refresh it with <span className="font-mono text-[13px]">grant_type=refresh_token</span>.
                </p>
              </li>
              <li>
                <h3 className="font-medium">5. Read the data</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3f3f3f]">
                  Call the external API with <span className="font-mono text-[13px]">Authorization: Bearer</span> and the access token. The token only sees the accounts and scopes the user approved.
                </p>
              </li>
            </ol>
          </section>

          <section id="connect" className="scroll-mt-24 pt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Connect</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3f3f3f]">
              <span className="font-mono text-[13px]">scope</span> is a space-separated string. <span className="font-mono text-[13px]">scopes</span> as an array is also accepted. <span className="font-mono text-[13px]">redirect_uri</span> must match one registered on the app.
            </p>
            <div className="mt-4 space-y-4">
              <CodeSample label="POST /api/v1/oauth/connect/sessions" code={CONNECT} />
              <CodeSample label="201 Created" code={CONNECT_RES} />
            </div>
          </section>

          <section id="tokens" className="scroll-mt-24 pt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Tokens</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3f3f3f]">
              Exchange the authorization code, refresh an access token, or revoke a token. All three are server-to-server and require the client secret.
            </p>
            <div className="mt-4 space-y-4">
              <CodeSample label="POST /api/v1/oauth/token" code={TOKEN} />
              <CodeSample label="Response" code={TOKEN_RES} />
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3f3f3f]">
              <li><span className="font-mono text-[13px]">POST /api/v1/oauth/token</span> with <span className="font-mono text-[13px]">grant_type</span> <span className="font-mono text-[13px]">refresh_token</span>, plus <span className="font-mono text-[13px]">refresh_token</span>, <span className="font-mono text-[13px]">client_id</span>, and <span className="font-mono text-[13px]">client_secret</span>.</li>
              <li><span className="font-mono text-[13px]">POST /api/v1/oauth/revoke</span> with <span className="font-mono text-[13px]">token</span>, <span className="font-mono text-[13px]">client_id</span>, and <span className="font-mono text-[13px]">client_secret</span>.</li>
            </ul>
          </section>

          <section id="reference" className="scroll-mt-24 pt-16">
            <h2 className="text-2xl font-semibold tracking-tight">API reference</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3f3f3f]">
              External routes expect a bearer access token. Query <span className="font-mono text-[13px]">page</span> and <span className="font-mono text-[13px]">limit</span> (max 100) on list endpoints.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#eceae4]">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-[#f6f5f2] text-[#3f3f3f]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Path</th>
                    <th className="px-4 py-3 font-medium">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceae4]">
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px]">GET</td>
                    <td className="px-4 py-3 font-mono text-[13px]">/api/external/v1/accounts</td>
                    <td className="px-4 py-3">accounts:read</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px]">GET</td>
                    <td className="px-4 py-3 font-mono text-[13px]">/api/external/v1/transactions</td>
                    <td className="px-4 py-3">transactions:read</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px]">GET</td>
                    <td className="px-4 py-3 font-mono text-[13px]">/api/external/v1/transactions/:id</td>
                    <td className="px-4 py-3">transactions:read</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[13px]">GET</td>
                    <td className="px-4 py-3 font-mono text-[13px]">/api/external/v1/profile</td>
                    <td className="px-4 py-3">profile:read</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#3f3f3f]">
              Transactions accept <span className="font-mono text-[13px]">type</span> (credit or debit), <span className="font-mono text-[13px]">status</span>, <span className="font-mono text-[13px]">bankName</span>, and <span className="font-mono text-[13px]">accountId</span>. Amounts for debits are negative.
            </p>
            <div className="mt-4 space-y-4">
              <CodeSample label="GET /api/external/v1/accounts" code={ACCOUNTS} />
              <CodeSample label="GET /api/external/v1/transactions" code={TRANSACTIONS} />
            </div>
          </section>

          <section id="scopes" className="scroll-mt-24 pt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Scopes</h2>
            <ul className="mt-4 divide-y divide-[#eceae4] border-y border-[#eceae4]">
              <li className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                <span className="font-mono text-[13px]">accounts:read</span>
                <span className="text-sm text-[#3f3f3f]">View the accounts the user selects.</span>
              </li>
              <li className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                <span className="font-mono text-[13px]">transactions:read</span>
                <span className="text-sm text-[#3f3f3f]">View transactions on those accounts.</span>
              </li>
              <li className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                <span className="font-mono text-[13px]">profile:read</span>
                <span className="text-sm text-[#3f3f3f]">View the user&apos;s Setl profile.</span>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </MarketingShell>
  );
}
