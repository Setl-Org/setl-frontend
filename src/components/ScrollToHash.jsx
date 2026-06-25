import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToHash - Scrolls to the element matching `location.hash` after navigation.
 *
 * React Router v6 does not restore hash scroll on its own. This lets nav links
 * like `/#features` or `/use-cases#lending` work from any page: the route loads,
 * then we smooth-scroll to the target id. Renders nothing.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    // Wait a tick so the destination page has mounted its sections.
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
