import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, RefreshCw, BookOpen, AppWindow, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { Card, CardHeader, CardBody } from "@/components/app/Card";
import { CopyField } from "@/components/app/CopyField";
import { InlineConfirm } from "@/components/app/InlineConfirm";
import { EmptyState } from "@/components/app/EmptyState";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";
import { StatusPill } from "@/components/app/StatusPill";

/** Keys - Plaid's Keys page: the personal key, then each OAuth app's client ID. */
export function KeysPage() {
  const [key, setKey] = useState({ status: "loading", apiKey: null, expiresAt: null, createdAt: null });
  const [apps, setApps] = useState({ status: "loading", items: [] });
  const [generating, setGenerating] = useState(false);

  const loadKey = useCallback(() => {
    setKey((k) => ({ ...k, status: "loading" }));
    api
      .get("/apikeys")
      .then((res) => setKey({ status: "ready", ...res.data.data }))
      .catch(() => setKey((k) => ({ ...k, status: "error" })));
  }, []);

  const loadApps = useCallback(() => {
    setApps((a) => ({ ...a, status: "loading" }));
    api
      .get("/oauth/clients/mine")
      .then((res) => setApps({ status: "ready", items: res.data.data ?? [] }))
      .catch(() => setApps({ status: "error", items: [] }));
  }, []);

  useEffect(() => {
    loadKey();
    loadApps();
  }, [loadKey, loadApps]);

  async function generate() {
    setGenerating(true);
    try {
      const res = await api.post("/apikeys");
      setKey({ status: "ready", ...res.data.data });
      toast.success("API key created");
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't create a key. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function rotate() {
    try {
      const res = await api.put("/apikeys/rotate");
      setKey({ status: "ready", ...res.data.data });
      toast.success("New key issued. Update anything that used the old one.");
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't rotate the key. Your current key still works.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Keys"
        description="Credentials for the Setl API. Keep them on your server; never ship them to a browser or app."
        actions={
          <AppButton to="/developer/api" leadingIcon={BookOpen}>
            View API reference
          </AppButton>
        }
      />

      <Card aria-labelledby="personal-key-title">
        <CardHeader
          id="personal-key-title"
          icon={KeyRound}
          title="Personal API key"
          description={
            <>
              Reads your own data. Send it as a Bearer token to{" "}
              <code className="rounded bg-sunken px-1 font-mono text-[12px] text-ink">/api/external/v1/*</code>.
            </>
          }
          action={key.status === "ready" && key.apiKey ? <StatusPill tone="positive">Active</StatusPill> : null}
        />
        <CardBody>
          {key.status === "loading" ? (
            <SkeletonBlock className="h-[60px] w-full rounded-lg" />
          ) : key.status === "error" ? (
            <EmptyState
              tone="error"
              compact
              title="Couldn't load your key"
              description="The server didn't respond. Your key, if you have one, still works."
              action={<AppButton size="sm" onClick={loadKey}>Try again</AppButton>}
            />
          ) : key.apiKey ? (
            <div className="space-y-4">
              <CopyField label="Secret key" value={key.apiKey} secret />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <dl className="flex flex-wrap gap-x-8 gap-y-1 text-[13px]">
                  {key.createdAt && (
                    <div className="flex gap-1.5">
                      <dt className="text-ink-muted">Created</dt>
                      <dd className="font-medium tabular-nums text-ink">{formatDate(key.createdAt)}</dd>
                    </div>
                  )}
                  {key.expiresAt && (
                    <div className="flex gap-1.5">
                      <dt className="text-ink-muted">Expires</dt>
                      <dd className="font-medium tabular-nums text-ink">{formatDate(key.expiresAt)}</dd>
                    </div>
                  )}
                </dl>
                <InlineConfirm
                  label="Rotate key"
                  icon={RefreshCw}
                  message="The current key stops working immediately."
                  confirmLabel="Rotate"
                  onConfirm={rotate}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-hairline-strong p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13.5px] text-ink-muted">You don&apos;t have a personal key yet. Keys last 365 days.</p>
              <AppButton variant="primary" leadingIcon={KeyRound} loading={generating} onClick={generate}>
                Create API key
              </AppButton>
            </div>
          )}
        </CardBody>
      </Card>

      <Card aria-labelledby="client-ids-title">
        <CardHeader
          id="client-ids-title"
          icon={AppWindow}
          title="OAuth client IDs"
          description="Public identifiers for your apps. Secrets are shown once, when an app is created or its secret is rotated."
          action={
            <AppButton to="/developer/apps" size="sm" variant="ghost">
              Manage apps
            </AppButton>
          }
        />
        <CardBody>
          {apps.status === "loading" ? (
            <SkeletonBlock className="h-[60px] w-full rounded-lg" />
          ) : apps.status === "error" ? (
            <EmptyState
              tone="error"
              compact
              title="Couldn't load your apps"
              action={<AppButton size="sm" onClick={loadApps}>Try again</AppButton>}
            />
          ) : apps.items.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-hairline-strong p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13.5px] text-ink-muted">No OAuth apps yet.</p>
              <AppButton to="/developer/apps" leadingIcon={Plus}>
                Create an app
              </AppButton>
            </div>
          ) : (
            <ul className="space-y-3">
              {apps.items.map((app) => (
                <li key={app.client_id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    to="/developer/apps"
                    className="w-48 shrink-0 truncate rounded text-[14px] font-medium text-ink hover:text-violet-ink focus-ring"
                  >
                    {app.name}
                  </Link>
                  <CopyField label="Client ID" value={app.client_id} className="flex-1" size="sm" />
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
