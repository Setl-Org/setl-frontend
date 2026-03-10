import { useState, useEffect, useCallback } from "react";

/**
 * useDataFetch - Fetches data with loading and error state.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {unknown[]} [deps=[]] - Dependencies for refetch
 * @returns {{ data: unknown, isLoading: boolean, error: Error | null, refetch: Function }}
 */
export function useDataFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...deps]);

  return { data, isLoading, error, refetch: fetchData };
}
