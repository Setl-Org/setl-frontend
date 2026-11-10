/**
 * Home/landing feature constants.
 * Used by HeroSection, HowItWorksSection, PricingSection, ComplianceSection.
 */

/** Wordmarks only. Real bank logos stay off the site until a bank is connected. */
export const BANK_LOGOS = [
  { name: "HBL", slug: "hbl", color: "#0B6E3B", src: null },
  { name: "MCB", slug: "mcb", color: "#00674A", src: null },
  { name: "UBL", slug: "ubl", color: "#0067A0", src: null },
  { name: "SadaPay", slug: "sadapay", short: "Sada", color: "#0E1116", src: null },
  { name: "JazzCash", slug: "jazzcash", short: "Jazz", color: "#E2231A", src: null },
  { name: "Easypaisa", slug: "easypaisa", short: "easypaisa", color: "#5CB531", src: null },
  { name: "Faysal Bank", slug: "faysal", short: "Faysal", color: "#00713B", src: null },
  { name: "Meezan Bank", slug: "meezan", short: "Meezan", color: "#00683C", src: null },
  { name: "Raast", slug: "raast", color: "#0E8A6B", src: null },
  { name: "1Link", slug: "1link", short: "1LINK", color: "#1B75BC", src: null },
];

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
    label: "Your user consents",
    hint: "They approve exactly what your app can read. Access is scoped and can be revoked.",
    iconKey: "ShieldCheck",
  },
  {
    step: 2,
    label: "They connect their bank",
    hint: "Authentication stays on the bank's own channel. Setl never sees the password.",
    iconKey: "Landmark",
  },
  {
    step: 3,
    label: "Setl normalizes",
    hint: "Accounts, balances, and transactions come back in one schema, including Raast and 1Link references.",
    iconKey: "Layers",
  },
  {
    step: 4,
    label: "You call one API",
    hint: "Your product reads every connected account through the same REST API.",
    iconKey: "Zap",
  },
];

/**
 * Emotion stage (ELMR): the cost of integrating each bank yourself.
 * Used by PainSection.
 */
export const PAIN_POINTS = [
  {
    label: "A new integration for every bank",
    hint: "HBL, Meezan, JazzCash — each institution is its own project, contract, and maintenance burden.",
    iconKey: "Building2",
  },
  {
    label: "Credentials you should never hold",
    hint: "Shared logins and screen-scraping put your users, and your license, at risk.",
    iconKey: "KeyRound",
  },
  {
    label: "No standard account-data layer",
    hint: "Money already moves on Raast and 1Link. A consented way to read the account does not.",
    iconKey: "Unlink",
  },
];

/**
 * Reward stage (ELMR): one connector, one schema, no stored bank logins.
 * Used by OutcomeSection.
 */
export const OUTCOMES = [
  {
    stat: "1 API",
    label: "For every connected account",
    hint: "Balances and transactions in one schema. Your app calls Setl, not each bank.",
  },
  {
    stat: "0",
    label: "Bank logins you store",
    hint: "People authenticate on the bank's own channel. Consent is scoped and revocable.",
  },
  {
    stat: "1 schema",
    label: "Across institutions",
    hint: "The same account and transaction shape, built for Raast and 1Link references.",
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
    connections: "Coming soon",
    analytics: { PKR: "Included", AED: "Included", SAR: "Included" },
    api: { PKR: "Included", AED: "Included", SAR: "Included" },
    support: { PKR: "Email support", AED: "Email support", SAR: "Email support" },
  },
  {
    name: "Growth / Scale",
    connections: "Coming soon",
    analytics: { PKR: "Advanced", AED: "Advanced", SAR: "Advanced" },
    api: { PKR: "Higher limits", AED: "Higher limits", SAR: "Higher limits" },
    support: { PKR: "Priority support", AED: "Priority support", SAR: "Priority support" },
  },
];

export const COMPLIANCE_ITEMS = [
  "Data in Pakistan",
  "AES-256-GCM encryption",
  "Consent-scoped access",
  "Bank connectivity API",
  "Transaction categories",
  "Secure API access",
  "TLS 1.3",
  "Encrypted at rest",
  "Designed for SBP user-data rules",
  "Dashboard analytics",
  "Revocable consent",
  "REST API access",
];

/**
 * Security/trust grouped into themes (reframed around user control).
 * Used by ComplianceSection.
 */
export const COMPLIANCE_GROUPS = [
  {
    title: "Your data stays in Pakistan",
    iconKey: "MapPin",
    points: ["Hosted in-country", "Designed for SBP user-data rules", "Data residency by default"],
  },
  {
    title: "Encrypted end to end",
    iconKey: "Lock",
    points: ["AES-256-GCM at rest", "TLS 1.3 in transit", "Encrypted backups"],
  },
  {
    title: "You control access",
    iconKey: "KeyRound",
    points: ["Scoped API keys", "Secure REST access", "Revoke keys anytime"],
  },
];

/**
 * Product-true metrics for the credibility band (no fabricated scale stats).
 * `value` is animated with a count-up; `display` is shown verbatim.
 * Used by MetricsSection.
 */
export const METRICS = [
  { display: "1", label: "API for connected accounts" },
  { display: "0", label: "Bank passwords stored" },
  { display: "AES-256", label: "Encryption at rest" },
  { display: "PK", label: "Data stays in Pakistan" },
];

/** Footer navigation grouped into columns. Used by Footer. */
export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Connect", href: "/products#connect", internal: true },
      { label: "Accounts", href: "/products#accounts", internal: true },
      { label: "Transactions", href: "/products#transactions", internal: true },
      { label: "Pricing", href: "/pricing", internal: true },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Lending", href: "/use-cases#lending", internal: true },
      { label: "Personal finance", href: "/use-cases#pfm", internal: true },
      { label: "Accounting", href: "/use-cases#accounting", internal: true },
      { label: "All use cases", href: "/use-cases", internal: true },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/developers", internal: true },
      { label: "Quickstart", href: "/developers#quickstart", internal: true },
      { label: "API reference", href: "/developers#reference", internal: true },
      { label: "Get API keys", href: "/auth", internal: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about", internal: true },
      { label: "Security", href: "/#security", internal: true },
      { label: "Contact", href: "/pricing#contact", internal: true },
      { label: "info@joinsetl.com", href: "mailto:info@joinsetl.com" },
    ],
  },
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
