import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_TITLE = "Setl | Bank Connectivity API for Pakistan";

/** Tab titles for public pages. Signed-in pages set their own through PageHeader. */
const TITLES = {
  "/": DEFAULT_TITLE,
  "/products": "Products · Setl",
  "/use-cases": "Use cases · Setl",
  "/developers": "Developer docs · Setl",
  "/pricing": "Pricing · Setl",
  "/about": "About · Setl",
  "/auth": "Sign in · Setl",
  "/404": "Page not found · Setl",
};

export function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname in TITLES) document.title = TITLES[pathname];
  }, [pathname]);
  return null;
}
