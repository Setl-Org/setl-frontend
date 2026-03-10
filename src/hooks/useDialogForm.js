import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * useDialogForm - Form hook for dialogs with reset on open/close.
 *
 * @param {Object} options
 * @param {boolean} options.open - Dialog open state
 * @param {Object} options.defaultValues - Default form values
 * @param {Object} [options.initialData] - Data to populate when editing (resets when dialog opens)
 * @param {import("react-hook-form").Resolver} [options.resolver] - Validation resolver (e.g. zodResolver)
 * @returns {import("react-hook-form").UseFormReturn}
 */
export function useDialogForm({ open, defaultValues, initialData, resolver }) {
  const form = useForm({
    defaultValues,
    resolver,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData ?? defaultValues);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return form;
}
