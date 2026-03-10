/**
 * Reusable Tailwind class constants for consistent styling.
 * Import these instead of duplicating class strings.
 */

export const INPUT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-primary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-primary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const TEXTAREA_CLASS =
  "flex min-h-[80px] w-full rounded-md border border-input bg-primary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const BUTTON_PRIMARY_CLASS =
  "inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const BUTTON_SECONDARY_CLASS =
  "inline-flex items-center justify-center rounded-md border border-secondary bg-primary px-4 py-2 text-sm font-medium text-secondary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const BUTTON_TERTIARY_CLASS =
  "inline-flex items-center justify-center rounded-md bg-tertiary px-4 py-2 text-sm font-medium text-tertiary-foreground hover:bg-tertiary/90 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
