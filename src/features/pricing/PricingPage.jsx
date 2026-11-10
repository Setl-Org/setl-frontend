import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { PageHero } from "@/features/home/components/PageHero";
import { SetlMark } from "@/features/home/components/SetlMark";
import { FIELD, pillClass } from "@/features/home/brand";
import { useAuthStore } from "@/stores/authStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", email: "", company: "", message: "" };

const API_POINTS = [
  "Connect, accounts, transactions, and profile",
  "Scoped, revocable consent",
  "One schema across the institutions a user connects",
  "Email support",
];

const ENTERPRISE_POINTS = [
  "A contracted integration as bank access opens",
  "SLA and a dedicated point of contact",
  "The same API, with support for your rollout",
];

function Point({ children, onDark }) {
  return (
    <li className={cn("flex items-start gap-3 text-[15px] leading-relaxed", onDark ? "text-white/85" : "text-[#3f3f3f]")}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", onDark ? "bg-white text-[#141414]" : "bg-[#141414] text-white")}>
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </span>
      {children}
    </li>
  );
}

/**
 * PricingPage - Published subscription range and a way to talk to the team.
 */
export function PricingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const keysHref = isAuthenticated ? "/developer" : "/auth";

  return (
    <MarketingShell>
      <PageHero
        title="Simple pricing for the API."
        description="A monthly subscription for the connection, or an annual enterprise agreement. No customers are billed yet. These are the prices we publish."
        titleClassName="max-w-[13ch]"
      />

      <section className="bg-[#F3EEF9]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-20 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <article className="flex flex-col rounded-[32px] bg-white p-8 ring-1 ring-[#eee8f6] sm:p-10">
            <h2 className="text-lg font-semibold">API</h2>
            <p className="mt-6 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">PKR 80,000–100,000</p>
            <p className="mt-2 text-sm text-[#6b6b66]">per month, billed monthly or annually</p>
            <ul className="mb-10 mt-8 space-y-3">
              {API_POINTS.map((p) => (
                <Point key={p}>{p}</Point>
              ))}
            </ul>
            <Link to={keysHref} className={cn(pillClass, "mt-auto bg-[#141414] text-white hover:bg-[#2a2a2a]")}>
              Get API keys
            </Link>
          </article>

          <article className="on-dark relative isolate flex flex-col overflow-hidden rounded-[32px] p-8 text-white sm:p-10" style={{ background: FIELD }}>
            <SetlMark strokeWidth={1.1} className="pointer-events-none absolute -right-28 -top-28 -z-10 h-[460px] w-[460px] text-white/[0.12]" />
            <h2 className="text-lg font-semibold">Enterprise</h2>
            <p className="mt-6 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">From PKR 3 million</p>
            <p className="mt-2 text-sm text-white/70">per year</p>
            <ul className="mb-10 mt-8 space-y-3">
              {ENTERPRISE_POINTS.map((p) => (
                <Point key={p} onDark>
                  {p}
                </Point>
              ))}
            </ul>
            <a href="#contact" className={cn(pillClass, "mt-auto bg-white text-[#141414] hover:bg-[#F3EEF9]")}>
              Talk to the team
            </a>
          </article>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:pb-24">
          <p className="flex max-w-3xl items-start gap-3 rounded-2xl bg-white px-5 py-4 text-[15px] leading-relaxed text-[#3f3f3f] ring-1 ring-[#eee8f6]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#542774]" aria-hidden="true" />
            Direct connections to each bank are not included yet. They open institution by institution. Today the API returns data
            from statements a user provides, in the same shape the bank APIs will use.
          </p>
        </div>
      </section>

      <ContactBlock />
    </MarketingShell>
  );
}

function ContactBlock() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

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

  const input =
    "h-12 w-full rounded-2xl border border-[#e4ddf0] bg-white/80 px-4 text-[15px] text-[#141414] placeholder:text-[#8a8a96] transition-[border-color,box-shadow] focus:border-[#7c3aed] focus:outline-none focus:ring-4 focus:ring-[#7c3aed]/10";

  return (
    <section id="contact" className="relative isolate scroll-mt-24 overflow-hidden bg-[#F3EEF9]">
      <SetlMark strokeWidth={1} className="pointer-events-none absolute -left-[20%] top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2 text-white/70" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-32">
        <div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Talk to the team</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#3f3f3f]">
            Tell us what you are building and which institutions your users hold. Or write directly to{" "}
            <a href="mailto:hatif@joinsetl.com" className="font-medium text-[#141414] underline underline-offset-4">
              hatif@joinsetl.com
            </a>
            .
          </p>
        </div>
        <form
          noValidate
          onSubmit={onSubmit}
          className="space-y-4 rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.55))] p-6 shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.45),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input value={form.name} onChange={update("name")} autoComplete="name" className={cn(input, errors.name && "border-error")} />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input type="email" value={form.email} onChange={update("email")} autoComplete="email" className={cn(input, errors.email && "border-error")} />
            </Field>
          </div>
          <Field label="Company" error={errors.company}>
            <input value={form.company} onChange={update("company")} autoComplete="organization" className={cn(input, errors.company && "border-error")} />
          </Field>
          <Field label="What are you building" error={errors.message}>
            <textarea rows={4} value={form.message} onChange={update("message")} className={cn(input, "h-auto resize-none py-3")} />
          </Field>
          <button type="submit" disabled={submitting} className={cn(pillClass, "w-full bg-[#141414] text-white hover:bg-[#2a2a2a] disabled:opacity-60 sm:w-auto")}>
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
