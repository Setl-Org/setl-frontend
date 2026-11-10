import { Linkedin, ArrowUpRight } from "lucide-react";
import { MarketingShell } from "@/features/home/components/MarketingShell";
import { PageHero } from "@/features/home/components/PageHero";
import { DualActions } from "@/features/home/components/DualActions";
import { ClosingCta } from "@/features/home/components/ClosingCta";
import { TILE_FIELDS } from "@/features/home/brand";

const LINKEDIN = "https://www.linkedin.com/company/setl-finance";

const TEAM = [
  { name: "M. Hatif Mujahid", role: "CEO", linkedin: "https://www.linkedin.com/in/muhammad-hatif", field: TILE_FIELDS.plum },
  { name: "Ayihan Ul Haq", role: "CTO", linkedin: "https://www.linkedin.com/in/ayihan-ul-haq", field: TILE_FIELDS.night },
  { name: "Umair Ahmed", role: "COO", linkedin: "https://www.linkedin.com/in/umair-ahmed-3675261b0/", field: TILE_FIELDS.violet },
  { name: "Mohtada Jokhio", role: "CPO", linkedin: "https://www.linkedin.com/in/mohtada1", field: TILE_FIELDS.rose },
  { name: "Huzefa Mehmood", role: "CMO", linkedin: "https://www.linkedin.com/in/syed-huzefa-mehmood-5879b91b1/", field: TILE_FIELDS.dusk },
];

function initials(name) {
  return name
    .replace(/^M\.\s*/, "M ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Glass card for the incubator, beside the hero headline. */
function IncubatorCard() {
  return (
    <a
      href="https://nickarachi.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.78),rgba(255,255,255,0.55))] p-8 shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.5),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] backdrop-saturate-150"
    >
      <span className="inline-flex rounded-2xl bg-white p-3 ring-1 ring-[#eceae4]">
        <img src="/nic-karachi.webp" alt="National Incubation Center Karachi" className="h-24 w-auto" />
      </span>
      <p className="mt-6 text-xl font-semibold tracking-[-0.02em]">Incubated at NIC Karachi</p>
      <p className="mt-2 text-[15px] leading-relaxed text-[#3f3f3f]">
        The work now is opening bank conversations through NIC, institution by institution.
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
        nickarachi.com
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </a>
  );
}

/**
 * AboutPage - What Setl is, the current milestone, and the founding team.
 */
export function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        title="The account-data layer for Pakistan."
        description="Setl is a connector between bank accounts and the fintechs built on them. A customer consents. One API returns accounts and transactions, so a builder does not integrate each institution alone."
        actions={<DualActions />}
        aside={<IncubatorCard />}
      />

      <section className="bg-[#F3EEF9]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="border-t border-[#141414] pt-8">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Where we are</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#3f3f3f]">
              We are incubated at NIC Karachi. The work now is opening bank conversations through NIC. Direct access opens with each
              institution. Until then, a customer approves what an app can read, and the account data can come from a statement they
              provide.
            </p>
          </div>
          <div className="border-t border-[#141414] pt-8">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">What a builder gets</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#3f3f3f]">
              Consent is scoped to the accounts the customer chooses, and they can revoke it. Accounts and transactions come back in one
              schema. Sign-in stays on Setl today. Sign-in on the bank&apos;s own channel opens as each institution joins. Setl does not
              store the bank password.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#eceae4]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">The team</h2>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a href="mailto:info@joinsetl.com" className="text-sm font-medium underline-offset-4 hover:underline">
                info@joinsetl.com
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium ring-1 ring-[#e4ddf0] transition-colors hover:bg-[#F3EEF9]"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                Setl on LinkedIn
              </a>
            </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TEAM.map((person) => (
              <li key={person.name} className="group rounded-[24px] bg-[#faf8fd] p-5 ring-1 ring-[#eee8f6] transition-shadow hover:shadow-[0_20px_40px_-28px_rgba(29,11,48,0.5)]">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold text-white"
                  style={{ background: person.field }}
                  aria-hidden="true"
                >
                  {initials(person.name)}
                </span>
                <p className="mt-5 text-lg font-semibold leading-snug tracking-[-0.015em]">{person.name}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-sm text-[#6b6b66]">{person.role}</span>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b66] transition-colors hover:bg-white hover:text-[#141414]"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </MarketingShell>
  );
}
