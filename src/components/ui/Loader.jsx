import { cn } from "@/lib/cn";

/**
 * Loader - Spinner for loading states.
 * Use when: if (isLoading) return <Loader />;
 */
export function Loader({ className, size = "md" }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-tertiary border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}
