import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { BUTTON_TERTIARY_CLASS } from "@/lib/styles";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-6xl font-bold text-tertiary">404</h1>
      <h2 className="text-2xl font-semibold text-secondary">Page not found</h2>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className={cn(BUTTON_TERTIARY_CLASS, "inline-flex")}>
        Go home
      </Link>
    </div>
  );
}
