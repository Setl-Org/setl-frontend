import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { INPUT_CLASS } from "@/lib/styles";
import { MarketingShell } from "@/features/home/components/MarketingShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", email: "", company: "", message: "" };

/**
 * PricingPage - Published subscription range and a way to talk to the team.
 */
export function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-28 sm:px-6 lg:pt-32">
        <h1 className="max-w-[14ch] text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Simple pricing for the API.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3f3f3f]">
          A monthly subscription for the connection, or an annual enterprise agreement. No customers are billed yet. These are the prices we publish.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <article className="flex flex-col rounded-3xl bg-[#f6f5f2] p-8">
          <h2 className="text-lg font-medium">API</h2>
          <p className="mt-6 text-4xl font-semibold tracking-tight">PKR 80,000–100,000</p>
          <p className="mt-1 text-sm text-[#6b6b66]">per month, billed monthly or annually</p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[#3f3f3f]">
            <li>Connect, accounts, transactions, and profile</li>
            <li>Scoped, revocable consent</li>
            <li>One schema across the institutions a user connects</li>
            <li>Email support</li>
          </ul>
          <Link
            to="/auth"
            className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-[#141414] px-5 text-sm font-medium text-white hover:bg-[#2a2a2a]"
          >
            Get API keys
          </Link>
        </article>
        <article className="flex flex-col rounded-3xl bg-[#141414] p-8 text-white">
          <h2 className="text-lg font-medium">Enterprise</h2>
          <p className="mt-6 text-4xl font-semibold tracking-tight">From PKR 3 million</p>
          <p className="mt-1 text-sm text-white/60">per year</p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-white/80">
            <li>A contracted integration as bank access opens</li>
            <li>SLA and a dedicated point of contact</li>
            <li>The same API, with support for your rollout</li>
          </ul>
          <a
            href="#contact"
            className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#141414] hover:bg-[#f6f5f2]"
          >
            Talk to us
          </a>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <p className="max-w-2xl text-sm leading-relaxed text-[#6b6b66]">
          Direct connections to each bank are not included yet. They open institution by institution. Today the API returns data from statements a user provides, in the same shape the bank APIs will use.
        </p>
      </section>

      <ContactBlock />
    </MarketingShell>
  );
}

function ContactBlock() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.email.trim()) next.email = "Required";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email";
    if (!form.company.trim()) next.company = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Thanks. We'll be in touch shortly.");
      setForm(EMPTY);
      setErrors({});
    } catch {
      toast.error("Couldn't send right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-[#eceae4]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Talk to us</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-[#3f3f3f]">
            Tell us what you are building and which institutions your users hold. Or write directly to info@joinsetl.com.
          </p>
        </div>
        <form noValidate onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input value={form.name} onChange={update("name")} className={cn(INPUT_CLASS, "rounded-xl", errors.name && "border-error")} />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input type="email" value={form.email} onChange={update("email")} className={cn(INPUT_CLASS, "rounded-xl", errors.email && "border-error")} />
            </Field>
          </div>
          <Field label="Company" error={errors.company}>
            <input value={form.company} onChange={update("company")} className={cn(INPUT_CLASS, "rounded-xl", errors.company && "border-error")} />
          </Field>
          <Field label="What are you building" error={errors.message}>
            <textarea rows={4} value={form.message} onChange={update("message")} className={cn(INPUT_CLASS, "h-auto rounded-xl py-2")} />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center rounded-full bg-[#141414] px-5 text-sm font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
        {label}
        {error && <span className="text-xs font-normal text-error">{error}</span>}
      </span>
      {children}
    </label>
  );
}
