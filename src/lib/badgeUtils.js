/**
 * Badge utilities - Status badge variants for consistent styling.
 */

export const BADGE_VARIANTS = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/20 text-success",
  error: "bg-error/20 text-error",
  warning: "bg-warning/20 text-warning",
};

/**
 * @param {string} status
 * @returns {string}
 */
export function getStatusBadgeVariant(status) {
  const statusMap = {
    active: "success",
    inactive: "default",
    pending: "warning",
    error: "error",
  };
  return BADGE_VARIANTS[statusMap[status?.toLowerCase()] ?? "default"];
}
