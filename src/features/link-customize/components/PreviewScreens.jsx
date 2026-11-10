import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  EyeOff,
  FileText,
  FileUp,
  Info,
  Landmark,
  Lock,
  MessageCircle,
  MessageSquare,
  Search,
  ShieldCheck,
  UserRound,
  Receipt,
  Wallet,
} from "lucide-react";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/cn";
import { formatRs } from "@/lib/format";
import {
  ACCESS_PERIODS,
  ALL_INSTITUTIONS,
  DEFAULT_SETTINGS,
  DUMMY_STATEMENT,
  EXIT_REASONS,
  FEATURED_INSTITUTIONS,
  SCOPES,
  USE_CASES,
  dummyAccounts,
} from "../constants";
import { textOn } from "../color";

/* ---------- shared pieces ---------- */

function or(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function clientOf(settings) {
  return or(settings.consent.clientName, "This app");
}

function matchesType(inst, types) {
  if (types === "banks") return inst.type !== "wallet";
  if (types === "wallets") return inst.type === "wallet";
  return true;
}

function Body({ className, children }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:thin]", className)}>{children}</div>;
}

function Footer({ children }) {
  return <div className="shrink-0 space-y-2.5 border-t border-[#efeff3] bg-[#fafafb] px-6 pb-5 pt-4">{children}</div>;
}

function Title({ children, className }) {
  return <h2 className={cn("text-[21px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink", className)}>{children}</h2>;
}

function Lede({ children, className }) {
  return <p className={cn("mt-2 text-[13.5px] leading-[1.5] text-ink-muted", className)}>{children}</p>;
}

function AccentButton({ settings, onClick, disabled, children }) {
  const accent = settings.appearance.accent;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center rounded-full text-[15px] font-semibold transition-opacity hover:opacity-90 focus-ring disabled:opacity-40"
      style={{ background: accent, color: textOn(accent) }}
    >
      {children}
    </button>
  );
}

function QuietButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center justify-center rounded-full text-[14px] font-medium text-ink hover:bg-[#f0f0f3] focus-ring"
    >
      {children}
    </button>
  );
}

function ClientMark({ settings, size = "h-12 w-12 text-[18px]" }) {
  const accent = settings.appearance.accent;
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-2xl font-semibold", size)}
      style={{ background: accent, color: textOn(accent) }}
      aria-hidden
    >
      {clientOf(settings).slice(0, 1).toUpperCase()}
    </span>
  );
}

function SetlMark({ className = "h-12 w-12" }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-ink", className)} aria-hidden>
      <img src="/logo-mark.svg" alt="" className="h-3/5 w-3/5 brightness-0 invert" />
    </span>
  );
}

/* ---------- screens ---------- */

function ConsentScreen({ settings, go }) {
  const s = settings.consent;
  const client = clientOf(settings);
  const phrase = USE_CASES.find((u) => u.value === s.useCase)?.phrase ?? USE_CASES[0].phrase;
  return (
    <>
      <Body>
        <div className="mt-2 flex items-center">
          <ClientMark settings={settings} />
          <span className="-ml-2 rounded-[18px] ring-4 ring-white">
            <SetlMark />
          </span>
        </div>
        <Title className="mt-5">
          {client} uses Setl to {phrase}
        </Title>
        <ul className="mt-5 space-y-4">
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
            <span>
              <span className="block text-[14px] font-semibold text-ink">You choose what to share</span>
              <span className="mt-0.5 block text-[13px] leading-5 text-ink-muted">Only the accounts you pick reach {client}.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
            <span>
              <span className="block text-[14px] font-semibold text-ink">Your bank password stays with you</span>
              <span className="mt-0.5 block text-[13px] leading-5 text-ink-muted">Setl reads your statement. It never asks for your PIN or password.</span>
            </span>
          </li>
        </ul>
        {s.askPhone && (
          <div className="mt-6">
            <div className="flex h-12 items-center gap-2 rounded-xl border border-hairline-strong px-3.5">
              <span aria-hidden className="text-[18px] leading-none">🇵🇰</span>
              <span className="text-[15px] font-medium text-ink">+92</span>
              <span className="text-[15px] text-ink-subtle">3XX XXXXXXX</span>
            </div>
            <p className="mt-2 text-[12px] leading-[1.45] text-ink-muted">
              Use your mobile number to sign in to Setl, so connecting is faster next time.
            </p>
          </div>
        )}
      </Body>
      <Footer>
        <p className="text-[11.5px] leading-[1.45] text-ink-muted">
          By continuing, you agree to Setl&apos;s <span className="underline">Privacy Policy</span> and to share the
          data you approve with {client}.
        </p>
        <AccentButton settings={settings} onClick={() => go(s.askPhone ? "otp" : "institutionSelect")}>
          {or(s.button, DEFAULT_SETTINGS.consent.button)}
        </AccentButton>
        {s.askPhone && <QuietButton onClick={() => go("institutionSelect")}>Continue without mobile number</QuietButton>}
      </Footer>
    </>
  );
}

function OtpScreen({ settings, go }) {
  const s = settings.otp;
  const length = Number(s.length) === 4 ? 4 : 6;
  const filled = ["4", "8"];
  const Channel = s.channel === "whatsapp" ? MessageCircle : MessageSquare;
  return (
    <>
      <Body>
        <span className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-sunken text-ink" aria-hidden>
          <Channel className="h-6 w-6" />
        </span>
        <Title className="mt-5">Enter the code we sent you</Title>
        <Lede>
          We sent a {length}-digit code by {s.channel === "whatsapp" ? "WhatsApp" : "SMS"} to{" "}
          <span className="font-medium text-ink">+92 300 ••• 4521</span>.
        </Lede>
        <div className="mt-6 flex gap-2" aria-hidden>
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              className={cn(
                "flex h-12 flex-1 items-center justify-center rounded-xl border text-[20px] font-semibold text-ink",
                i === filled.length ? "border-ink" : "border-hairline-strong"
              )}
            >
              {filled[i] ?? ""}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-ink-muted">
          Resend code in{" "}
          <span className="tabular-nums font-medium text-ink">
            {Math.floor(s.resendSeconds / 60)}:{String(s.resendSeconds % 60).padStart(2, "0")}
          </span>
        </p>
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("institutionSelect")}>
          Verify
        </AccentButton>
      </Footer>
    </>
  );
}

function InstitutionTile({ inst, layout, onPick }) {
  if (layout === "list") {
    return (
      <button
        type="button"
        onClick={onPick}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sunken focus-ring"
      >
        <BankLogo bankName={inst.name} className="h-9 w-9 rounded-lg" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">{inst.name}</span>
          <span className="block text-[12px] text-ink-muted">{inst.type === "wallet" ? "Mobile wallet" : "Bank"}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-ink-subtle" aria-hidden />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex h-[84px] flex-col items-center justify-center gap-1.5 rounded-xl border border-hairline bg-canvas px-2 hover:border-hairline-strong hover:bg-sunken focus-ring"
    >
      <BankLogo bankName={inst.name} className="h-9 w-9 rounded-lg" />
      <span className="max-w-full truncate text-[12.5px] font-medium text-ink">{inst.name}</span>
    </button>
  );
}

function InstitutionSelectScreen({ settings, go, setInstitution }) {
  const s = settings.institutionSelect;
  const list = FEATURED_INSTITUTIONS.filter((i) => matchesType(i, s.types));
  return (
    <>
      <Body>
        <Title className="mt-2">{or(s.title, DEFAULT_SETTINGS.institutionSelect.title)}</Title>
        <button
          type="button"
          onClick={() => go("institutionSearch")}
          className="mt-4 flex h-11 w-full items-center gap-2.5 rounded-xl border border-hairline-strong px-3.5 text-left text-[14px] text-ink-subtle hover:border-ink/25 focus-ring"
        >
          <Search className="h-4 w-4" aria-hidden />
          {or(settings.institutionSearch.placeholder, DEFAULT_SETTINGS.institutionSearch.placeholder)}
        </button>
        <div className={cn("mt-4", s.layout === "list" ? "space-y-0.5" : "grid grid-cols-2 gap-2")}>
          {list.map((inst) => (
            <InstitutionTile
              key={inst.name}
              inst={inst}
              layout={s.layout}
              onPick={() => {
                setInstitution(inst);
                go("dataTransparency");
              }}
            />
          ))}
        </div>
      </Body>
    </>
  );
}

function InstitutionSearchScreen({ settings, go, setInstitution, interactive }) {
  const s = settings.institutionSearch;
  const [query, setQuery] = useState("bank");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_INSTITUTIONS.filter(
      (i) => matchesType(i, settings.institutionSelect.types) && (!q || i.name.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, settings.institutionSelect.types]);

  return (
    <>
      <Body>
        <div className="mt-2 flex h-11 items-center gap-2.5 rounded-xl border border-ink px-3.5">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={or(s.placeholder, DEFAULT_SETTINGS.institutionSearch.placeholder)}
            aria-label="Search institutions"
            tabIndex={interactive ? 0 : -1}
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-subtle focus:outline-none"
          />
        </div>
        {results.length > 0 ? (
          <ul className="mt-3 space-y-0.5">
            {results.map((inst) => (
              <li key={inst.name}>
                <InstitutionTile
                  inst={inst}
                  layout="list"
                  onPick={() => {
                    setInstitution(inst);
                    go("dataTransparency");
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-[15px] font-semibold text-ink">No results for “{query.trim()}”</p>
            <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">Check the spelling, or try the bank&apos;s short name, like HBL or MCB.</p>
          </div>
        )}
      </Body>
      {s.offerUpload && (
        <Footer>
          <button
            type="button"
            onClick={() => go("statementUpload")}
            className="flex w-full items-center gap-3 rounded-xl text-left focus-ring"
          >
            <FileText className="h-5 w-5 shrink-0 text-ink" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-semibold text-ink">Can&apos;t find your bank?</span>
              <span className="block text-[12.5px] text-ink-muted">Upload a statement instead</span>
            </span>
            <ChevronRight className="h-4 w-4 text-ink-subtle" aria-hidden />
          </button>
        </Footer>
      )}
    </>
  );
}

const SCOPE_ICONS = { accounts: Landmark, balances: Wallet, transactions: Receipt, identity: UserRound };

function accessLine(days) {
  if (!days) return "Access lasts until you revoke it.";
  const until = new Date(Date.now() + days * 86_400_000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const label = ACCESS_PERIODS.find((p) => p.value === days)?.label ?? `${days} days`;
  return `Access lasts ${label}, until ${until}.`;
}

function DataTransparencyScreen({ settings, go, institution, scopes }) {
  const s = settings.dataTransparency;
  const client = clientOf(settings);
  const enabled = SCOPES.filter((sc) => scopes.includes(sc.id));
  return (
    <>
      <Body>
        <div className="mt-2 flex items-center">
          <BankLogo bankName={institution.name} className="h-12 w-12 rounded-2xl" />
          <span className="-ml-2 rounded-[18px] ring-4 ring-white">
            <SetlMark />
          </span>
        </div>
        <Title className="mt-5">{client} would like to see</Title>
        <Lede>
          {client} uses this to {or(s.purpose, DEFAULT_SETTINGS.dataTransparency.purpose)}.
        </Lede>
        <ul className="mt-5 divide-y divide-[#efeff3] rounded-xl border border-hairline">
          {enabled.map((sc) => {
            const Icon = SCOPE_ICONS[sc.id];
            return (
              <li key={sc.id} className="flex gap-3 px-3.5 py-3">
                <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink" aria-hidden />
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink">{sc.label}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-ink-muted">{sc.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex gap-2 text-[12.5px] leading-[1.45] text-ink-muted">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{accessLine(Number(s.accessDays))} You can revoke it any time from your Setl account.</span>
        </p>
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("statementUpload")}>
          Allow
        </AccentButton>
        <QuietButton onClick={() => go("exit")}>Not now</QuietButton>
      </Footer>
    </>
  );
}

function StatementUploadScreen({ settings, go, institution }) {
  const s = settings.statementUpload;
  const formats = s.allowImages ? "PDF, JPG or PNG" : "PDF";
  return (
    <>
      <Body>
        <BankLogo bankName={institution.name} className="mt-2 h-12 w-12 rounded-2xl" />
        <Title className="mt-5">{or(s.title, DEFAULT_SETTINGS.statementUpload.title)}</Title>
        <Lede>
          Download your last {s.months} {Number(s.months) === 1 ? "month" : "months"} from {institution.app ?? `${institution.name}'s app`}{" "}
          or use the e-statement {institution.name} emails you.
        </Lede>
        <div className="mt-5 flex flex-col items-center rounded-xl border-[1.5px] border-dashed border-hairline-strong bg-[#fafafb] px-4 py-6 text-center">
          <FileUp className="h-6 w-6 text-ink" aria-hidden />
          <p className="mt-2 text-[14px] font-semibold text-ink">Choose a file</p>
          <p className="mt-0.5 text-[12px] text-ink-muted">{formats}, up to 10 MB</p>
        </div>
        <div className="mt-4 rounded-xl bg-sunken px-3.5 py-3 text-[12.5px] leading-[1.5] text-ink-muted">
          <p>
            <span className="font-semibold text-ink">A statement is</span> the monthly file from your bank, showing your
            name, account number and transactions.
          </p>
          <p className="mt-1.5">
            <span className="font-semibold text-ink">It is not</span> a screenshot of your balance or a single receipt.
          </p>
        </div>
        {s.allowLocked && (
          <p className="mt-3 flex gap-2 text-[12.5px] leading-[1.45] text-ink-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Password-protected PDF? We&apos;ll ask for the password next.
          </p>
        )}
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("statementReview")}>
          Upload statement
        </AccentButton>
      </Footer>
    </>
  );
}

function StatementReviewScreen({ settings, go, institution }) {
  const s = settings.statementReview;
  const st = DUMMY_STATEMENT;
  return (
    <>
      <Body>
        <Title className="mt-2">Check your statement</Title>
        <Lede>
          From your {institution.name} statement, {st.period}.
        </Lede>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline">
          {[
            ["Transactions", st.transactionCount],
            ["Pages", st.pages],
            ["Opening balance", formatRs(st.opening)],
            ["Closing balance", formatRs(st.closing)],
          ].map(([k, v]) => (
            <div key={k} className="bg-canvas px-3.5 py-2.5">
              <dt className="text-[11.5px] text-ink-muted">{k}</dt>
              <dd className="mt-0.5 text-[14px] font-semibold tabular-nums text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        {s.showTransactions && (
          <>
            <h3 className="mt-5 text-[12.5px] font-semibold text-ink">Latest transactions</h3>
            <ul className="mt-1.5 divide-y divide-[#efeff3]">
              {st.rows.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] text-ink">{r.label}</span>
                    <span className="block text-[11.5px] text-ink-muted">{r.date}</span>
                  </span>
                  <span className={cn("shrink-0 text-[13px] font-medium tabular-nums", r.amount > 0 ? "text-positive" : "text-ink")}>
                    {formatRs(r.amount, { signed: true })}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("accountSelect")}>
          {or(s.button, DEFAULT_SETTINGS.statementReview.button)}
        </AccentButton>
        <QuietButton onClick={() => go("statementUpload")}>Upload a different statement</QuietButton>
      </Footer>
    </>
  );
}

function money(account) {
  if (account.currency === "USD") return `$${account.balance.toLocaleString("en-US")}`;
  return formatRs(account.balance);
}

function AccountSelectScreen({ settings, go, institution }) {
  const mode = settings.accountSelect.mode;
  const client = clientOf(settings);
  const accounts = useMemo(() => dummyAccounts(institution), [institution]);
  const [picked, setPicked] = useState(() => [accounts[0].id]);
  const selected = mode === "all" ? accounts.map((a) => a.id) : picked.filter((id) => accounts.some((a) => a.id === id));

  function toggle(id) {
    if (mode === "all") return;
    if (mode === "single") setPicked([id]);
    else setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const lede =
    mode === "all"
      ? `${client} needs access to all of these ${institution.name} accounts.`
      : mode === "single"
        ? `Choose the account ${client} can use.`
        : `Choose the accounts ${client} can see.`;

  return (
    <>
      <Body>
        <Title className="mt-2">Your accounts</Title>
        <Lede>{lede}</Lede>
        <ul className="mt-5 space-y-2">
          {accounts.map((a) => {
            const on = selected.includes(a.id);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => toggle(a.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-ring",
                    on ? "border-ink" : "border-hairline hover:border-hairline-strong",
                    mode === "all" && "cursor-default"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border",
                      mode === "single" ? "rounded-full" : "rounded-[5px]",
                      on ? "border-ink bg-ink" : "border-hairline-strong",
                      mode === "all" && "opacity-60"
                    )}
                  >
                    {on && (mode === "single" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <Check className="h-3 w-3 text-white" />)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-ink">{a.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                      <BankLogo bankName={institution.name} className="h-4 w-4 rounded" />
                      <span className="truncate">{a.mask}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[13px] font-medium tabular-nums text-ink">{money(a)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Body>
      <Footer>
        <AccentButton settings={settings} disabled={selected.length === 0} onClick={() => go("success")}>
          Continue
        </AccentButton>
      </Footer>
    </>
  );
}

function SuccessScreen({ settings, go, institution }) {
  const s = settings.success;
  const client = clientOf(settings);
  const days = Number(settings.dataTransparency.accessDays);
  const accent = settings.appearance.accent;
  return (
    <>
      <Body className="flex flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: accent, color: textOn(accent) }} aria-hidden>
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </span>
        <Title className="mt-6">{or(s.title, DEFAULT_SETTINGS.success.title)}</Title>
        <Lede className="max-w-[250px]">
          Your {institution.name} account is now shared with {client}.
        </Lede>
        <p className="mt-6 text-[12px] leading-[1.45] text-ink-muted">
          {days ? `Access ends in ${days} days.` : "Access lasts until you revoke it."} Manage it any time in your Setl account.
        </p>
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("consent")}>
          {or(s.button, DEFAULT_SETTINGS.success.button)}
        </AccentButton>
      </Footer>
    </>
  );
}

function errorCopy(kind, institution, client, offerUpload) {
  switch (kind) {
    case "unreadable":
      return {
        title: "We couldn't read this statement",
        body: `Upload the original file from ${institution.name}. Photos, scans and edited files can't be read.`,
        primary: ["Try another file", "statementUpload"],
      };
    case "password":
      return {
        title: "That password didn't open the file",
        body: "Check the email your statement came with. It usually says what the password is.",
        primary: ["Try again", "statementUpload"],
      };
    case "expired":
      return {
        title: "This session has expired",
        body: `For your security, start again from ${client}.`,
        primary: [`Back to ${client}`, "consent"],
      };
    default:
      return {
        title: `${institution.name} sign-in isn't available yet`,
        body: offerUpload
          ? `You can still connect ${institution.name} by uploading a statement.`
          : "Try again later, or choose another bank or wallet.",
        primary: offerUpload ? ["Upload a statement instead", "statementUpload"] : ["Choose another bank", "institutionSelect"],
        secondary: offerUpload ? ["Choose another bank", "institutionSelect"] : null,
      };
  }
}

function ErrorScreen({ settings, go, institution, errorKind }) {
  const s = settings.error;
  const copy = errorCopy(errorKind, institution, clientOf(settings), s.offerUpload);
  return (
    <>
      <Body className="flex flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-negative-soft text-negative" aria-hidden>
          <AlertTriangle className="h-7 w-7" />
        </span>
        <Title className="mt-6">{copy.title}</Title>
        <Lede className="max-w-[260px]">{copy.body}</Lede>
        {or(s.support, "") && (
          <p className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-muted">
            <Info className="h-3.5 w-3.5" aria-hidden />
            Need help? <span className="font-medium text-ink">{s.support.trim()}</span>
          </p>
        )}
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go(copy.primary[1])}>
          {copy.primary[0]}
        </AccentButton>
        {copy.secondary && <QuietButton onClick={() => go(copy.secondary[1])}>{copy.secondary[0]}</QuietButton>}
      </Footer>
    </>
  );
}

function ExitScreen({ settings, go, interactive }) {
  const s = settings.exit;
  const client = clientOf(settings);
  const [reason, setReason] = useState(EXIT_REASONS[0]);
  return (
    <>
      <Body>
        <Title className="mt-2">{or(s.title, DEFAULT_SETTINGS.exit.title)}</Title>
        <Lede>Your progress won&apos;t be saved, and {client} won&apos;t receive any of your data.</Lede>
        {s.askReason && (
          <fieldset className="mt-5">
            <legend className="text-[13px] font-semibold text-ink">Why are you leaving?</legend>
            <div className="mt-2 space-y-1.5">
              {EXIT_REASONS.map((r) => (
                <label
                  key={r}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13.5px] text-ink",
                    reason === r ? "border-ink" : "border-hairline"
                  )}
                >
                  <input
                    type="radio"
                    name="exit-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    tabIndex={interactive ? undefined : -1}
                    className="accent-[#141414]"
                  />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </Body>
      <Footer>
        <AccentButton settings={settings} onClick={() => go("consent")}>
          Keep connecting
        </AccentButton>
        <QuietButton onClick={() => go("consent")}>Exit</QuietButton>
      </Footer>
    </>
  );
}

const SCREEN_COMPONENTS = {
  consent: ConsentScreen,
  otp: OtpScreen,
  institutionSelect: InstitutionSelectScreen,
  institutionSearch: InstitutionSearchScreen,
  dataTransparency: DataTransparencyScreen,
  statementUpload: StatementUploadScreen,
  statementReview: StatementReviewScreen,
  accountSelect: AccountSelectScreen,
  success: SuccessScreen,
  error: ErrorScreen,
  exit: ExitScreen,
};

/** Renders one screen's body and footer by id. */
export function PreviewScreen({ id, ...props }) {
  const Screen = SCREEN_COMPONENTS[id];
  return Screen ? <Screen {...props} /> : null;
}
