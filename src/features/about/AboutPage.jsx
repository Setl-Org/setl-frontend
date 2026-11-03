import { Linkedin } from "lucide-react";
import { MarketingShell } from "@/features/home/components/MarketingShell";

const LINKEDIN = "https://www.linkedin.com/company/setl-finance";

const TEAM = [
  { name: "M. Hatif Mujahid", role: "CEO", linkedin: "https://www.linkedin.com/in/muhammad-hatif" },
  { name: "Ayihan Ul Haq", role: "CTO", linkedin: "https://www.linkedin.com/in/ayihan-ul-haq" },
  { name: "Umair Ahmed", role: "COO", linkedin: "https://www.linkedin.com/in/umair-ahmed-3675261b0/" },
  { name: "Mohtada Jokhio", role: "CPO", linkedin: "https://www.linkedin.com/in/mohtada1" },
  { name: "Huzefa Mehmood", role: "CMO", linkedin: "https://www.linkedin.com/in/syed-huzefa-mehmood-5879b91b1/" },
];

/**
 * AboutPage - What Setl is, the current milestone, and the founding team.
 */
export function AboutPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-28 sm:px-6 lg:pt-32">
        <h1 className="max-w-[16ch] text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          The account-data layer for Pakistan.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3f3f3f]">
          Setl is a connector between bank accounts and the fintechs built on them. A customer consents. One API returns accounts and transactions, so a builder does not integrate each institution alone.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <a href="https://nickarachi.com" target="_blank" rel="noopener noreferrer" className="inline-block">
          <img src="/nic-karachi.webp" alt="National Incubation Center Karachi" className="h-20 w-auto" />
        </a>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Where we are</h2>
          <p className="mt-3 text-base leading-relaxed text-[#3f3f3f]">
            We are incubated at NIC Karachi. The work now is opening bank conversations through NIC. Direct access opens with each institution. Until then, a customer approves what an app can read, and the account data can come from a statement they provide.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">What a builder gets</h2>
          <p className="mt-3 text-base leading-relaxed text-[#3f3f3f]">
            Consent is scoped to the accounts the customer chooses, and they can revoke it. Accounts and transactions come back in one schema. Sign-in stays on Setl today. Sign-in on the bank&apos;s own channel opens as each institution joins. Setl does not store the bank password.
          </p>
        </div>
        </div>
      </section>

      <section className="border-t border-[#eceae4]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">The team</h2>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a href="mailto:hatif@joinsetl.com" className="text-sm font-medium underline-offset-4 hover:underline">
                hatif@joinsetl.com
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
          </div>
          <ul className="mt-8 divide-y divide-[#eceae4] border-y border-[#eceae4]">
            {TEAM.map((person) => (
              <li key={person.name} className="flex items-center justify-between gap-4 py-4">
                <span className="inline-flex min-w-0 items-center gap-2 text-lg font-medium text-[#141414]">
                  {person.name}
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} on LinkedIn`}
                      className="text-[#6b6b66] hover:text-[#141414]"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </span>
                <span className="text-sm text-[#6b6b66]">{person.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MarketingShell>
  );
}
