import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { INPUT_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { AnimatedSection } from "@/features/home/components";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { name: "", email: "", company: "", useCase: "" };

/**
 * UseCaseRequestForm - Lead-capture form for "Request a use case".
 * Mirrors the home ContactSection pattern: client-side validation, posts to
 * /api/contact, confirms with a toast. Tagged with type "use_case_request"
 * so the same endpoint can route it.
 */
export function UseCaseRequestForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

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
      toast.success("Thanks — we'll review your use case and get back to you.");
      setForm(EMPTY);
      setErrors({});
    } catch {
      toast.error("Couldn't send right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="request"
      className="border-t border-border bg-muted/30 py-16 section-pattern-dots sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — pitch */}
        <AnimatedSection className="text-left">
          <span className="inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            Request a use case
          </span>
          <h2 className="section-title mt-4">
            Tell us what you want to build
          </h2>
          <p className="section-subtitle">
            Don&apos;t see your workflow above? Describe it and we&apos;ll show
            you how Setl turns Pakistani bank statements into the data your
            product needs.
          </p>
        </AnimatedSection>

        {/* Right — form */}
        <motion.form
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/80 bg-primary p-6 shadow-lg sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Ayesha Khan"
                className={cn(INPUT_CLASS, errors.name && "border-error")}
              />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@company.com"
                className={cn(INPUT_CLASS, errors.email && "border-error")}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Company" error={errors.company}>
              <input
                type="text"
                value={form.company}
                onChange={update("company")}
                placeholder="Your fintech"
                className={cn(INPUT_CLASS, errors.company && "border-error")}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Describe your use case" error={errors.useCase}>
              <textarea
                rows={4}
                value={form.useCase}
                onChange={update("useCase")}
                placeholder="A lending app that needs income and cash-flow data parsed from HBL and Meezan statements…"
                className={cn(
                  INPUT_CLASS,
                  "h-auto resize-none py-2",
                  errors.useCase && "border-error"
                )}
              />
            </Field>
          </div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={submitting ? undefined : { scale: 1.01 }}
            whileTap={submitting ? undefined : { scale: 0.99 }}
            className={cn(
              BUTTON_TERTIARY_CLASS,
              "mt-6 min-h-[48px] w-full rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)] py-3 text-base font-semibold shadow-lg shadow-tertiary/30 ring-1 ring-inset ring-white/20 transition-all hover:shadow-xl hover:shadow-tertiary/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            )}
          >
            {submitting ? "Sending…" : "Request use case"}
          </motion.button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            We&apos;ll only use your details to get in touch about Setl.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-secondary">
        {label}
        {error && <span className="text-xs font-normal text-error">{error}</span>}
      </span>
      {children}
    </label>
  );
}
