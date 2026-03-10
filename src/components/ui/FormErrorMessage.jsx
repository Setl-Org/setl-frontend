/**
 * FormErrorMessage - Displays form validation error messages.
 */
export function FormErrorMessage({ children }) {
  if (!children) return null;
  return <p className="text-sm text-error">{children}</p>;
}
