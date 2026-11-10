import { useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * PageHeader - Title row every app page starts with (Plaid anatomy: large title,
 * one line of context, actions on the right). Also sets the tab title.
 */
export function PageHeader({ title, description, actions, eyebrow, documentTitle, className }) {
  useEffect(() => {
    const t = documentTitle ?? (typeof title === "string" ? title : null);
    if (t) document.title = `${t} · Setl`;
  }, [title, documentTitle]);

  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[13px] font-medium text-ink-muted">{eyebrow}</p>
        )}
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[34px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
