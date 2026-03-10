import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";

const DialogContext = createContext(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
}

export function Dialog({ open, onOpenChange, children }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleClose = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen, handleClose }}>
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

export function DialogContent({
  className,
  children,
  onPointerDownOutside,
  onEscapeKeyDown,
}) {
  const { open, handleClose } = useDialogContext();

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onPointerDownOutside?.();
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onEscapeKeyDown?.();
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border border-border bg-primary p-6 shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
