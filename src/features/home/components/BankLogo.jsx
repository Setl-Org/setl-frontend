/**
 * BankLogo - Renders a supported bank/wallet logo as a uniform "logo card".
 *
 * Prefers a real image when `bank.src` is set (drop files in public/banks/),
 * otherwise falls back to a brand-colored wordmark placeholder. Both render
 * inside the same neutral card so the row reads as a clean logo wall.
 *
 * @param {Object} props
 * @param {{ name: string, short?: string, color: string, src?: string|null }} props.bank
 */
export function BankLogo({ bank }) {
  return (
    <span
      title={bank.name}
      className="inline-flex h-12 items-center justify-center rounded-xl border border-border/70 bg-white px-5 shadow-sm"
    >
      {bank.src ? (
        <img
          src={bank.src}
          alt={bank.name}
          loading="lazy"
          className="h-6 w-auto object-contain"
        />
      ) : (
        <span
          className="text-base font-extrabold tracking-tight"
          style={{ color: bank.color }}
        >
          {bank.short ?? bank.name}
        </span>
      )}
    </span>
  );
}
