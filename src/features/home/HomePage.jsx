import { useState } from "react";
import {
  HeroSection,
  LandingNav,
  PainSection,
  HowItWorksSection,
  MetricsSection,
  AiShowcaseSection,
  ApiSection,
  PricingSection,
  ComplianceSection,
  OutcomeSection,
  ContactSection,
  CtaSection,
  Footer,
} from "./components";

/**
 * HomePage - Landing page composing nav, hero, product, API, pricing, compliance, CTA, and footer.
 * Follows feature module structure: page composes feature components only.
 */
export function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Currency is fixed to PKR now that the selector has been removed from the nav.
  const [currency] = useState("PKR");

  return (
    <div className="min-h-screen overflow-x-hidden bg-primary">
      <LandingNav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />
      <HeroSection />
      <PainSection />
      <HowItWorksSection />
      <MetricsSection />
      <AiShowcaseSection />
      <ApiSection />
      <PricingSection currency={currency} />
      <ComplianceSection />
      <OutcomeSection />
      <ContactSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
