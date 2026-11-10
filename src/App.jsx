import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToHash } from "@/components/ScrollToHash";
import { RouteTitle } from "@/components/RouteTitle";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout";
import { HomePage } from "@/features/home";
import { UseCasesPage } from "@/features/usecases";
import { ProductsPage } from "@/features/products";
import { DevelopersPage } from "@/features/developers";
import { PricingPage } from "@/features/pricing";
import { AboutPage } from "@/features/about";
import { AuthPage } from "@/features/auth";
import { AppShell } from "@/features/app-shell/AppShell";
import { DashboardHomePage } from "@/features/dashboard/pages/DashboardHomePage";
import { AccountsPage } from "@/features/dashboard/pages/AccountsPage";
import { TransactionsPage } from "@/features/dashboard/pages/TransactionsPage";
import { InsightsPage } from "@/features/dashboard/pages/InsightsPage";
import { ConnectedAppsPage } from "@/features/dashboard/pages/ConnectedAppsPage";
import { SettingsPage } from "@/features/dashboard/pages/SettingsPage";
import { DeveloperGate } from "@/features/developer/DeveloperGate";
import { KeysPage } from "@/features/developer/pages/KeysPage";
import { AppsPage } from "@/features/developer/pages/AppsPage";
import { ApiReferencePage } from "@/features/developer/pages/ApiReferencePage";
import { NotFoundPage } from "@/features/not-found";
import { OAuthConsentPage } from "@/features/oauth/OAuthConsentPage";

function App() {
  return (
    <ErrorBoundary>
      <ScrollToHash />
      <RouteTitle />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Signed-in app: one shell, one sidebar, one set of shared data. */}
          <Route
            element={
              <ProtectedRoute redirectPath="/auth">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardHomePage />} />
            <Route path="/dashboard/accounts" element={<AccountsPage />} />
            <Route path="/dashboard/transactions" element={<TransactionsPage />} />
            <Route path="/dashboard/insights" element={<InsightsPage />} />
            <Route path="/dashboard/connected-apps" element={<ConnectedAppsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/developer" element={<DeveloperGate />}>
              <Route index element={<KeysPage />} />
              <Route path="apps" element={<AppsPage />} />
              <Route path="api" element={<ApiReferencePage />} />
            </Route>
          </Route>

          <Route
            path="/oauth/authorize"
            element={
              <ProtectedRoute redirectPath="/auth">
                <OAuthConsentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
