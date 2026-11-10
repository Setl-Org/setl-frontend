import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, KeyRound, Trash2, AppWindow, Link2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatDate, formatCount } from "@/lib/format";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { Card } from "@/components/app/Card";
import { CopyField } from "@/components/app/CopyField";
import { InlineConfirm } from "@/components/app/InlineConfirm";
import { EmptyState } from "@/components/app/EmptyState";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";
import { StatusPill, Tag } from "@/components/app/StatusPill";
import { CreateAppDialog, CredentialsDialog, EditRedirectUrisDialog } from "../components/DeveloperDialogs";

function AppCard({ app, onEdit, onRotate, onDelete }) {
  const consents = app.active_consent_count ?? 0;
  return (
    <Card as="article" aria-labelledby={`app-${app.client_id}`} className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lilac text-[16px] font-semibold text-violet-ink">
            {app.name?.[0]?.toUpperCase() ?? "A"}
          </span>
          <div className="min-w-0">
            <h2 id={`app-${app.client_id}`} className="truncate text-[16px] font-semibold text-ink">
              {app.name}
            </h2>
            <p className="text-[13px] text-ink-muted">
              Created {formatDate(app.createdAt)} · {formatCount(consents)} active {consents === 1 ? "consent" : "consents"}
            </p>
          </div>
        </div>
        <StatusPill tone={app.is_active ? "positive" : "negative"}>{app.is_active ? "Active" : "Inactive"}</StatusPill>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CopyField label="Client ID" value={app.client_id} />
        <div>
          <p className="text-[12px] text-ink-muted">Scopes</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(app.scopes ?? []).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[12px] text-ink-muted">Redirect URIs</p>
        <ul className="mt-1.5 space-y-1">
          {(app.redirect_uris ?? []).map((uri) => (
            <li key={uri} className="flex items-center gap-2 font-mono text-[12.5px] text-ink">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
              <span className="truncate" title={uri}>{uri}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
        <AppButton size="sm" leadingIcon={Pencil} onClick={() => onEdit(app)}>
          Edit redirect URIs
        </AppButton>
        <InlineConfirm
          label="Rotate secret"
          icon={KeyRound}
          message="The current secret stops working now."
          confirmLabel="Rotate"
          onConfirm={() => onRotate(app)}
        />
        <div className="ml-auto">
          <InlineConfirm
            label="Delete"
            icon={Trash2}
            triggerVariant="danger-outline"
            message={consents ? `${formatCount(consents)} connected ${consents === 1 ? "user loses" : "users lose"} access.` : "Delete this app?"}
            confirmLabel="Delete app"
            onConfirm={() => onDelete(app)}
          />
        </div>
      </div>
    </Card>
  );
}

/** OAuth apps - register, inspect and manage apps other Setl users authorise. */
export function AppsPage() {
  const [state, setState] = useState({ status: "loading", items: [] });
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creds, setCreds] = useState({ open: false, data: null, title: "" });

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    api
      .get("/oauth/clients/mine")
      .then((res) => setState({ status: "ready", items: res.data.data ?? [] }))
      .catch(() => setState({ status: "error", items: [] }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleCreated(data) {
    setCreds({ open: true, data, title: "App created" });
    load();
  }

  async function rotate(app) {
    try {
      const { data } = await api.post(`/oauth/clients/mine/${app.client_id}/rotate-secret`);
      setCreds({ open: true, data: data.data, title: `New secret for ${app.name}` });
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't rotate the secret. The current one still works.");
    }
  }

  async function remove(app) {
    try {
      await api.delete(`/oauth/clients/mine/${app.client_id}`);
      setState((s) => ({ ...s, items: s.items.filter((a) => a.client_id !== app.client_id) }));
      toast.success(`${app.name} deleted`);
    } catch (err) {
      toast.error(err.errorMessage ?? `Couldn't delete ${app.name}. Try again.`);
    }
  }

  function saved(updated) {
    setState((s) => ({
      ...s,
      items: s.items.map((a) => (a.client_id === updated.client_id ? { ...a, ...updated } : a)),
    }));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="OAuth apps"
        description="Apps other Setl users can authorise to read the accounts they choose."
        actions={
          <AppButton variant="primary" leadingIcon={Plus} onClick={() => setCreateOpen(true)}>
            New app
          </AppButton>
        }
      />

      {state.status === "loading" ? (
        <div className="space-y-4">
          <SkeletonBlock className="h-[260px] w-full rounded-xl" />
        </div>
      ) : state.status === "error" ? (
        <div className="rounded-xl border border-hairline">
          <EmptyState
            tone="error"
            title="Couldn't load your apps"
            description="The server didn't respond. Your apps and their users are unaffected."
            action={<AppButton size="sm" onClick={load}>Try again</AppButton>}
          />
        </div>
      ) : state.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline-strong">
          <EmptyState
            icon={AppWindow}
            title="No apps yet"
            description="Create an OAuth app so people can connect their Setl accounts to your product."
            action={<AppButton variant="primary" size="sm" leadingIcon={Plus} onClick={() => setCreateOpen(true)}>Create your first app</AppButton>}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {state.items.map((app) => (
            <AppCard key={app.client_id} app={app} onEdit={setEditing} onRotate={rotate} onDelete={remove} />
          ))}
        </div>
      )}

      <CreateAppDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={handleCreated} />
      <EditRedirectUrisDialog
        app={editing}
        open={Boolean(editing)}
        onOpenChange={(v) => !v && setEditing(null)}
        onSaved={saved}
      />
      <CredentialsDialog
        open={creds.open}
        onOpenChange={(v) => setCreds((c) => ({ ...c, open: v }))}
        credentials={creds.data}
        title={creds.title}
      />
    </div>
  );
}
