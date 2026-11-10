import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { SetlMark } from "@/features/home/components/SetlMark";
import { pillClass } from "@/features/home/brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { name: "", email: "", company: "", useCase: "" };

const INPUT =
  "h-12 w-full rounded-2xl border border-[#e4ddf0] bg-white/80 px-4 text-[15px] text-[#141414] placeholder:text-[#8a8a96] transition-[border-color,box-shadow] focus:border-[#7c3aed] focus:outline-none focus:ring-4 focus:ring-[#7c3aed]/10";

/**
 * UseCaseRequestForm - Lead-capture form for "Request a use case".
 * Client-side validation, posts to /api/contact tagged "use_case_request",
 * confirms with a toast. Visible by default: no scroll-triggered reveal.
 */
export function UseCaseRequestForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.email.trim()) next.email = "Required";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email";
    if (!form.company.trim()) next.company = "Required";
    if (!form.useCase.trim()) next.useCase = "Tell us what you want to build";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: form.useCase,
          type: "use_case_request",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Thanks. We'll review your use case and get back to you.");
      setForm(EMPTY);
      setErrors({});
    } catch {
      toast.error("Couldn't send right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="request" className="relative isolate scroll-mt-24 overflow-hidden bg-[#F3EEF9]">
      <SetlMark strokeWidth={1} className="pointer-events-none absolute -left-[20%] top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2 text-white/70" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-32">
        <div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Tell us what you want to build</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#3f3f3f]">
            Don&apos;t see your workflow above? Describe it and we&apos;ll show you how a Setl connection supplies the account data
            your product needs.
          </p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.55))] p-6 shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.45),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                autoComplete="name"
                placeholder="Ayesha Khan"
                className={cn(INPUT, errors.name && "border-error")}
              />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                autoComplete="email"
                placeholder="you@company.com"
                className={cn(INPUT, errors.email && "border-error")}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Company" error={errors.company}>
              <input
                type="text"
                value={form.company}
                onChange={update("company")}
                autoComplete="organization"
                placeholder="Your fintech"
                className={cn(INPUT, errors.company && "border-error")}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Describe your use case" error={errors.useCase}>
              <textarea
                rows={4}
                value={form.useCase}
                onChange={update("useCase")}
                placeholder="A lending app that needs income and cash flow from the HBL and Meezan accounts a borrower connects…"
                className={cn(INPUT, "h-auto resize-none py-3", errors.useCase && "border-error")}
              />
            </Field>
          </div>
          <button type="submit" disabled={submitting} className={cn(pillClass, "mt-6 w-full bg-[#141414] text-white hover:bg-[#2a2a2a] disabled:opacity-60")}>
            {submitting ? "Sending…" : "Request use case"}
          </button>
          <p className="mt-3 text-center text-xs text-[#6b6b66]">We&apos;ll only use your details to get in touch about Setl.</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-[#141414]">
        {label}
        {error && <span className="text-xs font-normal text-error">{error}</span>}
      </span>
      {children}
    </label>
  );
}
