import { BookOpen, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { Card, CardHeader, CardBody } from "@/components/app/Card";
import { CopyField } from "@/components/app/CopyField";
import { CodeBlock } from "@/components/app/CodeBlock";
import { Tag } from "@/components/app/StatusPill";
import {
  API_BASE_FOR_DOCS,
  EXTERNAL_API_BASE,
  OAUTH_STEPS,
  SCOPED_ENDPOINTS,
  TOKEN_LIFETIMES,
} from "../constants";

const CONNECT_FLOW = `const session = await fetch("${API_BASE_FOR_DOCS}/oauth/connect/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: process.env.SETL_CLIENT_ID,
    client_secret: process.env.SETL_CLIENT_SECRET,
    redirect_uri: "https://yourapp.com/callback",
    scope: "accounts:read transactions:read",
  }),
});
const { connect_url } = (await session.json()).data;

// After the customer approves, your redirect receives ?code=
await fetch("${API_BASE_FOR_DOCS}/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://yourapp.com/callback",
    client_id: process.env.SETL_CLIENT_ID,
    client_secret: process.env.SETL_CLIENT_SECRET,
  }),
});`;

const CURL_OAUTH = `curl -X GET "${EXTERNAL_API_BASE}/transactions" \\
  -H "Authorization: Bearer <oauth_access_token>"`;

const CURL_KEY = `curl -X GET "${EXTERNAL_API_BASE}/transactions" \\
  -H "Authorization: Bearer setl_dev_<your_key>"`;

const PYTHON = `import requests, pandas as pd

API_KEY = "setl_dev_<your_key>"
BASE = "${EXTERNAL_API_BASE}"

res = requests.get(
    f"{BASE}/transactions",
    headers={"Authorization": f"Bearer {API_KEY}"},
)
res.raise_for_status()
rows = res.json()["data"]["transactions"]

pd.DataFrame(rows).to_excel("transactions.xlsx", index=False)
print(f"Wrote {len(rows)} transactions to transactions.xlsx")`;

/** API reference - endpoints and samples on the left, the OAuth flow and lifetimes in the rail. */
export function ApiReferencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="API reference"
        description="Everything you need to read Setl data from your server: the connect flow, scopes and ready-to-run samples."
        actions={
          <AppButton href="/developers" target="_blank" rel="noreferrer" leadingIcon={BookOpen} trailingIcon={ArrowUpRight}>
            Full docs
          </AppButton>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader title="Base URL" description="All external endpoints live under this path." />
            <CardBody>
              <CopyField label="External API" value={EXTERNAL_API_BASE} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Connect flow"
              description="Create the session on your server; the client secret never goes to a browser. Send the customer to the connect_url in the response."
            />
            <CardBody>
              <CodeBlock title="server.js" code={CONNECT_FLOW} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Scoped endpoints" description="An access token can only call the endpoints its scopes allow." />
            <CardBody className="pt-3">
              <table className="w-full text-left text-[13.5px]">
                <caption className="sr-only">Scopes and the endpoints they allow</caption>
                <thead>
                  <tr className="border-b border-hairline text-[12.5px] text-ink-muted">
                    <th scope="col" className="py-2 pr-4 font-medium">Scope</th>
                    <th scope="col" className="py-2 font-medium">Endpoints</th>
                  </tr>
                </thead>
                <tbody>
                  {SCOPED_ENDPOINTS.map(([scope, endpoint]) => (
                    <tr key={scope} className="border-b border-hairline last:border-b-0">
                      <td className="py-3 pr-4"><Tag className="bg-lilac text-violet-ink border-lilac-strong">{scope}</Tag></td>
                      <td className="py-3 font-mono text-[12.5px] text-ink">{endpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Examples" description="Personal keys read your own data only. OAuth tokens read what the customer approved." />
            <CardBody className="space-y-4">
              <CodeBlock title="cURL · OAuth access token" code={CURL_OAUTH} />
              <CodeBlock title="cURL · personal API key" code={CURL_KEY} />
              <CodeBlock title="Python · transactions to Excel (pip install requests pandas openpyxl)" code={PYTHON} />
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card>
            <CardHeader title="How OAuth works" />
            <CardBody>
              <ol className="space-y-4">
                {OAUTH_STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lilac text-[12px] font-semibold text-violet-ink">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-medium text-ink">{title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Token lifetimes" />
            <CardBody>
              <dl className="divide-y divide-hairline text-[13.5px]">
                {TOKEN_LIFETIMES.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
                    <dt className="text-ink-muted">{label}</dt>
                    <dd className="font-medium tabular-nums text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
