import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const DialogContext = createContext(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, onOpenChange, children }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const titleId = useId();
  const descriptionId = useId();

  const handleClose = () => setIsOpen(false);

  return (
    <DialogContext.Provider
      value={{ open: isOpen, onOpenChange: setIsOpen, handleClose, titleId, descriptionId }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children, ...props }) {
  const { onOpenChange } = useDialogContext();
  if (asChild) {
    return (
      <div onClick={() => onOpenChange(true)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

/**
 * DialogContent - Modal panel. Moves focus inside on open, keeps Tab inside,
 * returns focus to whatever opened it, closes on Esc or backdrop click, and
 * locks page scroll while open.
 */
export function DialogContent({
  className,
  children,
  onPointerDownOutside,
  onEscapeKeyDown,
  showClose = true,
}) {
  const { open, handleClose, titleId, descriptionId } = useDialogContext();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector("input, select, textarea") ?? panel?.querySelector(FOCUSABLE);
    (first ?? panel)?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onPointerDownOutside?.();
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onEscapeKeyDown?.();
      handleClose();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = [...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(
      (n) => n.offsetParent !== null
    );
    if (nodes.length === 0) return;
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === firstNode) {
      e.preventDefault();
      lastNode.focus();
    } else if (!e.shiftKey && document.activeElement === lastNode) {
      e.preventDefault();
      firstNode.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(20_20_20/0.45)] p-0 backdrop-blur-[2px] motion-safe:animate-[dialog-fade_160ms_ease-out] sm:items-center sm:p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn(
          "relative z-50 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--color-hairline,#e8e8ee)] bg-primary p-6 shadow-[0_24px_60px_-20px_rgb(20_20_20/0.35)] outline-none motion-safe:animate-[dialog-rise_200ms_cubic-bezier(0.2,0.8,0.2,1)] sm:rounded-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 pr-8 text-left", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  const { titleId } = useDialogContext();
  return (
    <h2
      id={titleId}
      className={cn("text-lg font-semibold tracking-[-0.01em] text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  const { descriptionId } = useDialogContext();
  return <p id={descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
