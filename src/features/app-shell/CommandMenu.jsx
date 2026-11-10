import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Search, Plus, Upload, LogOut, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_DESTINATIONS } from "./navConfig";

/**
 * CommandMenu - Cmd/Ctrl+K (or "/") palette to jump to any page or run a common
 * action. Combobox + listbox semantics; arrow keys move, Enter runs, Esc closes.
 */
export function CommandMenu({ open, onClose, onAddAccount, onUpload, onSignOut }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const items = useMemo(() => {
    const pages = NAV_DESTINATIONS.map((d) => ({
      id: `go-${d.id}`,
      group: "Pages",
      label: d.label,
      icon: d.icon,
      external: d.external,
      run: () => (d.href ? window.open(d.href, d.external ? "_blank" : "_self") : navigate(d.to)),
    }));
    const actions = [
      { id: "add-account", group: "Actions", label: "Add an account", icon: Plus, run: onAddAccount },
      { id: "upload", group: "Actions", label: "Upload a statement", icon: Upload, run: onUpload },
      { id: "sign-out", group: "Actions", label: "Sign out", icon: LogOut, run: onSignOut },
    ];
    const q = query.trim().toLowerCase();
    return [...pages, ...actions].filter((i) => !q || i.label.toLowerCase().includes(q));
  }, [query, navigate, onAddAccount, onUpload, onSignOut]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActive(0);
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  function run(item) {
    onClose();
    item?.run?.();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(items[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  let lastGroup = null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-[rgb(20_20_20/0.4)] px-4 pt-[12vh] backdrop-blur-[2px] motion-safe:animate-[dialog-fade_140ms_ease-out]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Setl"
        className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-popover motion-safe:animate-[dialog-rise_180ms_cubic-bezier(0.2,0.8,0.2,1)]"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-ink-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={items[active] ? `${listId}-${items[active].id}` : undefined}
            aria-autocomplete="list"
            placeholder="Search pages and actions"
            className="h-14 flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          <kbd className="rounded-md border border-hairline bg-sunken px-1.5 py-0.5 text-[11px] font-medium text-ink-muted">
            Esc
          </kbd>
        </div>
        <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="max-h-[360px] overflow-y-auto p-2">
          {items.length === 0 && (
            <li className="px-3 py-10 text-center text-[14px] text-ink-muted">
              Nothing matches &ldquo;{query}&rdquo;.
            </li>
          )}
          {items.map((item, index) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const Icon = item.icon;
            const selected = index === active;
            return (
              <li key={item.id} role="presentation">
                {header && (
                  <p role="presentation" className="px-3 pb-1 pt-3 text-[12px] font-medium text-ink-subtle first:pt-1">
                    {header}
                  </p>
                )}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={() => run(item)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[14px]",
                    selected ? "bg-lilac text-violet-ink" : "text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", selected ? "text-violet" : "text-ink-muted")} aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {item.external && <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
                  {selected && <CornerDownLeft className="h-3.5 w-3.5 opacity-70" aria-hidden />}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-hairline bg-sunken px-4 py-2 text-[12px] text-ink-muted">
          <span><kbd className="font-sans font-medium text-ink">↑ ↓</kbd> to move</span>
          <span><kbd className="font-sans font-medium text-ink">Enter</kbd> to open</span>
        </div>
      </div>
    </div>
  );
}
