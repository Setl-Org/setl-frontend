import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { AppButton } from "./AppButton";

/**
 * InlineConfirm - Confirm a destructive action where the button was, instead of a
 * modal or window.confirm. The question names the consequence; Cancel takes focus
 * so Enter never confirms by accident; Esc backs out.
 */
export function InlineConfirm({
  label,
  icon,
  message,
  confirmLabel,
  onConfirm,
  triggerVariant = "secondary",
  size = "sm",
  className,
}) {
  const [state, setState] = useState("idle"); // idle | confirming | busy
  const cancelRef = useRef(null);
  const triggerRef = useRef(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (state === "confirming") cancelRef.current?.focus();
    if (state === "idle" && returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [state]);

  function cancel() {
    returnFocus.current = true;
    setState("idle");
  }

  async function confirm() {
    setState("busy");
    try {
      await onConfirm();
    } finally {
      setState((s) => (s === "busy" ? "idle" : s));
    }
  }

  if (state === "idle") {
    return (
      <AppButton
        ref={triggerRef}
        variant={triggerVariant}
        size={size}
        leadingIcon={icon}
        onClick={() => setState("confirming")}
        className={className}
      >
        {label}
      </AppButton>
    );
  }

  return (
    <div
      role="group"
      aria-label={message}
      onKeyDown={(e) => {
        if (e.key === "Escape" && state !== "busy") {
          e.stopPropagation();
          cancel();
        }
      }}
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-lg border border-negative/25 bg-negative-soft py-1 pl-3 pr-1",
        className
      )}
    >
      <span className="text-[13px] font-medium text-negative">{message}</span>
      <AppButton ref={cancelRef} size="sm" variant="ghost" onClick={cancel} disabled={state === "busy"}>
        Cancel
      </AppButton>
      <AppButton size="sm" variant="danger" onClick={confirm} loading={state === "busy"}>
        {confirmLabel}
      </AppButton>
    </div>
  );
}
