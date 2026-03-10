import { FormErrorMessage } from "./FormErrorMessage";

/**
 * FormField - Wraps form inputs with label and error display.
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {boolean} [props.required=false] - Show required asterisk
 * @param {string} [props.error] - Error message
 * @param {string} props.id - Input id for label association
 * @param {string} [props.hint] - Helper text below input
 * @param {React.ReactNode} props.children - Input element
 */
export function FormField({ label, required = false, error, id, hint, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
