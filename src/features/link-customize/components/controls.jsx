import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { isHex } from "../color";

/** Panel section: small heading, optional hint, then the control. */
export function SettingGroup({ title, hint, children, id }) {
  return (
    <div className="space-y-2.5" role={id ? "group" : undefined} aria-labelledby={id}>
      <h3 id={id} className="text-[14px] font-semibold text-ink">{title}</h3>
      {children}
      {hint && <p className="text-[12.5px] leading-5 text-ink-muted">{hint}</p>}
    </div>
  );
}

/**
 * RadioGroup - Vertical list of radios. Native inputs, so arrow keys and screen
 * readers work without extra code.
 */
export function RadioGroup({ label, value, options, onChange }) {
  const name = useId();
  const labelId = `${name}-label`;
  return (
    <div className="space-y-2.5" role="radiogroup" aria-labelledby={labelId}>
      <h3 id={labelId} className="text-[14px] font-semibold text-ink">{label}</h3>
      <div className="space-y-1">
        {options.map((o) => {
          const checked = String(o.value) === String(value);
          return (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2 transition-colors",
                checked ? "bg-lilac" : "hover:bg-sunken"
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet",
                  checked ? "border-violet bg-violet" : "border-hairline-strong bg-canvas"
                )}
              >
                {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="min-w-0">
                <span className={cn("block text-[14px]", checked ? "font-medium text-violet-ink" : "text-ink")}>
                  {o.label}
                </span>
                {o.hint && <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/** Switch - On/off row with a label and an optional hint. */
export function Switch({ label, hint, checked, onChange }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">{hint}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-150 focus-ring",
          checked ? "bg-violet" : "bg-hairline-strong"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgb(20_20_20/0.2)] transition-transform duration-150",
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

/**
 * ColorField - Preset swatches plus a hex input. The input only commits a value
 * once it is a full #RRGGBB, so the preview never shows a broken colour.
 */
export function ColorField({ label, value, presets, onChange }) {
  const id = useId();
  const [text, setText] = useState(value);
  const [editing, setEditing] = useState(false);
  const shown = editing ? text : value;
  const invalid = editing && !isHex(text);
  const pickerRef = useRef(null);

  return (
    <div className="space-y-2.5">
      <h3 className="text-[14px] font-semibold text-ink">{label}</h3>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`${label} presets`}>
        {presets.map((p) => {
          const selected = p.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              aria-pressed={selected}
              aria-label={p.label}
              title={p.label}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-ink/10 transition-transform hover:scale-105 focus-ring",
                selected && "ring-2 ring-violet ring-offset-2"
              )}
              style={{ background: p.value }}
            >
              {selected && (
                <Check
                  className="h-3.5 w-3.5"
                  style={{ color: p.value.toLowerCase() === "#ffffff" ? "#141414" : "#ffffff" }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => pickerRef.current?.click()}
          aria-label={`Pick a custom ${label.toLowerCase()}`}
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-hairline-strong focus-ring"
          style={{ background: isHex(value) ? value : "#ffffff" }}
        >
          <input
            ref={pickerRef}
            type="color"
            tabIndex={-1}
            aria-hidden
            value={isHex(value) ? value : "#ffffff"}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </button>
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="sr-only">{`${label} hex code`}</label>
          <input
            id={id}
            value={shown}
            spellCheck={false}
            aria-invalid={invalid || undefined}
            onFocus={() => {
              setText(value);
              setEditing(true);
            }}
            onBlur={() => setEditing(false)}
            onChange={(e) => {
              const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              setText(next);
              if (isHex(next)) onChange(next.toUpperCase());
            }}
            className="h-10 w-full rounded-lg border border-hairline-strong bg-canvas px-3 font-mono text-[13.5px] uppercase text-ink transition-[border-color,box-shadow] hover:border-ink/25 focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/10 aria-[invalid=true]:border-negative"
          />
        </div>
      </div>
      {invalid && <p className="text-[12.5px] font-medium text-negative">Use a six-digit hex code, like #7C3AED.</p>}
    </div>
  );
}
