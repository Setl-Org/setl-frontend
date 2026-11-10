import {
  Home,
  Landmark,
  Code2,
  ShieldCheck,
  HelpCircle,
  Settings,
  Building2,
  Receipt,
  BarChart3,
  KeyRound,
  AppWindow,
  BookOpen,
  FileText,
} from "lucide-react";

/**
 * Sidebar structure, Plaid-shaped: top-level items, expandable groups whose
 * children are indented text links, and a pinned footer. Only real destinations
 * are listed; there are no "coming soon" entries.
 *
 * Item: { id, label, icon, to, end?, href?, external? }
 * Group: { id, label, icon, children: Item[] }
 */
export const NAV_MAIN = [
  { id: "home", label: "Home", icon: Home, to: "/dashboard", end: true },
  {
    id: "data",
    label: "Banking data",
    icon: Landmark,
    children: [
      { id: "accounts", label: "Accounts", icon: Building2, to: "/dashboard/accounts" },
      { id: "transactions", label: "Transactions", icon: Receipt, to: "/dashboard/transactions" },
      { id: "insights", label: "Insights", icon: BarChart3, to: "/dashboard/insights" },
    ],
  },
  {
    id: "developers",
    label: "Developers",
    icon: Code2,
    children: [
      { id: "keys", label: "Keys", icon: KeyRound, to: "/developer", end: true },
      { id: "apps", label: "OAuth apps", icon: AppWindow, to: "/developer/apps" },
      { id: "api", label: "API reference", icon: FileText, to: "/developer/api" },
      { id: "docs", label: "Docs", icon: BookOpen, href: "/developers", external: true },
    ],
  },
  { id: "connected-apps", label: "Connected apps", icon: ShieldCheck, to: "/dashboard/connected-apps" },
];

export const NAV_FOOTER = [
  { id: "help", label: "Get help", icon: HelpCircle, href: "/#contact" },
  { id: "settings", label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

/** Flat list of destinations for the command menu. */
export const NAV_DESTINATIONS = [
  ...NAV_MAIN.flatMap((item) => (item.children ? item.children : [item])),
  ...NAV_FOOTER,
];

export const SIDEBAR_COLLAPSED_KEY = "setl.sidebar.collapsed";
