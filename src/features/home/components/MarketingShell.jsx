import { useState } from "react";
import { LandingNav } from "./LandingNav";
import { Footer } from "./Footer";

/**
 * MarketingShell - Shared chrome for the public site: nav, page, footer.
 */
export function MarketingShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
