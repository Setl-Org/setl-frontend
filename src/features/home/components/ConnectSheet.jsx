import { useState } from "react";

const INSTITUTIONS = [
  { name: "HBL", color: "#0B6E3B" },
  { name: "Meezan Bank", color: "#00683C" },
  { name: "UBL", color: "#0067A0" },
  { name: "MCB", color: "#00674A" },
  { name: "JazzCash", color: "#E2231A" },
  { name: "SadaPay", color: "#0E1116" },
];

/**
 * ConnectSheet - Example of the consent step a customer sees.
 * Choosing an institution hands off to that institution. Nothing is submitted.
 */
export function ConnectSheet() {
  const [selected, setSelected] = useState("Meezan Bank");
  const [handedOff, setHandedOff] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-5 shadow-[0_20px_50px_-28px_rgba(69,31,92,0.45)] sm:p-7">
        {handedOff ? (
          <Handoff name={selected} onBack={() => setHandedOff(false)} />
        ) : (
          <>
            <h2 className="text-xl font-semibold tracking-tight text-[#141414]">
              Connect an account
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#6b6b66]">
              Northwind Finance is requesting access to accounts you choose. This is an example.
            </p>
            <ul className="mt-4 space-y-1">
              {INSTITUTIONS.map((bank) => {
                const on = bank.name === selected;
                return (
                  <li key={bank.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(bank.name)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                        on ? "bg-[#F3EEF9] ring-1 ring-[#7C3AED]" : "hover:bg-[#f6f5f2]"
                      }`}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
                        style={{ background: bank.color }}
                      >
                        {bank.name.slice(0, 1)}
                      </span>
                      <span className="flex-1 font-medium">{bank.name}</span>
                      <span
                        className={`h-4 w-4 rounded-full border ${
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
              onClick={() => setHandedOff(true)}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#141414] text-sm font-medium text-white hover:bg-[#2a2a2a]"
            >
              Continue
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-[#6b6b66]">
              Example only. Setl never sees the bank password.
            </p>
          </>
        )}
    </div>
  );
}

function Handoff({ name, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">Signed in on Setl</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#6b6b66]">
        They approve the accounts {name} would cover. In this build the data comes from a statement they provide. Sign-in at {name} opens when that institution joins.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="rounded-xl bg-[#f6f5f2] px-3 py-2">accounts:read</li>
        <li className="rounded-xl bg-[#f6f5f2] px-3 py-2">transactions:read</li>
      </ul>
      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-sm font-medium text-[#141414] underline-offset-4 hover:underline"
      >
        Choose another institution
      </button>
    </div>
  );
}
