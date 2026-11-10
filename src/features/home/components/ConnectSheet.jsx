import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowLeftRight, Check, RotateCcw } from "lucide-react";
import { InstitutionLogo } from "./InstitutionLogo";

const INSTITUTIONS = ["HBL", "Meezan Bank", "UBL", "MCB", "JazzCash", "SadaPay"];

/** Example accounts per institution. Illustrative only, and labelled as an example in the sheet. */
const ACCOUNTS = {
  HBL: [{ name: "Current account", type: "current", mask: "4521" }],
  "Meezan Bank": [
    { name: "Salary account", type: "current", mask: "2324" },
    { name: "Savings", type: "savings", mask: "7710" },
  ],
  UBL: [{ name: "Current account", type: "current", mask: "3123" }],
  MCB: [{ name: "Business account", type: "current", mask: "0918" }],
  JazzCash: [{ name: "Mobile wallet", type: "wallet", mask: "8830" }],
  SadaPay: [{ name: "Spending account", type: "wallet", mask: "5501" }],
};

const SCOPES = [
  ["Your accounts", "Names, types and the last 4 digits"],
  ["Your transactions", "Dates, amounts and descriptions"],
];

const EASE = [0.16, 1, 0.3, 1];

/**
 * ConnectSheet - The consent flow a customer sees, end to end: choose an
 * institution, approve what the app can read, then the data the app receives.
 * Nothing is submitted; every step is an example.
 */
export function ConnectSheet({ glass = true }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState("choose"); // choose | consent | done
  const [bank, setBank] = useState("Meezan Bank");
  const [picked, setPicked] = useState(() => ACCOUNTS["Meezan Bank"].map((a) => a.mask));
  const accounts = ACCOUNTS[bank] ?? [];

  function choose(name) {
    setBank(name);
    setPicked((ACCOUNTS[name] ?? []).map((a) => a.mask));
  }

  const panel = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, x: 16, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -16, filter: "blur(4px)" },
    transition: { duration: reduce ? 0.12 : 0.32, ease: EASE },
  };

  return (
    <motion.div
      layout={!reduce}
      transition={{ duration: 0.35, ease: EASE }}
      className={
        glass
          ? "relative w-full overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.74),rgba(255,255,255,0.5))] p-6 text-[#141414] shadow-[0_0_0_1px_rgba(196,170,240,0.35),0_40px_80px_-34px_rgba(84,39,116,0.55),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[14px] backdrop-saturate-150 sm:p-7"
          : "relative w-full overflow-hidden rounded-[28px] bg-white p-6 text-[#141414] shadow-[0_40px_80px_-30px_rgba(29,11,48,0.75),0_12px_24px_-12px_rgba(29,11,48,0.35)] sm:p-7"
      }
    >
      <StepDots step={step} />
      <AnimatePresence mode="wait" initial={false}>
        {step === "choose" && (
          <motion.div key="choose" {...panel}>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Connect an account</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#6b6b66]">
              Northwind Finance is requesting access to accounts you choose.
            </p>
            <ul className="mt-4 space-y-1" role="radiogroup" aria-label="Institution">
              {INSTITUTIONS.map((name) => {
                const on = name === bank;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => choose(name)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors ${
                        on ? "bg-[#F3EEF9] ring-1 ring-[#7C3AED]" : "hover:bg-[#f6f5f2]"
                      }`}
                    >
                      <InstitutionLogo bankName={name} className="h-8 w-8 rounded-[10px]" />
                      <span className="flex-1 font-medium">{name}</span>
                      <span
                        aria-hidden="true"
                        className={`h-4 w-4 rounded-full border transition-colors ${
                          on ? "border-[#7C3AED] bg-[#7C3AED] shadow-[inset_0_0_0_3px_white]" : "border-[#cfcbc2]"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setStep("consent")}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#141414] text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
            >
              Continue with {bank}
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-[#6b6b66]">
              This is an example. Setl never sees a bank password.
            </p>
          </motion.div>
        )}

        {step === "consent" && (
          <motion.div key="consent" {...panel}>
            <div className="flex items-center justify-center gap-2.5" aria-hidden="true">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414] text-sm font-semibold text-white">N</span>
              <ArrowLeftRight className="h-4 w-4 text-[#6b6b66]" />
              <InstitutionLogo bankName={bank} className="h-10 w-10 rounded-full" />
            </div>
            <h2 className="mt-4 text-center text-lg font-semibold leading-snug tracking-[-0.015em]">
              Northwind Finance wants to read your {bank} accounts
            </h2>
            <ul className="mt-4 divide-y divide-[#eceae4] rounded-2xl border border-[#eceae4]">
              {SCOPES.map(([title, body]) => (
                <li key={title} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F3EEF9]">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="block text-xs text-[#6b6b66]">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <fieldset className="mt-4">
              <legend className="mb-2 text-xs font-medium text-[#6b6b66]">Accounts to share</legend>
              <div className="space-y-1.5">
                {accounts.map((a) => {
                  const on = picked.includes(a.mask);
                  return (
                    <label
                      key={a.mask}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#7C3AED] ${
                        on ? "border-[#7C3AED]/50 bg-[#F3EEF9]" : "border-[#eceae4] hover:bg-[#f6f5f2]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() =>
                          setPicked((p) => (p.includes(a.mask) ? p.filter((m) => m !== a.mask) : [...p, a.mask]))
                        }
                      />
                      <span className="flex-1">
                        <span className="block font-medium">{a.name}</span>
                        <span className="block text-xs tabular-nums text-[#6b6b66]">•••• {a.mask}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                          on ? "border-[#141414] bg-[#141414] text-white" : "border-[#cfcbc2] bg-white"
                        }`}
                      >
                        {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("choose")}
                aria-label="Back to institutions"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9d6cd] transition-colors hover:bg-[#f6f5f2]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={picked.length === 0}
                onClick={() => setStep("done")}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#141414] text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-40"
              >
                Allow {picked.length} {picked.length === 1 ? "account" : "accounts"}
              </button>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-[#6b6b66]">
              Today, account data comes from statements the customer provides.
            </p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" {...panel}>
            <div className="flex items-center gap-3">
              <motion.span
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 26, delay: 0.08 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414] text-white"
              >
                <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
              </motion.span>
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.015em]">Connected</h2>
                <p className="text-xs text-[#6b6b66]">Northwind Finance reads it through one endpoint.</p>
              </div>
            </div>
            <ResponsePreview bank={bank} accounts={accounts.filter((a) => picked.includes(a.mask))} reduce={reduce} />
            <button
              type="button"
              onClick={() => {
                choose(bank);
                setStep("choose");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full text-sm font-medium underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Try another institution
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {step === "consent" ? `Step 2 of 3: approve access to ${bank}` : step === "done" ? "Step 3 of 3: connected" : ""}
      </p>
    </motion.div>
  );
}

function StepDots({ step }) {
  const index = { choose: 0, consent: 1, done: 2 }[step];
  return (
    <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${i <= index ? "w-6 bg-[#141414]" : "w-3 bg-[#e3e0d8]"}`}
        />
      ))}
      <span className="ml-auto rounded-full bg-[#F3EEF9] px-2 py-0.5 text-[11px] font-medium tabular-nums text-[#542774]">
        Example · {index + 1}/3
      </span>
    </div>
  );
}

/** The response the app gets back, revealed line by line once. */
function ResponsePreview({ bank, accounts, reduce }) {
  const lines = [
    ["k", "GET /api/external/v1/accounts"],
    ["p", "{"],
    ["p", '  "accounts": ['],
    ...accounts.flatMap((a, i) => [
      ["p", "    {"],
      ["f", `      "institution": "${bank}",`],
      ["f", `      "name": "${a.name}",`],
      ["f", `      "type": "${a.type}",`],
      ["f", `      "mask": "${a.mask}"`],
      ["p", i === accounts.length - 1 ? "    }" : "    },"],
    ]),
    ["p", "  ]"],
    ["p", "}"],
  ];
  return (
    <div className="mt-4 overflow-hidden rounded-2xl bg-[#141414]">
      <pre className="max-h-[260px] overflow-auto px-4 py-3.5 font-mono text-[11.5px] leading-[1.7] text-[#ece8f6]">
        {lines.map(([kind, text], i) => (
          <motion.span
            key={`${i}-${text}`}
            className={`block whitespace-pre ${kind === "k" ? "mb-1 text-white/50" : kind === "f" ? "text-[#c4b5fd]" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: reduce ? 0 : Math.min(0.15 + i * 0.035, 0.7) }}
          >
            {text}
          </motion.span>
        ))}
      </pre>
    </div>
  );
}
