import { Outlet } from "react-router-dom";

/**
 * Layout - Base layout wrapper for pages.
 * Use with React Router's layout routes.
 * Extend with shared header/sidebar as needed.
 */
export function Layout() {
  return <Outlet />;
}
