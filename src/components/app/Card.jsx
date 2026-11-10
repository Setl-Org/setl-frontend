import { cn } from "@/lib/cn";

/**
 * Card - White surface with a hairline border. Never nest cards; use a divider
 * or a sunken panel inside instead.
 */
export function Card({ as: Comp = "section", interactive = false, className, children, ...props }) {
  return (
    <Comp
      className={cn(
        "rounded-xl border border-hairline bg-canvas shadow-card",
        interactive &&
          "transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-px hover:border-hairline-strong hover:shadow-raised",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Card title row: heading, optional description, optional action on the right. */
export function CardHeader({ title, description, action, icon: Icon, id, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 sm:px-6", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lilac text-violet-ink">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h2 id={id} className="text-[15px] font-semibold leading-6 text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] leading-5 text-ink-muted">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("px-5 pb-5 pt-4 sm:px-6", className)}>{children}</div>;
}

/** Section heading between cards (Plaid's "Explore", "Getting started"). */
export function SectionTitle({ children, action, id, className }) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 id={id} className="text-[19px] font-semibold tracking-[-0.01em] text-ink">{children}</h2>
      {action}
    </div>
  );
}
