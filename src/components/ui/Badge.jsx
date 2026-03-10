import { cn } from "@/lib/cn";
import { getStatusBadgeVariant } from "@/lib/badgeUtils";

/**
 * Badge - Status or label badge.
 *
 * @param {Object} props
 * @param {string} [props.status] - Status for variant lookup (uses getStatusBadgeVariant)
 * @param {string} [props.variant] - Direct variant class override
 */
export function Badge({ children, status, variant, className, ...props }) {
  const variantClass = variant ?? (status ? getStatusBadgeVariant(status) : "bg-muted text-muted-foreground");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
