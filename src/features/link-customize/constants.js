/**
 * Link customization - dummy data and defaults for the Plaid-style editor.
 * Frontend only: nothing here is sent to the backend.
 */

/** Screens of the Setl connect flow, in the order an end user meets them. */
export const SCREENS = [
  {
    id: "consent",
    label: "Consent",
    description: "What users see when they first open Setl Link, and where they agree to Setl's privacy policy.",
  },
  {
    id: "otp",
    label: "Mobile verification",
    description: "Where users confirm their Pakistani mobile number with a one-time passcode.",
  },
  {
    id: "institutionSelect",
    label: "Institution select",
    description: "Where users pick from the banks and wallets Pakistanis link most, or search for one not shown.",
  },
  {
    id: "institutionSearch",
    label: "Institution search",
    description: "Where users search every bank, microfinance bank and wallet Setl supports.",
  },
  {
    id: "dataTransparency",
    label: "Data transparency",
    description: "Where users review exactly what your app will read and for how long, before they share it.",
  },
  {
    id: "statementUpload",
    label: "Statement upload",
    description: "Where users upload the e-statement their bank emailed them. Bank sign-in opens as each institution joins Setl.",
  },
  {
    id: "statementReview",
    label: "Statement review",
    description: "Where users check what Setl read from their statement before it reaches your app.",
  },
  {
    id: "accountSelect",
    label: "Account select",
    description: "Where users choose which accounts your app receives. You get no data from accounts they leave out.",
  },
  {
    id: "success",
    label: "Success",
    description: "What users see once their accounts are connected, just before they return to your app.",
  },
  {
    id: "error",
    label: "Error",
    description: "What users see when something goes wrong, and the way forward you offer them.",
  },
  {
    id: "exit",
    label: "Exit",
    description: "What users see when they try to close Link before they finish.",
  },
];

/** Panel rows. "appearance" is not a screen; it styles every screen. */
export const PANEL_ITEMS = [
  { id: "appearance", label: "Background and button colour" },
  ...SCREENS.map(({ id, label }) => ({ id, label })),
];

/**
 * Institutions shown on Institution select. Names match the BankLogo lookup in
 * lib/bankLogos.js so each one gets its real tile.
 */
export const FEATURED_INSTITUTIONS = [
  { name: "HBL", type: "bank", app: "HBL Mobile" },
  { name: "Meezan Bank", type: "bank", app: "Meezan Mobile" },
  { name: "MCB", type: "bank", app: "MCB Live" },
  { name: "UBL", type: "bank", app: "UBL Digital" },
  { name: "Bank Alfalah", type: "bank", app: "Alfa" },
  { name: "Faysal Bank", type: "bank", app: "Faysal DigiBank" },
  { name: "Standard Chartered", type: "bank", app: "SC Mobile" },
  { name: "Askari Bank", type: "bank", app: "Askari Mobile" },
  { name: "JazzCash", type: "wallet", app: "JazzCash" },
  { name: "Easypaisa", type: "wallet", app: "Easypaisa" },
  { name: "SadaPay", type: "wallet", app: "SadaPay" },
  { name: "NayaPay", type: "wallet", app: "NayaPay" },
];

/** Extra institutions that only appear in search results (no logo tile, generic icon). */
export const SEARCH_ONLY_INSTITUTIONS = [
  { name: "Allied Bank", type: "bank" },
  { name: "Bank Al Habib", type: "bank" },
  { name: "BankIslami", type: "bank" },
  { name: "Bank of Punjab", type: "bank" },
  { name: "Dubai Islamic Bank Pakistan", type: "bank" },
  { name: "Habib Metropolitan Bank", type: "bank" },
  { name: "JS Bank", type: "bank" },
  { name: "National Bank of Pakistan", type: "bank" },
  { name: "Soneri Bank", type: "bank" },
  { name: "Mobilink Microfinance Bank", type: "microfinance" },
  { name: "Telenor Microfinance Bank", type: "microfinance" },
];

export const ALL_INSTITUTIONS = [...FEATURED_INSTITUTIONS, ...SEARCH_ONLY_INSTITUTIONS];

/** Data scopes the client app can request. Toggled in the stage's "Preview scopes" row. */
export const SCOPES = [
  { id: "accounts", scope: "accounts:read", label: "Account details", detail: "Account title, bank and masked IBAN" },
  { id: "balances", scope: "balances:read", label: "Balances", detail: "Current and available balance in PKR" },
  { id: "transactions", scope: "transactions:read", label: "Transactions", detail: "Credits, debits and Raast or IBFT references" },
  { id: "identity", scope: "identity:read", label: "Account holder", detail: "Name, mobile number and email on the account" },
];

export const DEFAULT_SCOPES = ["accounts", "transactions"];

/** Phrases that finish "<client> uses Setl to ..." on the consent screen. */
export const USE_CASES = [
  { value: "connect", label: "Connect your account", phrase: "connect your account" },
  { value: "income", label: "Verify your income", phrase: "verify your income" },
  { value: "lending", label: "Check eligibility for a loan", phrase: "check your eligibility for a loan" },
  { value: "payouts", label: "Set up payouts", phrase: "set up payouts to your account" },
  { value: "budgeting", label: "Track your spending", phrase: "track your spending" },
];

export const ACCESS_PERIODS = [
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 180, label: "180 days" },
  { value: 0, label: "Until revoked" },
];

export const ERROR_PREVIEWS = [
  { value: "unavailable", label: "Bank sign-in not available yet" },
  { value: "unreadable", label: "Statement could not be read" },
  { value: "password", label: "Wrong PDF password" },
  { value: "expired", label: "Session expired" },
];

export const BACKGROUND_PRESETS = [
  { value: "#E9E8EE", label: "Grey" },
  { value: "#F3EEF9", label: "Lilac" },
  { value: "#E6F5ED", label: "Mint" },
  { value: "#FFFFFF", label: "White" },
  { value: "#1C1B22", label: "Ink" },
];

export const ACCENT_PRESETS = [
  { value: "#141414", label: "Ink" },
  { value: "#7C3AED", label: "Violet" },
  { value: "#0E7A4A", label: "Green" },
  { value: "#1D4ED8", label: "Blue" },
  { value: "#B4232A", label: "Red" },
];

/** Settings for a new customization. Sections are keyed by screen id. */
export const DEFAULT_SETTINGS = {
  appearance: { background: "#E9E8EE", accent: "#141414" },
  consent: {
    header: "setl",
    clientName: "Northwind Finance",
    useCase: "connect",
    askPhone: true,
    button: "Continue",
  },
  otp: { length: 6, channel: "sms", resendSeconds: 30 },
  institutionSelect: { title: "Select your bank or wallet", types: "all", layout: "grid" },
  institutionSearch: { placeholder: "Search banks and wallets", offerUpload: true },
  dataTransparency: { purpose: "check your income and offer you a loan", accessDays: 90 },
  statementUpload: { title: "Upload your statement", months: 3, allowLocked: true, allowImages: false },
  statementReview: { showTransactions: true, button: "Looks right" },
  accountSelect: { mode: "multi" },
  success: { title: "You're connected", button: "Done" },
  error: { offerUpload: true, support: "support@northwind.example" },
  exit: { title: "Leave without connecting?", askReason: true },
};

/** Dummy accounts for Account select. Built per institution so the bank name carries through. */
export function dummyAccounts(institution) {
  const wallet = institution?.type === "wallet";
  if (wallet) {
    return [
      { id: "w1", name: `${institution.name} wallet`, mask: "0300 ••• 4521", balance: 18450 },
      { id: "w2", name: "Savings pocket", mask: "0300 ••• 4521", balance: 62000 },
    ];
  }
  return [
    { id: "a1", name: "Current account", mask: "PK•• •••• 4521", balance: 245310.5 },
    { id: "a2", name: "Savings account", mask: "PK•• •••• 7790", balance: 1120000 },
    { id: "a3", name: "Foreign currency (USD)", mask: "PK•• •••• 3108", balance: 1840, currency: "USD" },
  ];
}

/** Dummy parsed statement for Statement review. Period is Aug to Oct 2026. */
export const DUMMY_STATEMENT = {
  period: "1 Aug to 31 Oct 2026",
  pages: 6,
  transactionCount: 142,
  opening: 198200,
  closing: 245310.5,
  rows: [
    { id: "t1", date: "30 Oct", label: "Salary credit", amount: 185000 },
    { id: "t2", date: "28 Oct", label: "K-Electric bill", amount: -8420 },
    { id: "t3", date: "26 Oct", label: "Raast from Ali Traders", amount: 25000 },
    { id: "t4", date: "24 Oct", label: "IBFT to Meezan ••7781", amount: -15000 },
    { id: "t5", date: "21 Oct", label: "Daraz.pk", amount: -3299 },
  ],
};

export const EXIT_REASONS = [
  "My bank isn't listed",
  "I don't have my statement",
  "I'm not comfortable sharing my data",
  "Something else",
];

export const STORAGE_KEY = "setl.link.customizations";
export const DEFAULT_CUSTOMIZATION_ID = "default";
