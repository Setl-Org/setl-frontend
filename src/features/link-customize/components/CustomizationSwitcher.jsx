import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, Copy, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { cn } from "@/lib/cn";
import { DEFAULT_CUSTOMIZATION_ID } from "../constants";
import { nameError, useLinkCustomizations } from "../useLinkCustomizations";

const MENU_ITEM =
  "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13.5px] font-medium text-ink hover:bg-sunken focus-ring disabled:pointer-events-none disabled:opacity-40";

function NameForm({ title, initial, submitLabel, onSubmit, onCancel, items, ignoreId }) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const error = nameError(value, items, ignoreId);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  return (
    <form
      className="p-2"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!error) onSubmit(value.trim());
      }}
    >
      <label htmlFor="customization-name" className="block text-[13px] font-semibold text-ink">
        {title}
      </label>
      <input
        id="customization-name"
        ref={inputRef}
        value={value}
        maxLength={40}
        aria-invalid={(touched && error) ? true : undefined}
        aria-describedby="customization-name-msg"
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 h-10 w-full rounded-lg border border-hairline-strong px-3 font-mono text-[13.5px] text-ink focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/10 aria-[invalid=true]:border-negative"
      />
      <p
        id="customization-name-msg"
        className={cn("mt-1.5 text-[12px]", touched && error ? "font-medium text-negative" : "text-ink-muted")}
      >
        {touched && error ? error : "Letters, numbers, dashes and underscores."}
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <AppButton size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </AppButton>
        <AppButton size="sm" variant="primary" type="submit">
          {submitLabel}
        </AppButton>
      </div>
    </form>
  );
}

/**
 * CustomizationSwitcher - Picks which saved customization the editor shows,
 * plus a gear menu to create, duplicate, rename or delete one.
 */
export function CustomizationSwitcher() {
  const items = useLinkCustomizations((s) => s.items);
  const currentId = useLinkCustomizations((s) => s.currentId);
  const { select, create, duplicate, rename, remove } = useLinkCustomizations.getState();
  const current = items[currentId];

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("menu"); // menu | new | duplicate | rename | delete
  const gearRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    if (mode === "menu") popRef.current?.querySelector("button:not(:disabled)")?.focus();
    function onDown(e) {
      if (!popRef.current?.contains(e.target) && !gearRef.current?.contains(e.target)) {
        setOpen(false);
        setMode("menu");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, mode]);

  function close(returnFocus = true) {
    setOpen(false);
    setMode("menu");
    if (returnFocus) gearRef.current?.focus();
  }

  const isDefault = currentId === DEFAULT_CUSTOMIZATION_ID;
  const sorted = Object.values(items).sort((a, b) =>
    a.id === DEFAULT_CUSTOMIZATION_ID ? -1 : b.id === DEFAULT_CUSTOMIZATION_ID ? 1 : a.name.localeCompare(b.name)
  );

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative">
        <label htmlFor="customization-select" className="sr-only">
          Customization
        </label>
        <select
          id="customization-select"
          value={currentId}
          onChange={(e) => select(e.target.value)}
          className="h-10 min-w-[180px] max-w-[240px] appearance-none truncate rounded-lg border border-hairline-strong bg-canvas pl-3.5 pr-9 font-mono text-[13.5px] font-medium text-ink shadow-card hover:border-ink/25 focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/10"
        >
          {sorted.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </select>
        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      </div>

      <AppButton
        ref={gearRef}
        size="icon"
        aria-label="Customization options"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        <Settings className="h-4 w-4" aria-hidden />
      </AppButton>

      {open && (
        <div
          ref={popRef}
          role={mode === "menu" ? "menu" : "dialog"}
          aria-label="Customization options"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            }
          }}
          className="absolute right-0 top-12 z-40 w-[280px] rounded-xl border border-hairline bg-canvas p-1.5 shadow-popover motion-safe:animate-[page-enter_150ms_ease-out]"
        >
          {mode === "menu" && (
            <>
              <button type="button" role="menuitem" className={MENU_ITEM} onClick={() => setMode("new")}>
                <Plus className="h-4 w-4 text-ink-muted" aria-hidden />
                New customization
              </button>
              <button type="button" role="menuitem" className={MENU_ITEM} onClick={() => setMode("duplicate")}>
                <Copy className="h-4 w-4 text-ink-muted" aria-hidden />
                Duplicate “{current.name}”
              </button>
              <button type="button" role="menuitem" className={MENU_ITEM} disabled={isDefault} onClick={() => setMode("rename")}>
                <Pencil className="h-4 w-4 text-ink-muted" aria-hidden />
                Rename
              </button>
              <div className="my-1 h-px bg-hairline" />
              <button
                type="button"
                role="menuitem"
                className={cn(MENU_ITEM, "text-negative hover:bg-negative-soft")}
                disabled={isDefault}
                onClick={() => setMode("delete")}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </button>
              {isDefault && (
                <p className="px-2.5 pb-1 pt-1.5 text-[12px] leading-[1.45] text-ink-muted">
                  The default customization can&apos;t be renamed or deleted.
                </p>
              )}
            </>
          )}

          {mode === "new" && (
            <NameForm
              title="New customization"
              initial={`custom-${Object.keys(items).length}`}
              submitLabel="Create"
              items={items}
              onCancel={() => setMode("menu")}
              onSubmit={(name) => {
                create(name);
                close();
                toast.success(`Created “${name}”`, { description: "It starts from Setl's defaults and isn't published yet." });
              }}
            />
          )}

          {mode === "duplicate" && (
            <NameForm
              title={`Duplicate “${current.name}”`}
              initial={`${current.name}-copy`}
              submitLabel="Duplicate"
              items={items}
              onCancel={() => setMode("menu")}
              onSubmit={(name) => {
                duplicate(name);
                close();
                toast.success(`Created “${name}”`, { description: `A copy of “${current.name}”, including unpublished edits.` });
              }}
            />
          )}

          {mode === "rename" && (
            <NameForm
              title="Rename customization"
              initial={current.name}
              submitLabel="Rename"
              items={items}
              ignoreId={currentId}
              onCancel={() => setMode("menu")}
              onSubmit={(name) => {
                rename(name);
                close();
                toast.success(`Renamed to “${name}”`);
              }}
            />
          )}

          {mode === "delete" && (
            <div className="p-2">
              <p className="text-[13.5px] font-semibold text-ink">Delete “{current.name}”?</p>
              <p className="mt-1 text-[12.5px] leading-[1.45] text-ink-muted">
                Link sessions that ask for it will use “default” instead. This can&apos;t be undone.
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <AppButton size="sm" variant="ghost" onClick={() => setMode("menu")} autoFocus>
                  Cancel
                </AppButton>
                <AppButton
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    const name = current.name;
                    remove();
                    close();
                    toast(`Deleted “${name}”`);
                  }}
                >
                  Delete
                </AppButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
