/**
 * Use-cases feature constants.
 * Each use case mirrors a classic open-banking workflow, reframed around what
 * Setl actually does: turn uploaded PDF bank statements into clean,
 * AI-categorized transaction data and a REST API — built for Pakistani fintechs.
 * `iconKey` maps to a lucide-react icon in UseCasesPage.
 */
export const USE_CASES = [
  {
    slug: "lending",
    iconKey: "Landmark",
    title: "Lending & underwriting",
    summary:
      "Verify income and cash flow straight from a borrower's statements — no manual review, no waiting on the bank.",
    points: [
      "Income and salary detection from real transactions",
      "Cash-flow trends to score thin-file applicants",
      "Faster, evidence-backed credit decisions",
    ],
  },
  {
    slug: "pfm",
    iconKey: "Wallet",
    title: "Personal finance management",
    summary:
      "Power budgeting and money apps with categorized transactions your users instantly recognize.",
    points: [
      "Every transaction AI-categorized out of the box",
      "Spending insights across multiple banks and wallets",
      "A unified view from statements your users already have",
    ],
  },
  {
    slug: "accounting",
    iconKey: "Calculator",
    title: "Accounting & bookkeeping",
    summary:
      "Auto-reconcile and categorize business transactions so the books close themselves.",
    points: [
      "Clean ledger entries from messy PDF statements",
      "Reconcile across HBL, Meezan, UBL and more",
      "Export structured data to your accounting stack",
    ],
  },
  {
    slug: "fraud",
    iconKey: "ShieldCheck",
    title: "Fraud & risk",
    summary:
      "Spot anomalies and confirm real account activity from genuine statement data.",
    points: [
      "Surface unusual flows and duplicate entries",
      "Cross-check declared income against the statement",
      "Build risk models on structured, reliable data",
    ],
  },
  {
    slug: "identity",
    iconKey: "BadgeCheck",
    title: "Identity & account verification",
    summary:
      "Confirm account ownership and details from statement metadata during onboarding.",
    points: [
      "Match account holder name and number",
      "Validate the account is active and in use",
      "Reduce onboarding fraud before it starts",
    ],
  },
  {
    slug: "wealth",
    iconKey: "TrendingUp",
    title: "Wealth & investing",
    summary:
      "Give users a full financial picture by aggregating data from every statement.",
    points: [
      "Net-worth and balance trends over time",
      "Holdings and inflows pulled from statements",
      "A complete profile to personalize advice",
    ],
  },
  {
    slug: "expense",
    iconKey: "ReceiptText",
    title: "Expense management",
    summary:
      "Track and categorize company spend from corporate and card statements automatically.",
    points: [
      "Categorize every business expense by month",
      "Flag out-of-policy spend for review",
      "Feed clean spend data into approval flows",
    ],
  },
  {
    slug: "payments",
    iconKey: "ArrowLeftRight",
    title: "Payments & reconciliation",
    summary:
      "Match incoming payments against transaction records without spreadsheets.",
    points: [
      "Reconcile collections against statement lines",
      "Detect missed or partial settlements",
      "Close the loop on Raast and 1Link transfers",
    ],
  },
];
