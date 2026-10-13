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

/**
 * Supported banks/wallets shown as logos in the hero trust bar.
 *
 * To use a real logo, drop an image in `public/banks/` and set `src`
 * (e.g. src: "/banks/hbl.svg"). Until then, a brand-colored wordmark chip
 * is rendered as a placeholder. `short` overrides the chip text; `color`
 * is the chip background.
 */
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
    hint: "Insights on the dashboard and a REST API your product can build on today.",
    iconKey: "Zap",
  },
];

/**
 * Emotion stage (ELMR): the pain of building statement plumbing yourself.
 * Used by PainSection.
 */
export const PAIN_POINTS = [
  {
    label: "Weeks lost hand-keying PDFs",
    hint: "Your engineers reconcile statements by hand instead of building the product.",
    iconKey: "Clock",
  },
  {
    label: "Every bank is a different format",
    hint: "HBL, Meezan, JazzCash — each statement breaks the parser you built last week.",
    iconKey: "FileWarning",
  },
  {
    label: "One layout change, pipeline down",
    hint: "A bank tweaks its PDF and your data pipeline silently rots in production.",
    iconKey: "Bug",
  },
];

/**
 * Reward stage (ELMR): the payoff — time and focus returned to the team.
 * Used by OutcomeSection.
 */
export const OUTCOMES = [
  {
    stat: "Same-day",
    label: "Signup to categorized data",
    hint: "Upload a statement and get clean, structured data in an afternoon — not a quarter.",
  },
  {
    stat: "0 lines",
    label: "Of parser code to maintain",
    hint: "No per-bank parsers, no format babysitting. We own the messy part.",
  },
  {
    stat: "1 API",
    label: "Your whole team builds on",
    hint: "Transactions, balances, and AI categories — all behind one REST API.",
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

/**
 * Security/trust grouped into themes (reframed around user control).
 * Used by ComplianceSection.
 */
export const COMPLIANCE_GROUPS = [
  {
    title: "Your data stays in Pakistan",
    iconKey: "MapPin",
    points: ["Hosted in-country", "SBP-compliant", "Data residency by default"],
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
  { value: 10, suffix: "+", label: "Banks & wallets parsed" },
  { value: 100, suffix: "%", label: "Transactions AI-categorized" },
  { display: "AES-256", label: "Encryption at rest" },
  { display: "🇵🇰 PK", label: "Where your data lives" },
];

/** Footer navigation grouped into columns. Used by Footer. */
export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features", internal: true },
      { label: "Pricing", href: "/#pricing", internal: true },
      { label: "Security", href: "/#security", internal: true },
      { label: "Dashboard", href: "/auth", internal: true },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Lending & underwriting", href: "/use-cases#lending", internal: true },
      { label: "Personal finance", href: "/use-cases#pfm", internal: true },
      { label: "Accounting", href: "/use-cases#accounting", internal: true },
      { label: "All use cases", href: "/use-cases", internal: true },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API access", href: "/#api", internal: true },
      { label: "Get API keys", href: "/auth", internal: true },
      { label: "Supported banks", href: "/#features", internal: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/#contact", internal: true },
      { label: "Talk to sales", href: "mailto:hatif@joinsetl.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "mailto:hatif@joinsetl.com" },
      { label: "Terms", href: "mailto:hatif@joinsetl.com" },
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
