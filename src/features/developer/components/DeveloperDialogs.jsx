import { useEffect, useState } from "react";
import { Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Field, TextInput, TextArea, DialogActions } from "@/components/app/Field";
import { CopyField } from "@/components/app/CopyField";
import { AppButton } from "@/components/app/AppButton";
import { ALL_SCOPES } from "../constants";

function parseUris(text) {
  return text
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
}

/** Register a new OAuth app. Errors show on the field that caused them. */
export function CreateAppDialog({ open, onOpenChange, onCreated }) {
  const [name, setName] = useState("");
  const [uris, setUris] = useState("");
  const [scopes, setScopes] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setUris("");
      setScopes([]);
      setErrors({});
    }
  }, [open]);

  function toggle(scope) {
    setScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  }

  async function submit(e) {
    e.preventDefault();
    const redirectUris = parseUris(uris);
    const next = {};
    if (!name.trim()) next.name = "Give the app a name your users will recognise.";
    if (redirectUris.length === 0) next.uris = "Add at least one redirect URI.";
    if (scopes.length === 0) next.scopes = "Pick at least one scope.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const { data } = await api.post("/oauth/clients", { name: name.trim(), redirect_uris: redirectUris, scopes });
      onCreated(data.data);
      onOpenChange(false);
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't create the app. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create an OAuth app</DialogTitle>
          <DialogDescription>Let other Setl users connect their accounts to your product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
          <Field label="App name" required error={errors.name}>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="My Budget Tracker" />
          </Field>
          <Field label="Redirect URIs" required hint="One per line. Connect sessions may only return to these." error={errors.uris}>
            <TextArea
              rows={3}
              value={uris}
              onChange={(e) => setUris(e.target.value)}
              placeholder="https://yourapp.com/callback"
              className="font-mono text-[13px]"
            />
          </Field>
          <fieldset aria-describedby={errors.scopes ? "scopes-error" : undefined}>
            <legend className="mb-2 text-[13.5px] font-medium text-ink">Scopes</legend>
            <div className="space-y-2">
              {ALL_SCOPES.map(({ value, label, description }) => {
                const checked = scopes.includes(value);
                return (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet",
                      checked ? "border-violet/40 bg-lilac" : "border-hairline hover:bg-sunken"
                    )}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggle(value)} className="mt-1 h-4 w-4 accent-violet" />
                    <span>
                      <span className="block text-[14px] font-medium text-ink">{label}</span>
                      <span className="block text-[12.5px] text-ink-muted">{description}</span>
                      <code className="mt-1 block font-mono text-[11.5px] text-ink-subtle">{value}</code>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.scopes && (
              <p id="scopes-error" role="alert" className="mt-1.5 text-[12.5px] font-medium text-negative">
                {errors.scopes}
              </p>
            )}
          </fieldset>
          <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Create app" submitIcon={Plus} submitting={submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Shows a client secret exactly once, after create or rotate. */
export function CredentialsDialog({ open, onOpenChange, credentials, title }) {
  if (!credentials) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-positive" aria-hidden />
            {title}
          </DialogTitle>
          <DialogDescription>Store the client secret somewhere safe. Setl won&apos;t show it again.</DialogDescription>
        </DialogHeader>
        <div className="mt-5 space-y-3">
          <p className="flex items-start gap-2 rounded-lg bg-caution-soft px-3.5 py-3 text-[13px] text-caution" role="note">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Copy the secret now. Once you close this, the only way to get a new one is to rotate it.
          </p>
          <CopyField label="Client ID" value={credentials.client_id} />
          <CopyField label="Client secret" value={credentials.client_secret} secret />
        </div>
        <div className="mt-6 flex justify-end">
          <AppButton variant="primary" onClick={() => onOpenChange(false)}>
            I&apos;ve saved it
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Edit an app's redirect URIs. */
export function EditRedirectUrisDialog({ app, open, onOpenChange, onSaved }) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && app) {
      setDraft((app.redirect_uris ?? []).join("\n"));
      setError("");
    }
  }, [open, app]);

  async function submit(e) {
    e.preventDefault();
    const redirectUris = parseUris(draft);
    if (redirectUris.length === 0) {
      setError("Keep at least one redirect URI.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.patch(`/oauth/clients/mine/${app.client_id}`, { redirect_uris: redirectUris });
      onSaved(data.data);
      onOpenChange(false);
      toast.success("Redirect URIs saved");
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't save the redirect URIs. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit redirect URIs</DialogTitle>
          <DialogDescription>{app?.name}: connect sessions can only return to a URI on this list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="mt-6">
          <Field label="Redirect URIs" required hint="One per line." error={error}>
            <TextArea rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} className="font-mono text-[13px]" />
          </Field>
          <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save" submitting={saving} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
