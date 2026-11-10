import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Upload, Building2, SearchX } from "lucide-react";
import { capitalize, formatCount, formatDate, formatPeriod, maskAccountNumber, middleTruncate } from "@/lib/format";
import { useApp } from "@/features/app-shell/useApp";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";
import { DataTable } from "@/components/app/DataTable";
import { EmptyState } from "@/components/app/EmptyState";
import { SearchInput } from "@/components/app/SearchInput";
import { FilterSelect } from "@/components/app/FilterSelect";
import { SegmentedControl } from "@/components/app/SegmentedControl";
import { StatusPill } from "@/components/app/StatusPill";
import { CopyButton } from "@/components/app/CopyField";
import { BankLogo } from "@/components/ui/BankLogo";

/** Accounts - every connected account in one bordered table, filtered on the client. */
export function AccountsPage() {
  const { accounts, openAddAccount, openUpload } = useApp();
  const [query, setQuery] = useState("");
  const [bank, setBank] = useState("");
  const [type, setType] = useState("all");

  const items = accounts.items;
  const banks = useMemo(() => [...new Set(items.map((a) => a.bankName).filter(Boolean))].sort(), [items]);
  const typeCounts = useMemo(() => {
    const c = { all: items.length };
    for (const a of items) c[a.accountType] = (c[a.accountType] ?? 0) + 1;
    return c;
  }, [items]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (bank && a.bankName !== bank) return false;
      if (type !== "all" && a.accountType !== type) return false;
      if (!q) return true;
      return [a.accountName, a.bankName, a.accountNumber, a.accountId].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query, bank, type]);

  const filtered = query || bank || type !== "all";

  const columns = [
    {
      id: "account",
      header: "Account",
      sortValue: (a) => a.accountName ?? "",
      cell: (a) => (
        <div className="flex min-w-0 items-center gap-3">
          <BankLogo bankName={a.bankName} className="h-9 w-9 rounded-lg" />
          <div className="min-w-0">
            <p className="max-w-[240px] truncate font-medium text-ink" title={a.accountName}>
              {a.accountName}
            </p>
            <p className="text-[12.5px] tabular-nums text-ink-muted">{maskAccountNumber(a.accountNumber)}</p>
          </div>
        </div>
      ),
    },
    {
      id: "bank",
      header: "Institution",
      sortValue: (a) => a.bankName ?? "",
      cell: (a) => <span className="whitespace-nowrap">{a.bankName}</span>,
    },
    {
      id: "type",
      header: "Type",
      sortValue: (a) => a.accountType ?? "",
      cell: (a) => <span className="whitespace-nowrap text-ink-muted">{capitalize(a.accountType)}</span>,
    },
    {
      id: "statement",
      header: "Last statement",
      sortValue: (a) => a.lastStatementImport?.importedAt ?? "",
      cell: (a) => {
        const s = a.lastStatementImport;
        if (!s) return <StatusPill tone="neutral">None yet</StatusPill>;
        return (
          <div className="whitespace-nowrap">
            <p className="text-ink">{formatPeriod(s.statementStartDate, s.statementEndDate)}</p>
            <p className="text-[12.5px] text-ink-muted">{formatCount(s.transactionCount)} transactions</p>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      sortValue: (a) => a.status ?? "",
      cell: (a) => (
        <StatusPill tone={a.status === "active" ? "positive" : "neutral"}>{capitalize(a.status ?? "unknown")}</StatusPill>
      ),
    },
    {
      id: "added",
      header: "Added",
      sortValue: (a) => a.createdAt ?? "",
      className: "hidden xl:table-cell",
      cell: (a) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatDate(a.createdAt)}</span>,
    },
    {
      id: "accountId",
      header: "Account ID",
      cell: (a) =>
        a.accountId ? (
          <div className="flex items-center gap-1">
            <code className="whitespace-nowrap font-mono text-[12px] text-ink-muted" title={a.accountId}>
              {middleTruncate(a.accountId)}
            </code>
            <CopyButton value={a.accountId} label="Account ID" />
          </div>
        ) : (
          <span className="text-ink-subtle">Not issued</span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Accounts"
        description="Bank and wallet accounts you've added. Upload statements to keep each one current."
        actions={
          <>
            <AppButton leadingIcon={Upload} onClick={openUpload}>
              Upload statement
            </AppButton>
            <AppButton variant="primary" leadingIcon={Plus} onClick={openAddAccount}>
              Add account
            </AppButton>
          </>
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name, bank, number or account ID"
            className="lg:w-[380px]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="Institution"
              value={bank}
              onChange={setBank}
              options={banks.map((b) => ({ value: b, label: b }))}
            />
            <SegmentedControl
              label="Account type"
              value={type}
              onChange={setType}
              options={[
                { value: "all", label: "All", count: typeCounts.all },
                { value: "checking", label: "Checking", count: typeCounts.checking ?? 0 },
                { value: "savings", label: "Savings", count: typeCounts.savings ?? 0 },
              ]}
            />
          </div>
        </div>

        <DataTable
          caption="Accounts"
          columns={columns}
          rows={rows}
          rowKey={(a) => a._id}
          loading={accounts.status === "loading"}
          defaultSort={{ id: "account", dir: "asc" }}
          minWidth={900}
          empty={
            accounts.status === "error" ? (
              <EmptyState
                tone="error"
                title="Couldn't load your accounts"
                description="The server didn't respond. Your accounts are safe; this is only the list."
                action={<AppButton size="sm" onClick={accounts.refresh}>Try again</AppButton>}
              />
            ) : filtered ? (
              <EmptyState
                icon={SearchX}
                title="No accounts match"
                description="Try a different search, or clear the filters."
                action={
                  <AppButton
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setBank("");
                      setType("all");
                    }}
                  >
                    Clear filters
                  </AppButton>
                }
              />
            ) : (
              <EmptyState
                icon={Building2}
                title="No accounts yet"
                description="Add your first bank or wallet account, then upload a statement for it."
                action={<AppButton size="sm" variant="primary" leadingIcon={Plus} onClick={openAddAccount}>Add account</AppButton>}
              />
            )
          }
        />
        {rows.length > 0 && (
          <p className="text-[13px] text-ink-muted">
            Showing {formatCount(rows.length)} of {formatCount(items.length)} accounts.{" "}
            <Link to="/dashboard/transactions" className="font-medium text-violet-ink hover:underline focus-ring rounded">
              See their transactions
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
