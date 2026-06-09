/**
 * Home/landing feature constants.
 * Used by HeroSection, HowItWorksSection, PricingSection, ComplianceSection.
 */

export const BANKS = [
  "HBL",
  "MCB",
  "UBL",
  "SadaPay",
  "JazzCash",
  "Easypaisa",
  "Faysal Bank",
  "Meezan Bank",
  "Raast",
  "1Link",
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    label: "Sign in",
    hint: "Access your dashboard in seconds. No direct bank connection.",
    iconKey: "LogIn",
  },
  {
    step: 2,
    label: "Select bank & upload",
    hint: "Pick your bank, then upload PDF account statements by month.",
    iconKey: "FileUp",
  },
  {
    step: 3,
    label: "We parse",
    hint: "We extract and categorize every transaction securely.",
    iconKey: "FileSearch",
  },
  {
    step: 4,
    label: "Analytics & API",
    hint: "View insights on the dashboard and access data via REST API.",
    iconKey: "Zap",
  },
];

/** Country/currency options for navbar selector and pricing. */
export const CURRENCIES = [
  { id: "PKR", abbr: "PK", label: "Pakistan", symbol: "Rs", flag: "🇵🇰" },
  { id: "AED", abbr: "AE", label: "UAE", symbol: "AED", flag: "🇦🇪" },
  { id: "SAR", abbr: "SA", label: "Saudi Arabia", symbol: "SAR", flag: "🇸🇦" },
];

export const PRICING_PLANS = [
  {
    name: "Pay as you go",
    statements: "Coming soon",
    analytics: { PKR: "Included", AED: "Included", SAR: "Included" },
    api: { PKR: "Included", AED: "Included", SAR: "Included" },
    support: { PKR: "Email support", AED: "Email support", SAR: "Email support" },
  },
  {
    name: "Growth / Scale",
    statements: "Coming soon",
    analytics: { PKR: "Advanced", AED: "Advanced", SAR: "Advanced" },
    api: { PKR: "Higher limits", AED: "Higher limits", SAR: "Higher limits" },
    support: { PKR: "Priority support", AED: "Priority support", SAR: "Priority support" },
  },
];

export const COMPLIANCE_ITEMS = [
  "Data in Pakistan",
  "AES-256-GCM encryption",
  "PDF statement parsing",
  "Multi-bank support",
  "AI categorization",
  "Secure API access",
  "TLS 1.3",
  "Encrypted at rest",
  "SBP-compliant",
  "Dashboard analytics",
  "Batch upload by month",
  "REST API access",
];

/** Framer Motion variants for staggered fade-in-up (landing sections). */
export const FADE_IN_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

/** Stagger children for motion groups. */
export const STAGGER = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
