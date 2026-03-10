import { Button } from "./Button";

/**
 * DialogFormFooter - Standard footer for dialog forms with cancel and submit.
 *
 * @param {Object} props
 * @param {() => void} props.onCancel - Cancel callback
 * @param {string} [props.submitText="Save"] - Submit button text
 * @param {boolean} [props.isLoading=false] - Loading state for submit
 */
export function DialogFormFooter({
  onCancel,
  submitText = "Save",
  isLoading = false,
}) {
  return (
    <div className="flex justify-end gap-2 pt-6">
      <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? "Saving..." : submitText}
      </Button>
    </div>
  );
}
