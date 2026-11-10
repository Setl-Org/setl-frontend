import { useOutletContext } from "react-router-dom";

/**
 * useApp - Shared app state provided by AppShell through the router outlet:
 *   user, accounts { items, status, refresh }, summary { data, status, refresh },
 *   openAddAccount(), openUpload(), openCommand(), signOut().
 * status is "loading" | "ready" | "error".
 */
export function useApp() {
  return useOutletContext();
}
