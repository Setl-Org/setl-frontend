import { useState, useCallback, useEffect } from "react";
import { Copy, RefreshCw, Key, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

/**
 * ApiKeyModal - Loads the user's API key from the database, auto-creates one if
 * none exists, and allows rotating it. The key is never regenerated client-side.
 */
export function ApiKeyModal({ open, onOpenChange }) {
  const [apiKey, setApiKey] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);

  // Fetch (or auto-create) the key each time the modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    api
      .get("/dashboard/apikey")
      .then(async (res) => {
        if (cancelled) return;
        if (res.data.data.apiKey) {
          setApiKey(res.data.data.apiKey);
          setExpiresAt(res.data.data.expiresAt);
        } else {
          // No key yet — issue one automatically
          const create = await api.post("/dashboard/apikey");
          if (!cancelled) {
            setApiKey(create.data.data.apiKey);
            setExpiresAt(create.data.data.expiresAt);
          }
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load API key");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [open]);

  const copyKey = useCallback(() => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(
      () => toast.success("API key copied to clipboard"),
      () => toast.error("Failed to copy")
    );
  }, [apiKey]);

  const rotateKey = useCallback(async () => {
    if (
      !window.confirm(
        "Generate a new API key? Your current key will stop working immediately."
      )
    ) {
      return;
    }
    setRotating(true);
    try {
      const res = await api.put("/dashboard/apikey/rotate");
      setApiKey(res.data.data.apiKey);
      setExpiresAt(res.data.data.expiresAt);
      toast.success("API key rotated. Update your integrations with the new key.");
    } catch {
      toast.error("Failed to rotate API key");
    } finally {
      setRotating(false);
    }
  }, []);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "https://api.setl.dev";

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            API key
          </DialogTitle>
          <DialogDescription>
            Use this key to authenticate requests to the SETL API. Keep it
            secret and rotate it if exposed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Key display */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code
              className="flex-1 truncate rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-mono text-foreground"
              title={apiKey ?? undefined}
            >
              {loading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading…
                </span>
              ) : (
                apiKey ?? "—"
              )}
            </code>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="tertiary"
                onClick={copyKey}
                disabled={loading || !apiKey}
                className="inline-flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                type="button"
                variant="tertiary"
                onClick={rotateKey}
                disabled={loading || rotating}
                className="inline-flex items-center gap-2"
              >
                {rotating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Rotate
              </Button>
            </div>
          </div>

          {/* Expiry badge */}
          {formattedExpiry && (
            <p className="text-xs text-muted-foreground">
              Expires <span className="font-medium text-foreground">{formattedExpiry}</span>
            </p>
          )}

          {/* Usage guide */}
          <div className="rounded-lg border border-border bg-muted/30">
            <button
              type="button"
              onClick={() => setGuideOpen((o) => !o)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-inset"
            >
              How to use your API key
              {guideOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {guideOpen && (
              <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                <ol className="list-inside list-decimal space-y-2">
                  <li>
                    Include the key in the{" "}
                    <code className="rounded bg-muted px-1 font-mono text-foreground">
                      Authorization
                    </code>{" "}
                    header as a Bearer token:
                  </li>
                </ol>
                <pre className="mt-2 overflow-x-auto rounded border border-border bg-primary p-3 text-xs">
{`Authorization: Bearer YOUR_API_KEY`}
                </pre>
                <p className="mt-3 font-medium text-foreground">Example cURL:</p>
                <pre className="mt-1 overflow-x-auto rounded border border-border bg-primary p-3 text-xs">
{`curl -X GET "${apiBaseUrl}/transactions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
                <p className="mt-3">
                  Replace{" "}
                  <code className="rounded bg-muted px-1 font-mono text-foreground">
                    YOUR_API_KEY
                  </code>{" "}
                  with your key.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
