import { Link } from "react-router-dom";
import { Building2, ShieldCheck, KeyRound, AppWindow, FileText, LifeBuoy, LogOut, Receipt, BarChart3 } from "lucide-react";
import { capitalize, formatDate, fullName, displayName } from "@/lib/format";
import { useApp } from "@/features/app-shell/useApp";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { StatusPill } from "@/components/app/StatusPill";
import { SectionTitle } from "@/components/app/Card";

function SettingsCard({ icon: Icon, title, description, to, href }) {
  const cls =
    "group flex items-start gap-4 rounded-xl border border-hairline bg-canvas p-5 shadow-card transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-px hover:border-hairline-strong hover:shadow-raised focus-ring";
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lilac text-violet-ink transition-colors group-hover:bg-lilac-strong">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="mt-1 block text-[13px] leading-5 text-ink-muted">{description}</span>
      </span>
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}

/** Settings - Plaid's card grid, pointing only at things that exist. */
export function SettingsPage() {
  const { user, signOut } = useApp();
  const name = fullName(user);
  const isDeveloper = Boolean(user?.isDeveloper);

  return (
    <div className="space-y-12">
      <PageHeader title="Settings" />

      <section aria-labelledby="profile-title">
        <SectionTitle id="profile-title">Profile</SectionTitle>
        <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet text-[22px] font-semibold text-white">
              {displayName(user)[0]?.toUpperCase() ?? "S"}
            </span>
            <dl className="grid flex-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-[12.5px] text-ink-muted">Name</dt>
                <dd className="mt-0.5 text-[14px] font-medium text-ink">{name}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[12.5px] text-ink-muted">Email</dt>
                <dd className="mt-0.5 truncate text-[14px] font-medium text-ink" title={user?.email}>
                  {user?.email ?? "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-[12.5px] text-ink-muted">Member since</dt>
                <dd className="mt-0.5 text-[14px] font-medium tabular-nums text-ink">
                  {user?.createdAt ? formatDate(user.createdAt) : "Not recorded"}
                </dd>
              </div>
              <div>
                <dt className="text-[12.5px] text-ink-muted">Access</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {user?.role && <StatusPill tone="neutral" dot={false}>{capitalize(user.role)}</StatusPill>}
                  <StatusPill tone={isDeveloper ? "violet" : "neutral"}>
                    {isDeveloper ? "Developer mode on" : "Developer mode off"}
                  </StatusPill>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="data-title">
        <SectionTitle id="data-title">Banking data</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard icon={Building2} title="Accounts" description="Add accounts, check their last statement and copy account IDs" to="/dashboard/accounts" />
          <SettingsCard icon={Receipt} title="Transactions" description="Browse and filter everything parsed from your statements" to="/dashboard/transactions" />
          <SettingsCard icon={ShieldCheck} title="Connected apps" description="See which apps can read your accounts and revoke access" to="/dashboard/connected-apps" />
          <SettingsCard icon={BarChart3} title="Insights" description="Money in, money out and balance across every account" to="/dashboard/insights" />
        </div>
      </section>

      <section aria-labelledby="dev-title">
        <SectionTitle id="dev-title">Developers</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard
            icon={KeyRound}
            title="Keys"
            description={isDeveloper ? "Your personal API key and OAuth client IDs" : "Turn on developer mode to get API keys"}
            to="/developer"
          />
          <SettingsCard icon={AppWindow} title="OAuth apps" description="Register apps other Setl users can authorise" to="/developer/apps" />
          <SettingsCard icon={FileText} title="API reference" description="Endpoints, scopes, token lifetimes and code samples" to="/developer/api" />
        </div>
      </section>

      <section aria-labelledby="session-title">
        <SectionTitle id="session-title">Help and session</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard icon={LifeBuoy} title="Get help" description="Talk to the Setl team about access, pricing or a problem" href="/#contact" />
          <div className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-canvas p-5 shadow-card">
            <span>
              <span className="block text-[15px] font-semibold text-ink">Sign out</span>
              <span className="mt-1 block text-[13px] text-ink-muted">End this session on this device</span>
            </span>
            <AppButton leadingIcon={LogOut} onClick={signOut}>
              Sign out
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
