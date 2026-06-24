import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout";
import { HomePage } from "@/features/home";
import { AuthPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { NotFoundPage } from "@/features/not-found";
import { OAuthConsentPage } from "@/features/oauth/OAuthConsentPage";
import { DeveloperPortalPage } from "@/features/developer/DeveloperPortalPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectPath="/auth">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/oauth/authorize"
            element={
              <ProtectedRoute redirectPath="/auth">
                <OAuthConsentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <ProtectedRoute redirectPath="/auth">
                <DeveloperPortalPage />
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
