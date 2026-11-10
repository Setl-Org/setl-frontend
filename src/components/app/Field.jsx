import { cloneElement, forwardRef, isValidElement, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { AppButton } from "./AppButton";

const CONTROL =
  "w-full rounded-lg border border-hairline-strong bg-canvas px-3 text-[14px] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] hover:border-ink/25 focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/10 aria-[invalid=true]:border-negative aria-[invalid=true]:focus:ring-negative/10 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Field - Label, control, then either the error or a hint. Wires id, aria-invalid
 * and aria-describedby onto the child control so screen readers read the message.
 */
export function Field({ label, required = false, hint, error, children, className }) {
  const id = useId();
  const msgId = `${id}-msg`;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? msgId : undefined,
        "aria-required": required || undefined,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={children?.props?.id ?? id} className="block text-[13.5px] font-medium text-ink">
        {label}
        {!required && <span className="ml-1.5 font-normal text-ink-subtle">Optional</span>}
      </label>
      {control}
      {error ? (
        <p id={msgId} className="text-[12.5px] font-medium text-negative" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className="text-[12.5px] text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn(CONTROL, "h-10", className)} {...props} />;
});

export const TextArea = forwardRef(function TextArea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(CONTROL, "resize-none py-2.5 leading-relaxed", className)} {...props} />;
});

export const SelectInput = forwardRef(function SelectInput({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(CONTROL, "h-10 appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
    </div>
  );
});

/** DialogActions - Cancel on the left of the primary action, aligned right. */
export function DialogActions({ onCancel, submitLabel, submitting = false, submitIcon, disabled = false }) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <AppButton onClick={onCancel} disabled={submitting}>
        Cancel
      </AppButton>
      <AppButton type="submit" variant="primary" loading={submitting} leadingIcon={submitIcon} disabled={disabled}>
        {submitLabel}
      </AppButton>
    </div>
  );
}
