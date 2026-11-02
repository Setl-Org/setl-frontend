/**
 * Use-cases feature constants.
 * Each use case is a workflow a builder ships on Setl's bank-connectivity API:
 * consented Pakistani account data — balances, transactions, and categories —
 * through one integration.
 * `iconKey` maps to a lucide-react icon in UseCasesPage.
 */
export const USE_CASES = [
  {
    slug: "lending",
    iconKey: "Landmark",
    title: "Lending & underwriting",
    summary:
      "Read income and cash flow from the accounts a borrower connects, and underwrite on structured transactions.",
    points: [
      "Income and salary patterns from real transactions",
      "Cash-flow trends to score thin-file applicants",
      "Evidence-backed credit decisions from connected accounts",
    ],
  },
  {
    slug: "pfm",
    iconKey: "Wallet",
    title: "Personal finance management",
    summary:
      "Power budgeting and money apps with categorized transactions from the accounts a user connects.",
    points: [
      "Transactions categorized for the apps you ship",
      "Spending across multiple banks and wallets",
      "One view of every account the user connects",
    ],
  },
  {
    slug: "accounting",
    iconKey: "Calculator",
    title: "Accounting & bookkeeping",
    summary:
      "Reconcile and categorize business transactions from connected accounts so the books can close.",
    points: [
      "Ledger-ready entries from connected business accounts",
      "The same schema for every institution a business connects",
      "Structured data your accounting stack can import",
    ],
  },
  {
    slug: "fraud",
    iconKey: "ShieldCheck",
    title: "Fraud & risk",
    summary:
      "Give a risk product real account activity from the connection, so anomalies sit on genuine transactions.",
    points: [
      "Surface unusual flows and duplicate entries",
      "Cross-check declared income against connected activity",
      "Build risk models on structured account data",
    ],
  },
  {
    slug: "identity",
    iconKey: "BadgeCheck",
    title: "Identity & account verification",
    summary:
      "Use the connected account to confirm who holds it and that it is in use during onboarding.",
    points: [
      "Read the account holder and account details the connection returns",
      "See that the account is active and in use",
      "Catch mismatched accounts before money moves",
    ],
  },
  {
    slug: "wealth",
    iconKey: "TrendingUp",
    title: "Wealth & investing",
    summary:
      "Give users a financial picture by aggregating every account they connect.",
    points: [
      "Balance trends over time",
      "Inflows across connected accounts",
      "A profile your advice product can personalize",
    ],
  },
  {
    slug: "expense",
    iconKey: "ReceiptText",
    title: "Expense management",
    summary:
      "Track and categorize company spend from the corporate accounts a business connects.",
    points: [
      "Categorize business expenses as they post",
      "Flag out-of-policy spend for review",
      "Feed clean spend data into approval flows",
    ],
  },
  {
    slug: "payments",
    iconKey: "ArrowLeftRight",
    title: "Payments & reconciliation",
    summary:
      "Match incoming payments against connected-account transactions, including local rails.",
    points: [
      "Reconcile collections against transaction lines",
      "Detect missed or partial settlements",
      "Follow Raast and 1Link transfers in the same feed",
    ],
  },
];
