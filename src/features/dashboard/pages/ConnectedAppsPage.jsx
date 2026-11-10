import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { capitalize, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { DataTable } from "@/components/app/DataTable";
import { EmptyState } from "@/components/app/EmptyState";
import { SegmentedControl } from "@/components/app/SegmentedControl";
import { StatusPill, Tag } from "@/components/app/StatusPill";
import { InlineConfirm } from "@/components/app/InlineConfirm";
import { BankLogo } from "@/components/ui/BankLogo";

const STATUS_TONE = { active: "positive", expired: "neutral", revoked: "negative" };

/** Connected apps - third-party apps the user has allowed to read their accounts. */
export function ConnectedAppsPage() {
  const [state, setState] = useState({ status: "loading", items: [], notSupported: false });
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    api
      .get("/oauth/consents")
      .then((res) => setState({ status: "ready", items: res.data.data ?? [], notSupported: false }))
      .catch((err) =>
        setState({ status: "error", items: [], notSupported: err?.response?.status === 404 })
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function revoke(consent) {
    try {
      await api.post(`/oauth/consents/${consent.id}/revoke`);
      setState((s) => ({
        ...s,
        items: s.items.map((c) => (c.id === consent.id ? { ...c, status: "revoked" } : c)),
      }));
      toast.success(`${consent.client_name} can no longer read your accounts`);
    } catch (err) {
      toast.error(err.errorMessage ?? `Couldn't revoke ${consent.client_name}. Try again.`);
    }
  }

  const counts = useMemo(() => {
    const c = { all: state.items.length, active: 0, expired: 0, revoked: 0 };
    for (const i of state.items) c[i.status] = (c[i.status] ?? 0) + 1;
    return c;
  }, [state.items]);

  const rows = filter === "all" ? state.items : state.items.filter((c) => c.status === filter);

  const columns = [
    {
      id: "app",
      header: "App",
      sortValue: (c) => c.client_name ?? "",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lilac text-[14px] font-semibold text-violet-ink">
            {(c.client_name ?? "?")[0].toUpperCase()}
          </span>
          <span className="font-medium text-ink">{c.client_name}</span>
        </div>
      ),
    },
    {
      id: "accounts",
      header: "Accounts shared",
      cell: (c) => {
        const accts = c.accounts ?? [];
        if (!accts.length) return <span className="text-ink-subtle">None</span>;
        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {accts.slice(0, 4).map((a, i) => (
                <BankLogo key={`${a.bankName}-${i}`} bankName={a.bankName} className="h-6 w-6 rounded-full ring-2 ring-canvas" />
              ))}
            </div>
            <span className="text-[13px] text-ink-muted" title={accts.map((a) => [a.accountName, a.bankName, a.mask].filter(Boolean).join(" · ")).join("\n")}>
              {accts.length} {accts.length === 1 ? "account" : "accounts"}
            </span>
          </div>
        );
      },
    },
    {
      id: "scopes",
      header: "Can read",
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {(c.scopes ?? []).map(({ scope }) => (
            <Tag key={scope}>{scope}</Tag>
          ))}
        </div>
      ),
    },
    {
      id: "granted",
      header: "Granted",
      sortValue: (c) => c.granted_at ?? "",
      cell: (c) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatDate(c.granted_at)}</span>,
    },
    {
      id: "expires",
      header: "Expires",
      sortValue: (c) => c.expires_at ?? "",
      cell: (c) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatDate(c.expires_at)}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortValue: (c) => c.status ?? "",
      cell: (c) => <StatusPill tone={STATUS_TONE[c.status] ?? "neutral"}>{capitalize(c.status)}</StatusPill>,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (c) =>
        c.status === "active" ? (
          <InlineConfirm
            label="Revoke"
            icon={ShieldOff}
            triggerVariant="danger-outline"
            message={`Stop ${c.client_name} reading your accounts?`}
            confirmLabel="Revoke access"
            onConfirm={() => revoke(c)}
          />
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Connected apps"
        description="Apps you've allowed to read selected accounts through Setl. Access lasts 90 days and you can revoke it at any time."
      />

      {state.status === "ready" && state.items.length > 0 && (
        <SegmentedControl
          label="Filter by status"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: counts.all },
            { value: "active", label: "Active", count: counts.active },
            { value: "expired", label: "Expired", count: counts.expired },
            { value: "revoked", label: "Revoked", count: counts.revoked },
          ]}
        />
      )}

      <DataTable
        caption="Connected apps"
        columns={columns}
        rows={rows}
        rowKey={(c) => c.id}
        loading={state.status === "loading"}
        skeletonRows={3}
        minWidth={980}
        empty={
          state.status === "error" ? (
            state.notSupported ? (
              <EmptyState
                icon={ShieldCheck}
                title="Connected apps aren't available on this server yet"
                description="The server doesn't offer the consents endpoint. Once it does, every app you approve through Setl Connect appears here with a way to revoke it."
                action={<AppButton size="sm" onClick={load}>Check again</AppButton>}
              />
            ) : (
              <EmptyState
                tone="error"
                title="Couldn't load connected apps"
                description="The server didn't respond. Nothing about your access has changed."
                action={<AppButton size="sm" onClick={load}>Try again</AppButton>}
              />
            )
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title={filter === "all" ? "No apps connected" : `No ${filter} apps`}
              description={
                filter === "all"
                  ? "When you approve an app through Setl Connect, it shows up here with the accounts it can read."
                  : "Switch to All to see every app you've approved."
              }
            />
          )
        }
      />
    </div>
  );
}
