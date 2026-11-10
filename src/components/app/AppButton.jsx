import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * AppButton - The one button for the signed-in app.
 *
 * variant: primary (ink, one per view), secondary (outlined), ghost (toolbar/inline),
 *          danger (destructive confirm), on-dark (white, for the hero card).
 * size:    sm (32px), md (40px), icon (40px square), icon-sm (32px square).
 * Renders a router <Link> when `to` is set, an <a> when `href` is set.
 */
const VARIANTS = {
  primary:
    "bg-ink text-white shadow-card hover:bg-ink/88 active:bg-ink",
  secondary:
    "border border-hairline-strong bg-canvas text-ink shadow-card hover:border-ink/25 hover:bg-sunken",
  ghost:
    "text-ink-muted hover:bg-sunken hover:text-ink",
  danger:
    "bg-negative text-white shadow-card hover:bg-negative/90",
  "danger-outline":
    "border border-negative/30 bg-canvas text-negative hover:bg-negative-soft",
  "on-dark":
    "bg-white text-ink shadow-card hover:bg-white/90",
};

const SIZES = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  icon: "h-10 w-10 rounded-lg",
  "icon-sm": "h-8 w-8 rounded-lg",
};

export const AppButton = forwardRef(function AppButton(
  {
    variant = "secondary",
    size = "md",
    to,
    href,
    loading = false,
    disabled = false,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    className,
    children,
    type = "button",
    ...props
  },
  ref
) {
  const classes = cn(
    "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-ring active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    VARIANTS[variant] ?? VARIANTS.secondary,
    SIZES[size] ?? SIZES.md,
    className
  );

  const iconClass = size === "sm" || size === "icon-sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const content = (
    <>
      {loading ? (
        <Loader2 className={cn(iconClass, "animate-spin")} aria-hidden />
      ) : (
        LeadingIcon && <LeadingIcon className={iconClass} aria-hidden />
      )}
      {children}
      {TrailingIcon && <TrailingIcon className={iconClass} aria-hidden />}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} aria-disabled={disabled || undefined} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} aria-disabled={disabled || undefined} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});
