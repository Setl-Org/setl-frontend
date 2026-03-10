import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * useApiAction - Wraps async API calls with loading state and toast feedback.
 *
 * @param {Function} apiFn - Async function to execute (receives data, returns promise)
 * @param {string} successMessage - Message on success
 * @param {string} errorMessage - Message on error
 * @returns {{ execute: Function, isLoading: boolean }}
 */
export function useApiAction(apiFn, successMessage, errorMessage) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      try {
        const result = await apiFn(...args);
        toast.success(successMessage);
        return result;
      } catch (err) {
        toast.error(err?.errorMessage || errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn, successMessage, errorMessage]
  );

  return { execute, isLoading };
}
