import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OAuthConsentPage() {
  const [searchParams] = useSearchParams();
  const session = searchParams.get("session");
  const user = useAuthStore((state) => state.user);

  const [consentData, setConsentData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConsentInfo() {
      if (!session) {
        setError("This connection link is missing a session. Start again from the app.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/oauth/authorize", { params: { session } });
        setConsentData(data.data);
        setSelectedIds((data.data.accounts ?? []).map((account) => account.id));
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load authorization request.");
      } finally {
        setLoading(false);
      }
    }
    fetchConsentInfo();
  }, [session]);

  function toggleAccount(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleDecision(approved) {
    if (approved && selectedIds.length === 0) {
      toast.error("Select at least one account");
      return;
    }
    setSubmitting(true);
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
      toast.error(err?.response?.data?.message ?? "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-tertiary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-primary/95 p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="mb-2 text-xl font-semibold text-secondary">Authorization Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-tertiary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  const accounts = consentData.accounts ?? [];
  const canApprove = accounts.length > 0 && selectedIds.length > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 py-10">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-tertiary/5 blur-[80px]" />
        <div className="absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-tertiary/4 blur-[60px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-primary/95 p-8 shadow-lg backdrop-blur-sm border-tertiary/20"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tertiary/30 bg-tertiary/10">
            <ShieldCheck className="h-7 w-7 text-tertiary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-secondary">Authorize Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-secondary">{consentData.client_name}</span> is requesting access to accounts you choose
            </p>
          </div>
        </div>

        {user?.email && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span className="text-muted-foreground">
              Signed in as <span className="font-medium text-secondary">{user.email}</span>
            </span>
          </div>
        )}

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Permissions requested
          </p>
          <ul className="space-y-2">
            {consentData.scopes.map(({ scope: s, description }) => (
              <li key={s} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                <div>
                  <p className="text-sm font-medium text-secondary">{description}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{s}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Accounts to share
          </p>
          {accounts.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <p>Add an account in your Setl dashboard before connecting this app.</p>
              <Link to="/dashboard" className="mt-2 inline-flex text-sm font-medium text-tertiary hover:underline">
                Go to dashboard
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {accounts.map((account) => {
                const checked = selectedIds.includes(account.id);
                return (
                  <li key={account.id}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                        checked ? "border-tertiary/50 bg-tertiary/5" : "border-border/60 bg-muted/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccount(account.id)}
                        className="mt-1 accent-tertiary"
                      />
                      <span>
                        <span className="block text-sm font-medium text-secondary">{account.accountName}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {[account.bankName, account.accountType, account.mask].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mb-6 text-center text-xs text-muted-foreground">
          Access lasts {consentData.consent_days} days, until {formatDate(consentData.consent_expires_at)}. You can revoke it anytime from your Setl dashboard. Approving sends you to{" "}
          <span className="break-all font-mono text-secondary">{consentData.redirect_uri}</span>
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDecision(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-secondary disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Deny
          </button>
          <button
            type="button"
            disabled={submitting || !canApprove}
            onClick={() => handleDecision(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-tertiary px-4 py-3 text-sm font-medium text-white transition hover:bg-tertiary/90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Authorize
          </button>
        </div>
      </motion.div>
    </div>
  );
}
