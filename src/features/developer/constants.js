import { browserSafeApiBase } from "@/lib/api";

export const ALL_SCOPES = [
  { value: "transactions:read", label: "Transactions", description: "View transactions on the accounts the user selects" },
  { value: "accounts:read", label: "Accounts", description: "View the accounts the user selects" },
  { value: "profile:read", label: "Profile", description: "View the user's profile information" },
];

export const EXTERNAL_API_BASE = browserSafeApiBase(
  import.meta.env.VITE_EXTERNAL_API_BASE_URL ||
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1").replace(
      /\/api\/v1$/,
      "/api/external/v1"
    ),
  { absolute: true }
);

export const API_BASE_FOR_DOCS = browserSafeApiBase(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  { absolute: true }
);

export const OAUTH_STEPS = [
  ["Register your app", "Create an OAuth client to get a client_id and client_secret."],
  ["Create a connect session", "From your server, POST /oauth/connect/sessions with the secret, redirect URI and scopes."],
  ["Customer approves", "Open the connect URL. The customer signs in, picks accounts and approves for 90 days."],
  ["Exchange the code", "Setl redirects back with a one-time code. POST it to /oauth/token from your server."],
  ["Read the consent", "Call the external API with the access token. Responses include only the accounts they selected."],
];

export const TOKEN_LIFETIMES = [
  ["Connect session", "30 minutes"],
  ["Auth code", "10 minutes"],
  ["Consent", "90 days"],
  ["Access token", "1 hour"],
  ["Refresh token", "30 days"],
  ["Personal API key", "365 days"],
];

export const SCOPED_ENDPOINTS = [
  ["transactions:read", "GET /transactions, GET /transactions/:id"],
  ["accounts:read", "GET /accounts"],
  ["profile:read", "GET /profile"],
];
