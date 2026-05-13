import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";

export function OAuthConsentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope") ?? "";
  const state = searchParams.get("state") ?? "";
  const responseType = searchParams.get("response_type");

  const [consentData, setConsentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConsentInfo() {
      if (!clientId || !redirectUri || responseType !== "code") {
        setError("Invalid authorization request. Missing or incorrect parameters.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/oauth/authorize", {
          params: { response_type: responseType, client_id: clientId, redirect_uri: redirectUri, scope, state },
        });
        setConsentData(data.data);
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load authorization request.");
      } finally {
        setLoading(false);
      }
    }
    fetchConsentInfo();
  }, [clientId, redirectUri, scope, state, responseType]);

  async function handleDecision(approved) {
    setSubmitting(true);
    try {
      const { data } = await api.post("/oauth/authorize", {
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        approved,
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
              <span className="font-medium text-secondary">{consentData.client_name}</span> is requesting access to your Setl account
            </p>
          </div>
        </div>

        {user && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
            <span className="text-muted-foreground">
              Signed in as <span className="font-medium text-secondary">{user.email}</span>
            </span>
          </div>
        )}

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Permissions requested
          </p>
          <ul className="space-y-2">
            {consentData.scopes.map(({ scope: s, description }) => (
              <li key={s} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                <div>
                  <p className="text-sm font-medium text-secondary">{description}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{s}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-6 text-xs text-muted-foreground text-center">
          Authorizing will redirect you to{" "}
          <span className="font-mono text-secondary break-all">{redirectUri}</span>
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
            disabled={submitting}
            onClick={() => handleDecision(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-tertiary px-4 py-3 text-sm font-medium text-white transition hover:bg-tertiary/90 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Authorize
          </button>
        </div>
      </motion.div>
    </div>
  );
}
