import { Link } from "react-router-dom";
import { ChevronRight, Plus, Upload, AppWindow, Search, BookOpen, FileText, BarChart3, ArrowUpRight, KeyRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { CopyField } from "@/components/app/CopyField";
import { AppButton } from "@/components/app/AppButton";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";

const railCard = "rounded-2xl border border-hairline bg-canvas shadow-card";

function RailHeading({ children }) {
  return <h3 className="mb-3 mt-9 text-[19px] font-semibold tracking-[-0.01em] text-ink">{children}</h3>;
}

/** Plaid's "Talk to sales" row with the gradient rule on top. */
function TalkToTeam() {
  return (
    <a
      href="/#contact"
      className={cn(
        railCard,
        "group relative flex items-center justify-between overflow-hidden px-5 py-4 transition-shadow hover:shadow-raised focus-ring"
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#542774,#8e3a83_35%,#c44fa3_60%,#a78bfa_85%,#c4b5fd)]"
        aria-hidden
      />
      <span>
        <span className="block text-[15px] font-semibold text-ink">Talk to the team</span>
        <span className="mt-0.5 block text-[13px] text-ink-muted">Production access, pricing and new banks</span>
      </span>
      <ChevronRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
    </a>
  );
}

function Credentials({ isDeveloper, devStatus, apiKey, apps }) {
  return (
    <section aria-labelledby="credentials-title" className={cn(railCard, "p-5")}>
      <div className="flex items-center justify-between gap-3">
        <h3 id="credentials-title" className="text-[15px] font-semibold text-ink">
          API credentials
        </h3>
        {isDeveloper && (
          <Link to="/developer" className="rounded text-[13px] font-medium text-violet-ink hover:underline focus-ring">
            Manage
          </Link>
        )}
      </div>

      {!isDeveloper ? (
        <>
          <p className="mt-2 text-[13px] leading-5 text-ink-muted">
            Turn on developer mode to get a personal API key and register OAuth apps.
          </p>
          <AppButton to="/developer" variant="primary" size="sm" className="mt-4" leadingIcon={KeyRound}>
            Turn on developer mode
          </AppButton>
        </>
      ) : devStatus === "loading" ? (
        <div className="mt-4 space-y-3">
          <SkeletonBlock className="h-[58px] w-full rounded-lg" />
          <SkeletonBlock className="h-[58px] w-full rounded-lg" />
        </div>
      ) : devStatus === "error" ? (
        <p className="mt-2 text-[13px] text-negative" role="alert">
          Couldn&apos;t load your credentials. Open Keys to try again.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {apps[0] && <CopyField label={`Client ID · ${apps[0].name}`} value={apps[0].client_id} />}
          {apiKey?.apiKey ? (
            <>
              <CopyField label="Personal API key" value={apiKey.apiKey} secret />
              {apiKey.expiresAt && (
                <p className="text-[12px] text-ink-muted">Key expires {formatDate(apiKey.expiresAt)}</p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-hairline-strong px-4 py-3">
              <p className="text-[13px] text-ink-muted">No personal API key yet.</p>
              <Link to="/developer" className="mt-1 inline-block rounded text-[13px] font-medium text-violet-ink hover:underline focus-ring">
                Generate a key
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ToolButton({ icon: Icon, label, onClick, to }) {
  const cls = cn(
    railCard,
    "flex items-center gap-2.5 px-3 py-2.5 text-left text-[13.5px] font-medium text-ink transition-[box-shadow,border-color] hover:border-hairline-strong hover:shadow-raised focus-ring"
  );
  const inner = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lilac text-violet-ink">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      {label}
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function GettingStarted({ isDeveloper, devStatus, apiKey, apps, onAddAccount, onUpload, onOpenCommand }) {
  return (
    <aside aria-labelledby="getting-started-title">
      <h2 id="getting-started-title" className="mb-4 text-[19px] font-semibold tracking-[-0.01em] text-ink">
        Getting started
      </h2>
      <div className="space-y-4">
        <TalkToTeam />
        <Credentials isDeveloper={isDeveloper} devStatus={devStatus} apiKey={apiKey} apps={apps} />
      </div>

      <RailHeading>Tools</RailHeading>
      <div className="grid grid-cols-2 gap-2.5">
        <ToolButton icon={Plus} label="Add account" onClick={onAddAccount} />
        <ToolButton icon={Upload} label="Upload statement" onClick={onUpload} />
        <ToolButton icon={AppWindow} label="New OAuth app" to="/developer/apps" />
        <ToolButton icon={Search} label="Search  ⌘K" onClick={onOpenCommand} />
      </div>

      <RailHeading>Resources</RailHeading>
      <div className="flex flex-wrap gap-2.5">
        <a
          href="/developers"
          target="_blank"
          rel="noreferrer"
          className={cn(railCard, "inline-flex items-center gap-2 px-3 py-2.5 text-[13.5px] font-medium text-ink hover:shadow-raised focus-ring")}
        >
          <BookOpen className="h-4 w-4 text-violet-ink" aria-hidden />
          View docs
          <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <Link
          to="/developer/api"
          className={cn(railCard, "inline-flex items-center gap-2 px-3 py-2.5 text-[13.5px] font-medium text-ink hover:shadow-raised focus-ring")}
        >
          <FileText className="h-4 w-4 text-violet-ink" aria-hidden />
          API reference
        </Link>
        <Link
          to="/dashboard/insights"
          className={cn(railCard, "inline-flex items-center gap-2 px-3 py-2.5 text-[13.5px] font-medium text-ink hover:shadow-raised focus-ring")}
        >
          <BarChart3 className="h-4 w-4 text-violet-ink" aria-hidden />
          Insights
        </Link>
      </div>
    </aside>
  );
}
