import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Copy, LayoutDashboard, LogOut, Code2,
  ShieldCheck, Loader2, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  Key, RefreshCw, Terminal, FileSpreadsheet, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

const ALL_SCOPES = [
  { value: "transactions:read", label: "Transactions", description: "View the user's transaction history" },
  { value: "accounts:read",     label: "Accounts",     description: "View the user's connected bank accounts" },
  { value: "profile:read",      label: "Profile",      description: "View the user's profile information" },
  { value: "dashboard:read",    label: "Dashboard",    description: "View financial dashboard and reports" },
];

const EXTERNAL_API_BASE =
  import.meta.env.VITE_EXTERNAL_API_BASE_URL ||
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1").replace(
    /\/api\/v1$/,
    "/api/external/v1"
  );

function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Failed to copy")
  );
}

// ── Create App Modal ────────────────────────────────────────────────────────

function CreateAppModal({ open, onOpenChange, onCreated }) {
  const [name, setName] = useState("");
  const [uris, setUris] = useState("");
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setUris("");
    setSelectedScopes([]);
  }

  function toggleScope(scope) {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const redirectUris = uris
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (!name.trim()) { toast.error("App name is required"); return; }
    if (redirectUris.length === 0) { toast.error("At least one redirect URI is required"); return; }
    if (selectedScopes.length === 0) { toast.error("Select at least one scope"); return; }

    setSubmitting(true);
    try {
      const { data } = await api.post("/oauth/clients", {
        name: name.trim(),
        redirect_uris: redirectUris,
        scopes: selectedScopes,
      });
      onCreated(data.data);
      onOpenChange(false);
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to create app");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-muted-foreground" />
            Create new app
          </DialogTitle>
          <DialogDescription>
            Register an OAuth app to let your users connect their Setl account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary">
              App name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Finance App"
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-secondary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>

          {/* Redirect URIs */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary">
              Redirect URIs <span className="text-muted-foreground font-normal">(one per line)</span>
            </label>
            <textarea
              value={uris}
              onChange={(e) => setUris(e.target.value)}
              placeholder="https://yourapp.com/callback"
              rows={3}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-mono text-secondary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
            />
          </div>

          {/* Scopes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-secondary">
              Scopes
            </label>
            <div className="space-y-2">
              {ALL_SCOPES.map(({ value, label, description }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                    selectedScopes.includes(value)
                      ? "border-tertiary/50 bg-tertiary/5"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(value)}
                    onChange={() => toggleScope(value)}
                    className="mt-0.5 accent-tertiary"
                  />
                  <div>
                    <p className="text-sm font-medium text-secondary">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{value}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { reset(); onOpenChange(false); }}
              className="flex-1 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create app
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Credentials Modal ────────────────────────────────────────────────────────

function CredentialsModal({ open, onOpenChange, credentials }) {
  const [secretVisible, setSecretVisible] = useState(false);

  if (!credentials) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            App created
          </DialogTitle>
          <DialogDescription>
            Save your client secret now — it will not be shown again.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            Copy your client secret now. Once you close this dialog it cannot be retrieved.
          </div>

          {/* Client ID */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Client ID
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-mono text-secondary">
                {credentials.client_id}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.client_id, "Client ID")}
                className="shrink-0 rounded-lg border border-border bg-muted/30 p-2.5 transition hover:bg-muted/60"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Client Secret
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-mono text-secondary">
                {secretVisible ? credentials.client_secret : "••••••••••••••••••••••••••••••••"}
              </code>
              <button
                type="button"
                onClick={() => setSecretVisible((v) => !v)}
                className="shrink-0 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/60"
              >
                {secretVisible ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.client_secret, "Client secret")}
                className="shrink-0 rounded-lg border border-border bg-muted/30 p-2.5 transition hover:bg-muted/60"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-lg bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── App Card ────────────────────────────────────────────────────────────────

function AppCard({ app, onDelete }) {
  const [urisExpanded, setUrisExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${app.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/oauth/clients/mine/${app.client_id}`);
      onDelete(app.client_id);
      toast.success("App deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete app");
      setDeleting(false);
    }
  }

  const createdDate = new Date(app.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/10">
              <Code2 className="h-4 w-4 text-tertiary" />
            </div>
            <h3 className="truncate font-semibold text-secondary">{app.name}</h3>
            {app.is_active ? (
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Active
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                Inactive
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Created {createdDate}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
          title="Delete app"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {/* Client ID */}
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Client ID
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-border bg-muted/40 px-2.5 py-1.5 text-xs font-mono text-secondary">
              {app.client_id}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(app.client_id, "Client ID")}
              className="shrink-0 rounded border border-border bg-muted/30 p-1.5 transition hover:bg-muted/60"
            >
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Scopes */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Scopes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {app.scopes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-tertiary/30 bg-tertiary/8 px-2.5 py-0.5 font-mono text-xs text-tertiary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Redirect URIs */}
        <div>
          <button
            type="button"
            onClick={() => setUrisExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-secondary"
          >
            Redirect URIs
            {urisExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {urisExpanded && (
            <ul className="mt-1.5 space-y-1">
              {app.redirect_uris.map((uri) => (
                <li key={uri} className="truncate rounded border border-border bg-muted/30 px-2.5 py-1 font-mono text-xs text-secondary">
                  {uri}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tertiary/20 bg-tertiary/8 mb-4">
        <Code2 className="h-7 w-7 text-tertiary" />
      </div>
      <h3 className="font-semibold text-secondary">No apps yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create an OAuth app so users can authorise your application to access their Setl data.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-5 flex items-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90"
      >
        <Plus className="h-4 w-4" /> Create your first app
      </button>
    </div>
  );
}

// ── Personal API Keys Section ───────────────────────────────────────────────

function PersonalApiKeysSection() {
  const [apiKey, setApiKey] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/apikeys")
      .then((res) => {
        if (cancelled) return;
        if (res.data.data.apiKey) {
          setApiKey(res.data.data.apiKey);
          setExpiresAt(res.data.data.expiresAt);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load API key");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await api.post("/apikeys");
      setApiKey(res.data.data.apiKey);
      setExpiresAt(res.data.data.expiresAt);
      toast.success("API key generated");
    } catch {
      toast.error("Failed to generate API key");
    } finally {
      setGenerating(false);
    }
  }, []);

  const rotate = useCallback(async () => {
    if (!window.confirm("Generate a new API key? Your current key will stop working immediately.")) {
      return;
    }
    setRotating(true);
    try {
      const res = await api.put("/apikeys/rotate");
      setApiKey(res.data.data.apiKey);
      setExpiresAt(res.data.data.expiresAt);
      toast.success("API key rotated. Update your integrations.");
    } catch {
      toast.error("Failed to rotate API key");
    } finally {
      setRotating(false);
    }
  }, []);

  const copy = useCallback(() => {
    if (!apiKey) return;
    copyToClipboard(apiKey, "API key");
  }, [apiKey]);

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
      })
    : null;

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-secondary">
            <Key className="h-4 w-4 text-tertiary" />
            Personal API key
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use this key to query your own data from scripts. Send it as a Bearer token
            on <code className="rounded bg-muted px-1 font-mono text-xs">/api/external/v1/*</code>.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </div>
        ) : apiKey ? (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <code
                className="flex-1 truncate rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-mono text-secondary"
                title={apiKey}
              >
                {apiKey}
              </code>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={copy}
                  className="inline-flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={rotate}
                  disabled={rotating}
                  className="inline-flex items-center gap-2"
                >
                  {rotating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Rotate
                </Button>
              </div>
            </div>
            {formattedExpiry && (
              <p className="text-xs text-muted-foreground">
                Expires <span className="font-medium text-secondary">{formattedExpiry}</span>
              </p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90 disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            Generate API key
          </button>
        )}
      </div>
    </div>
  );
}

// ── Developer-Mode Landing ──────────────────────────────────────────────────

function DeveloperModeLanding({ onEnable }) {
  const [enabling, setEnabling] = useState(false);

  async function handleEnable() {
    setEnabling(true);
    try {
      await onEnable();
      toast.success("Developer mode enabled");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to enable developer mode");
      setEnabling(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-border bg-white px-8 py-12 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tertiary/20 bg-tertiary/8">
        <Sparkles className="h-7 w-7 text-tertiary" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-secondary" style={{ letterSpacing: "-0.02em" }}>
        Enable Developer Mode
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Unlock the tools to script your own data and build products on top of Setl.
      </p>
      <ul className="mt-6 w-full space-y-3 text-left text-sm text-muted-foreground">
        <li className="flex items-start gap-3">
          <Key className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
          <span>
            <span className="font-medium text-secondary">Personal API keys</span>
            <br />
            Pull your transactions into a Python script, an Excel sheet, or any other workflow.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
          <span>
            <span className="font-medium text-secondary">OAuth apps</span>
            <br />
            Register apps that other Setl users can authorize — like a budget tracker or analytics tool.
          </span>
        </li>
      </ul>
      <button
        type="button"
        onClick={handleEnable}
        disabled={enabling}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-tertiary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90 disabled:opacity-50"
      >
        {enabling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Enable Developer Mode
      </button>
    </div>
  );
}

// ── API Reference Card ──────────────────────────────────────────────────────

function ApiReferenceCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-tertiary" />
          <span className="font-medium text-secondary">External API reference</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-4 text-sm text-muted-foreground">
          <p>
            Base URL:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-secondary">
              {EXTERNAL_API_BASE}
            </code>
          </p>

          <div className="space-y-2">
            <p className="font-medium text-secondary">OAuth flow (Authorization Code)</p>
            <ol className="list-inside list-decimal space-y-1.5 text-xs">
              <li>Redirect the user to <code className="bg-muted rounded px-1 font-mono">GET {window.location.origin}/oauth/authorize?response_type=code&client_id=…&redirect_uri=…&scope=…</code></li>
              <li>User approves → Setl redirects to your <code className="bg-muted rounded px-1 font-mono">redirect_uri?code=…</code></li>
              <li>Exchange the code server-side: <code className="bg-muted rounded px-1 font-mono">POST {import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"}/oauth/token</code></li>
              <li>Use the <code className="bg-muted rounded px-1 font-mono">access_token</code> as a Bearer token on external API calls</li>
            </ol>
          </div>

          <div className="space-y-1.5">
            <p className="font-medium text-secondary">Scoped endpoints</p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-1.5 pr-4 font-medium">Scope</th>
                  <th className="pb-1.5 font-medium">Endpoint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["transactions:read", "GET /transactions, GET /transactions/:id"],
                  ["accounts:read",     "GET /accounts"],
                  ["profile:read",      "GET /profile"],
                  ["dashboard:read",    "GET /dashboard"],
                ].map(([scope, endpoint]) => (
                  <tr key={scope}>
                    <td className="py-1.5 pr-4 font-mono text-tertiary">{scope}</td>
                    <td className="py-1.5 font-mono text-secondary">{endpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5">
            <p className="font-medium text-secondary">Example: OAuth access token</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-3 text-xs text-green-400">
{`curl -X GET "${EXTERNAL_API_BASE}/transactions" \\
  -H "Authorization: Bearer <oauth_access_token>"`}
            </pre>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <p className="font-medium text-secondary flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-tertiary" />
              Example: personal API key (cURL)
            </p>
            <p className="text-xs">
              Personal keys grant access to your own data only. Generate one in the
              Personal API key section above.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-3 text-xs text-green-400">
{`curl -X GET "${EXTERNAL_API_BASE}/transactions" \\
  -H "Authorization: Bearer setl_dev_<your_key>"`}
            </pre>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <p className="font-medium text-secondary flex items-center gap-2">
              <FileSpreadsheet className="h-3.5 w-3.5 text-tertiary" />
              Example: Python → Excel
            </p>
            <p className="text-xs">
              Pull your transactions and write them to a spreadsheet. Requires
              <code className="mx-1 rounded bg-muted px-1 font-mono">pip install requests pandas openpyxl</code>.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-3 text-xs text-green-400">
{`import requests, pandas as pd

API_KEY = "setl_dev_<your_key>"
BASE = "${EXTERNAL_API_BASE}"

res = requests.get(
    f"{BASE}/transactions",
    headers={"Authorization": f"Bearer {API_KEY}"},
)
res.raise_for_status()
rows = res.json()["data"]["transactions"]

pd.DataFrame(rows).to_excel("transactions.xlsx", index=False)
print(f"Wrote {len(rows)} transactions to transactions.xlsx")`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function DeveloperPortalPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const enableDeveloperMode = useAuthStore((state) => state.enableDeveloperMode);

  const isDeveloper = Boolean(user?.isDeveloper);

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [credentialsOpen, setCredentialsOpen] = useState(false);

  // Pull the freshest profile in case the cached user predates the isDeveloper field
  useEffect(() => {
    if (user && user.isDeveloper === undefined) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  const fetchApps = useCallback(() => {
    setLoading(true);
    api
      .get("/oauth/clients/mine")
      .then((res) => setApps(res.data.data ?? []))
      .catch(() => toast.error("Failed to load apps"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isDeveloper) fetchApps();
    else setLoading(false);
  }, [isDeveloper, fetchApps]);

  function handleCreated(data) {
    setCredentials(data);
    setCredentialsOpen(true);
    fetchApps();
  }

  function handleDeleted(clientId) {
    setApps((prev) => prev.filter((a) => a.client_id !== clientId));
  }

  const userEmail = user?.email ?? "";
  const userInitial = userEmail[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 rounded-lg">
              <img src="/logo.png" alt="Setl" className="h-8 w-auto" />
            </Link>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <div className="hidden items-center gap-1.5 sm:flex">
              <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Developer Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm font-medium text-secondary shadow-sm transition-all hover:bg-muted/60 hover:shadow focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary/10 text-xs font-bold text-tertiary">
                {userInitial}
              </div>
              <span className="max-w-[160px] truncate text-sm text-muted-foreground">{userEmail}</span>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm font-medium text-secondary shadow-sm transition-all hover:bg-muted/60 hover:shadow focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
            >
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {!isDeveloper ? (
          <DeveloperModeLanding onEnable={enableDeveloperMode} />
        ) : (
          <>
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">

              {/* Main column */}
              <div className="min-w-0 space-y-6">
                {/* Title row */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                      Developer Portal
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Script your own data with a personal API key, or register OAuth apps for other users.
                    </p>
                  </div>
                </div>

                {/* Personal API key */}
                <PersonalApiKeysSection />

                {/* OAuth apps section header */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary">
                      <Code2 className="h-4 w-4 text-tertiary" />
                      OAuth apps
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Register apps that other Setl users can authorize.
                    </p>
                  </div>
                  {!loading && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="button"
                      onClick={() => setCreateOpen(true)}
                      className="shrink-0 flex items-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-tertiary/90 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">New app</span>
                    </motion.button>
                  )}
                </div>

                {/* Apps list */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                  </div>
                ) : apps.length === 0 ? (
                  <EmptyState onCreateClick={() => setCreateOpen(true)} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    {apps.map((app) => (
                      <AppCard key={app.client_id} app={app} onDelete={handleDeleted} />
                    ))}
                    {/* Add another app card */}
                    <button
                      type="button"
                      onClick={() => setCreateOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-white py-10 text-sm font-medium text-muted-foreground transition hover:border-tertiary/40 hover:text-tertiary"
                    >
                      <Plus className="h-5 w-5" />
                      Add another app
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {/* OAuth flow overview card */}
                <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                  <h2 className="mb-3 flex items-center gap-2 font-semibold text-secondary">
                    <ShieldCheck className="h-4 w-4 text-tertiary" />
                    How OAuth works
                  </h2>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    {[
                      ["Register your app", "Create an OAuth client to get a client_id and client_secret."],
                      ["Redirect users", "Send users to Setl's authorization URL with your client_id and desired scopes."],
                      ["User approves", "Setl shows a consent screen. When approved, we redirect back with a code."],
                      ["Exchange the code", "POST the code to /oauth/token server-side to receive an access_token."],
                      ["Access the API", "Use the Bearer token to call the external API on behalf of the user."],
                    ].map(([title, desc], i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-xs font-bold text-tertiary">
                          {i + 1}
                        </span>
                        <span>
                          <span className="font-medium text-secondary">{title}</span>
                          <br />
                          {desc}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Token lifetimes */}
                <div className="rounded-xl border border-border bg-white p-5 shadow-sm text-sm">
                  <h2 className="mb-3 font-semibold text-secondary">Token lifetimes</h2>
                  <dl className="space-y-1.5 text-muted-foreground">
                    <div className="flex justify-between">
                      <dt>Auth code</dt>
                      <dd className="font-medium text-secondary">10 minutes</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Access token</dt>
                      <dd className="font-medium text-secondary">1 hour</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Refresh token</dt>
                      <dd className="font-medium text-secondary">30 days</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1.5">
                      <dt>Personal API key</dt>
                      <dd className="font-medium text-secondary">365 days</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* API Reference (full width below) */}
            <div className="mt-6">
              <ApiReferenceCard />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateAppModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
      <CredentialsModal
        open={credentialsOpen}
        onOpenChange={setCredentialsOpen}
        credentials={credentials}
      />
    </div>
  );
}
