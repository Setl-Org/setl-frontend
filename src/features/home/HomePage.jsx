import { useState } from "react";
import {
  HeroSection,
  LandingNav,
  HowItWorksSection,
  ApiSection,
  PricingSection,
  ComplianceSection,
  CtaSection,
  Footer,
} from "./components";

/**
 * HomePage - Landing page composing nav, hero, product, API, pricing, compliance, CTA, and footer.
 * Follows feature module structure: page composes feature components only.
 */
export function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("PKR");

  return (
    <div className="min-h-screen overflow-x-hidden bg-primary">
      <LandingNav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <HeroSection />
      <HowItWorksSection />
      <ApiSection />
      <PricingSection currency={currency} />
      <ComplianceSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
