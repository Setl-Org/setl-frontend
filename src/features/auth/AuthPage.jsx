import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "./components";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS } from "@/lib/styles";

const MODES = { signIn: "signIn", signUp: "signUp" };

function getGoogleAuthUrl() {
  return import.meta.env.VITE_AUTH_GOOGLE_URL ?? "";
}

function getMicrosoftAuthUrl() {
  return import.meta.env.VITE_AUTH_MICROSOFT_URL ?? "";
}

/**
 * AuthPage - Sign in / Sign up with SSO (Google, Microsoft) and email/password.
 * Styled to match the landing page (patterns, orbs, typography, card-hover).
 */
export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState(
    modeParam === MODES.signUp ? MODES.signUp : MODES.signIn
  );

  useEffect(() => {
    if (modeParam === MODES.signUp) setMode(MODES.signUp);
    else if (modeParam === MODES.signIn) setMode(MODES.signIn);
  }, [modeParam]);

  const setModeAndUrl = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode }, { replace: true });
  };

  const googleUrl = getGoogleAuthUrl();
  const microsoftUrl = getMicrosoftAuthUrl();

  const handleSSO = (url) => {
    if (url) window.location.href = url;
  };

  const isSignIn = mode === MODES.signIn;

  return (
    <div className="auth-page-bg relative min-h-screen overflow-hidden">
      {/* Subtle gradient orbs - match landing */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-tertiary/5 blur-[80px] animate-float sm:bg-tertiary/10" />
        <div
          className="absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-tertiary/4 blur-[60px] animate-float sm:bg-tertiary/6"
          style={{ animationDelay: "-2s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(124,58,237,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="safe-area-pad border-b border-border/60 bg-primary/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="flex min-h-[44px] min-w-[44px] items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to home</span>
            </Link>
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Setl" className="h-8 w-auto sm:h-9" />
            </Link>
            <div className="w-20 sm:w-24" aria-hidden />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border/80 bg-primary/95 p-6 shadow-lg backdrop-blur-sm sm:p-8 card-hover border-tertiary/20"
          >
            <div className="mb-6 text-center">
              <h1 className="section-title text-2xl sm:text-3xl">
                {isSignIn ? "Welcome back." : "Create your account."}
                <span className="block bg-[linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer text-xl sm:text-2xl">
                  {isSignIn ? "Sign in to continue." : "Get started in seconds."}
                </span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The bank-account API for Pakistani fintechs.
              </p>
            </div>

            <div className="mb-6 flex rounded-xl bg-muted/60 p-1.5">
              <button
                type="button"
                onClick={() => setModeAndUrl(MODES.signIn)}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium transition",
                  mode === MODES.signIn
                    ? "bg-primary text-secondary shadow-sm ring-1 ring-border/80"
                    : "text-muted-foreground hover:text-secondary"
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setModeAndUrl(MODES.signUp)}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium transition",
                  mode === MODES.signUp
                    ? "bg-primary text-secondary shadow-sm ring-1 ring-border/80"
                    : "text-muted-foreground hover:text-secondary"
                )}
              >
                Sign up
              </button>
            </div>

            {/* <div className="space-y-3">
              <a
                href={googleUrl || "#"}
                onClick={(e) => {
                  if (!googleUrl) e.preventDefault();
                  else handleSSO(googleUrl);
                }}
                className={cn(
                  BUTTON_SECONDARY_CLASS,
                  "flex min-h-[48px] w-full items-center justify-center gap-3 transition hover:border-tertiary/30 hover:shadow-[0_0_20px_-6px_rgba(124,58,237,0.2)]"
                )}
                aria-label="Continue with Google"
              >
                <GoogleIcon />
                Continue with Google
              </a>
              <a
                href={microsoftUrl || "#"}
                onClick={(e) => {
                  if (!microsoftUrl) e.preventDefault();
                  else handleSSO(microsoftUrl);
                }}
                className={cn(
                  BUTTON_SECONDARY_CLASS,
                  "flex min-h-[48px] w-full items-center justify-center gap-3 transition hover:border-tertiary/30 hover:shadow-[0_0_20px_-6px_rgba(124,58,237,0.2)]"
                )}
                aria-label="Continue with Microsoft"
              >
                <MicrosoftIcon />
                Continue with Microsoft
              </a>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div> */}

            <AuthForm mode={mode} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            {mode === MODES.signIn ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setModeAndUrl(MODES.signUp)}
                  className="nav-link font-medium text-tertiary hover:text-tertiary"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setModeAndUrl(MODES.signIn)}
                  className="nav-link font-medium text-tertiary hover:text-tertiary"
                >
                  Sign in
                </button>
              </>
            )}
          </motion.p>
        </main>
      </div>
    </div>
  );
}

/** Simple Google "G" icon for SSO button. */
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Simple Microsoft icon for SSO button. */
function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden>
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}
