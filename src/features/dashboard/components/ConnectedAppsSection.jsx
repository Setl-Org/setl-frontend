import { useCallback, useEffect, useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  expired: "bg-muted text-muted-foreground",
  revoked: "bg-red-100 text-red-600",
};

export function ConnectedAppsSection() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const fetchConsents = useCallback(() => {
    setLoading(true);
    api
      .get("/oauth/consents")
      .then((res) => setConsents(res.data.data ?? []))
      .catch(() => toast.error("Failed to load connected apps"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  async function handleRevoke(consent) {
    if (!window.confirm(`Revoke ${consent.client_name}'s access to your accounts?`)) return;
    setRevokingId(consent.id);
    try {
      await api.post(`/oauth/consents/${consent.id}/revoke`);
      toast.success("Access revoked");
      setConsents((prev) =>
        prev.map((item) => (item.id === consent.id ? { ...item, status: "revoked" } : item))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to revoke access");
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
          <Link2 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-secondary">Connected apps</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Apps you have allowed to read selected accounts. Revoke access at any time.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : consents.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No apps are connected to your account.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {consents.map((consent) => (
            <li
              key={consent.id}
              className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-secondary">{consent.client_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[consent.status] ?? STATUS_STYLES.expired}`}>
                    {consent.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Granted {formatDate(consent.granted_at)} · expires {formatDate(consent.expires_at)}
                </p>
                <p className="mt-2 text-xs text-secondary">
                  {(consent.accounts ?? [])
                    .map((account) =>
                      [account.accountName, account.bankName, account.mask].filter(Boolean).join(" · ")
                    )
                    .join("; ") || "No accounts"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(consent.scopes ?? []).map(({ scope }) => (
                    <span
                      key={scope}
                      className="rounded-full border border-tertiary/30 bg-tertiary/8 px-2 py-0.5 font-mono text-[11px] text-tertiary"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              {consent.status === "active" && (
                <button
                  type="button"
                  onClick={() => handleRevoke(consent)}
                  disabled={revokingId === consent.id}
                  className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {revokingId === consent.id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
