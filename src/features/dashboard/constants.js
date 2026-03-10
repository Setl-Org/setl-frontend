/**
 * Dashboard dummy data for prototyping.
 */

/** Banks for account and upload dropdowns. */
export const BANKS = [
  "HBL",
  "MCB",
  "UBL",
  "SadaPay",
  "JazzCash",
  "Easypaisa",
  "Faysal Bank",
  "Meezan Bank",
];

/** Initial dummy accounts (user can add more). */
export const INITIAL_ACCOUNTS = [
  { id: "acc-1", bank: "HBL", name: "Primary", mask: "****4521", accountNumber: "4521" },
  { id: "acc-2", bank: "MCB", name: "Savings", mask: "****7890", accountNumber: "7890" },
];

/** Months for statement upload. */
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const STAT_CARDS = [
  { label: "Statements uploaded", value: "12", sub: "Last 30 days", iconKey: "FileUp" },
  { label: "Total transactions", value: "2,847", sub: "Parsed & categorized", iconKey: "Receipt" },
  { label: "Connected accounts", value: "3", sub: "Across 2 banks", iconKey: "Building2" },
];

/** Monthly transaction counts for bar chart (last 6 months). */
export const TRANSACTIONS_BY_MONTH = [
  { month: "Oct", count: 420 },
  { month: "Nov", count: 580 },
  { month: "Dec", count: 612 },
  { month: "Jan", count: 489 },
  { month: "Feb", count: 546 },
  { month: "Mar", count: 200 },
];

/** Spending by category for horizontal bar chart. */
export const SPENDING_BY_CATEGORY = [
  { label: "Food & Dining", value: 12400, color: "bg-tertiary" },
  { label: "Utilities", value: 8200, color: "bg-tertiary/80" },
  { label: "Transfer", value: 15000, color: "bg-tertiary/60" },
  { label: "Shopping", value: 5600, color: "bg-tertiary/50" },
  { label: "Other", value: 3100, color: "bg-muted-foreground/40" },
];

/** Balance trend (last 7 points) for line-style chart. */
export const BALANCE_TREND = [
  { label: "22 Feb", balance: 125000 },
  { label: "1 Mar", balance: 118200 },
  { label: "5 Mar", balance: 132400 },
  { label: "8 Mar", balance: 129100 },
  { label: "10 Mar", balance: 131500 },
];

/** Parsed transactions (descending date) for table. */
export const PARSED_TRANSACTIONS = [
  { id: "1", date: "2025-03-10", description: "JazzCash Top-up", amount: -500, category: "Transfer", balance: 131500, account: "HBL Primary" },
  { id: "2", date: "2025-03-10", description: "Salary Credit", amount: 85000, category: "Income", balance: 132000, account: "HBL Primary" },
  { id: "3", date: "2025-03-09", description: "K-Electric Bill", amount: -4200, category: "Utilities", balance: 47000, account: "MCB Savings" },
  { id: "4", date: "2025-03-09", description: "FoodPanda", amount: -1250, category: "Food & Dining", balance: 51200, account: "HBL Primary" },
  { id: "5", date: "2025-03-08", description: "HBL ATM Withdrawal", amount: -10000, category: "Cash", balance: 52450, account: "HBL Primary" },
  { id: "6", date: "2025-03-08", description: "Raast In - From Client", amount: 25000, category: "Transfer", balance: 62450, account: "MCB Savings" },
  { id: "7", date: "2025-03-07", description: "SadaPay Payment", amount: -3200, category: "Shopping", balance: 37450, account: "MCB Savings" },
  { id: "8", date: "2025-03-06", description: "UBL Fund Transfer", amount: -15000, category: "Transfer", balance: 40650, account: "HBL Primary" },
  { id: "9", date: "2025-03-05", description: "Interest Credit", amount: 420, category: "Income", balance: 55650, account: "MCB Savings" },
  { id: "10", date: "2025-03-04", description: "Faysal Bank POS", amount: -1890, category: "Food & Dining", balance: 55230, account: "HBL Primary" },
];
