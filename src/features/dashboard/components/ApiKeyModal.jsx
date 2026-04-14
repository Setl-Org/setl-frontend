import { useState, useCallback } from "react";
import { Copy, RefreshCw, Key, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

const DUMMY_KEY_PREFIX = "setl_live_";
const generateDummyKey = () =>
  DUMMY_KEY_PREFIX +
  Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

/**
 * ApiKeyModal - View/copy API key, rotate it, and read usage guide.
 */
export function ApiKeyModal({ open, onOpenChange }) {
  const [apiKey, setApiKey] = useState(generateDummyKey);
  const [guideOpen, setGuideOpen] = useState(true);

  const copyKey = useCallback(() => {
    navigator.clipboard.writeText(apiKey).then(
      () => toast.success("API key copied to clipboard"),
      () => toast.error("Failed to copy")
    );
  }, [apiKey]);

  const rotateKey = useCallback(() => {
    if (
      !window.confirm(
        "Generate a new API key? Your current key will stop working immediately."
      )
    ) {
      return;
    }
    setApiKey(generateDummyKey());
    toast.success("API key rotated. Use the new key in your requests.");
  }, []);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "https://api.setl.dev";

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code
              className="flex-1 truncate rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-mono text-foreground"
              title={apiKey}
            >
              {apiKey}
            </code>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="tertiary"
                onClick={copyKey}
                className="inline-flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                type="button"
                variant="tertiary"
                onClick={rotateKey}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Rotate
              </Button>
            </div>
          </div>

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
                    Include the key in the <code className="rounded bg-muted px-1 font-mono text-foreground">Authorization</code> header as a Bearer token:
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
                  Replace <code className="rounded bg-muted px-1 font-mono text-foreground">YOUR_API_KEY</code> with your key.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
