import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, ArrowLeftRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";
import { AppButton } from "@/components/app/AppButton";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";
import { BankLogo } from "@/components/ui/BankLogo";

/** Lilac stage with a centred white sheet: the same frame as the marketing connect sheet. */
function Stage({ children }) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center bg-[radial-gradient(90%_70%_at_50%_0%,#ece4fa_0%,#f3eef9_45%,#faf8fd_100%)] px-4 py-10">
      <main className="w-full max-w-[440px] rounded-[24px] border border-hairline bg-canvas shadow-popover motion-safe:animate-[dialog-rise_260ms_cubic-bezier(0.2,0.8,0.2,1)]">
        {children}
      </main>
    </div>
  );
}

/** OAuthConsentPage - End-user approval sheet for a third-party app (Setl Connect). */
export function OAuthConsentPage() {
  const [searchParams] = useSearchParams();
  const session = searchParams.get("session");
  const user = useAuthStore((state) => state.user);

  const [consentData, setConsentData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); // "allow" | "deny" | null
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Connect your accounts · Setl";
    async function fetchConsentInfo() {
      if (!session) {
        setError("This connection link is missing its session. Go back to the app and start again.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/oauth/authorize", { params: { session } });
        setConsentData(data.data);
        setSelectedIds((data.data.accounts ?? []).map((account) => account.id));
      } catch (err) {
        setError(err?.response?.data?.message ?? "This connection request couldn't be loaded. It may have expired.");
      } finally {
        setLoading(false);
      }
    }
    fetchConsentInfo();
  }, [session]);

  function toggleAccount(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function handleDecision(approved) {
    if (approved && selectedIds.length === 0) {
      toast.error("Choose at least one account to share");
      return;
    }
    setSubmitting(approved ? "allow" : "deny");
    try {
      const { data } = await api.post("/oauth/authorize", {
        session,
        approved,
        account_ids: approved ? selectedIds : [],
      });
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "That didn't go through. Try again.");
      setSubmitting(null);
    }
  }

  if (loading) {
    return (
      <Stage>
        <div className="space-y-5 p-7" aria-busy="true">
          <span role="status" className="sr-only">Loading the connection request</span>
          <SkeletonBlock className="mx-auto h-12 w-32 rounded-full" />
          <SkeletonBlock className="mx-auto h-5 w-56" />
          <SkeletonBlock className="h-24 w-full rounded-xl" />
          <SkeletonBlock className="h-32 w-full rounded-xl" />
          <SkeletonBlock className="h-11 w-full rounded-lg" />
        </div>
      </Stage>
    );
  }

  if (error) {
    return (
      <Stage>
        <div className="p-8 text-center" role="alert">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-negative-soft text-negative">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-[20px] font-semibold tracking-[-0.01em] text-ink">This link can&apos;t be used</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{error}</p>
          <AppButton to="/dashboard" className="mt-6" leadingIcon={ArrowLeft}>
            Go to your Setl dashboard
          </AppButton>
        </div>
      </Stage>
    );
  }

  const accounts = consentData.accounts ?? [];
  const canApprove = accounts.length > 0 && selectedIds.length > 0;
  const appName = consentData.client_name;

  return (
    <Stage>
      <div className="px-7 pb-2 pt-8">
        <div className="flex items-center justify-center gap-3" aria-hidden>
          <img src="/logo-mark.svg" alt="" className="h-12 w-12" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunken text-ink-muted">
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[18px] font-semibold text-white">
            {appName?.[0]?.toUpperCase() ?? "A"}
          </span>
        </div>
        <h1 className="mt-5 text-center text-[21px] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {appName} wants to read your accounts
        </h1>
        {user?.email && (
          <p className="mt-1.5 text-center text-[13px] text-ink-muted">
            Signed in as <span className="font-medium text-ink">{user.email}</span>
          </p>
        )}
      </div>

      <section aria-labelledby="perm-title" className="px-7 pt-6">
        <h2 id="perm-title" className="text-[13px] font-medium text-ink-muted">
          {appName} will be able to
        </h2>
        <ul className="mt-2 divide-y divide-hairline rounded-xl border border-hairline">
          {consentData.scopes.map(({ scope: s, description }) => (
            <li key={s} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lilac text-violet-ink">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              <span>
                <span className="block text-[14px] font-medium text-ink">{description}</span>
                <code className="mt-0.5 block font-mono text-[11.5px] text-ink-subtle">{s}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <fieldset className="px-7 pt-6">
        <legend className="text-[13px] font-medium text-ink-muted">Accounts to share</legend>
        {accounts.length === 0 ? (
          <div className="mt-2 rounded-xl border border-dashed border-hairline-strong px-4 py-4 text-[13.5px] text-ink-muted">
            <p>You don&apos;t have any accounts in Setl yet. Add one, then come back to this link.</p>
            <Link to="/dashboard/accounts" className="mt-2 inline-block rounded font-medium text-violet-ink hover:underline focus-ring">
              Add an account
            </Link>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {accounts.map((account) => {
              const checked = selectedIds.includes(account.id);
              return (
                <li key={account.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet",
                      checked ? "border-violet/45 bg-lilac" : "border-hairline hover:bg-sunken"
                    )}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleAccount(account.id)} className="sr-only" />
                    <BankLogo bankName={account.bankName} className="h-9 w-9 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">{account.accountName}</span>
                      <span className="block text-[12.5px] text-ink-muted">
                        {[account.bankName, account.accountType, account.mask].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        checked ? "border-violet bg-violet text-white" : "border-hairline-strong bg-canvas"
                      )}
                      aria-hidden
                    >
                      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      <div className="px-7 pb-7 pt-6">
        <p className="flex items-start gap-2 rounded-lg bg-sunken px-3.5 py-3 text-[12.5px] leading-5 text-ink-muted">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Access lasts {consentData.consent_days} days, until {formatDate(consentData.consent_expires_at)}. Revoke it any
            time from Connected apps in Setl. Afterwards you&apos;ll return to{" "}
            <span className="break-all font-mono text-ink">{consentData.redirect_uri}</span>.
          </span>
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <AppButton
            variant="primary"
            className="h-11 w-full"
            leadingIcon={ShieldCheck}
            loading={submitting === "allow"}
            disabled={Boolean(submitting) || !canApprove}
            onClick={() => handleDecision(true)}
          >
            Allow {selectedIds.length > 0 ? `${selectedIds.length} ${selectedIds.length === 1 ? "account" : "accounts"}` : ""}
          </AppButton>
          <AppButton
            variant="ghost"
            className="h-11 w-full"
            loading={submitting === "deny"}
            disabled={Boolean(submitting)}
            onClick={() => handleDecision(false)}
          >
            Deny
          </AppButton>
        </div>
      </div>
    </Stage>
  );
}
