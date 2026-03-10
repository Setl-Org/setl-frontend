import { cn } from "@/lib/cn";

/**
 * Skeleton - Placeholder for loading content.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
