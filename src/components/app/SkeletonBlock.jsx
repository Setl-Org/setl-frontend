import { cn } from "@/lib/cn";

/** SkeletonBlock - Shimmering placeholder. Size it like the content it stands in for. */
export function SkeletonBlock({ className }) {
  return <span aria-hidden className={cn("skeleton block h-3", className)} />;
}

/** Screen-reader announcement for a loading region, paired with visual skeletons. */
export function LoadingLabel({ children = "Loading" }) {
  return (
    <span role="status" className="sr-only">
      {children}
    </span>
  );
}
