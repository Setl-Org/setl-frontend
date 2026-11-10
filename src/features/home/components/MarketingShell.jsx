import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LandingNav } from "./LandingNav";
import { Footer } from "./Footer";
import "../landing.css";

const TITLES = {
  "/": "Setl | Bank Connectivity API for Pakistan",
  "/products": "Products · Setl",
  "/use-cases": "Use cases · Setl",
  "/developers": "Developer docs · Setl",
  "/pricing": "Pricing · Setl",
  "/about": "About · Setl",
};

/**
 * MarketingShell - Shared chrome for the public site: nav, page, footer.
 */
export function MarketingShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname];
  }, [pathname]);

  return (
    <div className="mkt min-h-screen bg-white text-[#141414]">
      <LandingNav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
